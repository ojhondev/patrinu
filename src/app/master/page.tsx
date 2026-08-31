import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Clock, Check, X } from "lucide-react";

import { isMasterSession } from "@/lib/auth";
import {
  logoutMaster,
  moderateArticle,
  moderateOpportunity,
  moderateProject,
  saveBanner,
  triggerIngest,
} from "./actions";
import { pendingProjects } from "@/lib/projects";
import { pendingOpportunities } from "@/lib/opportunities";
import { pendingArticles } from "@/lib/directory";
import { getSetting } from "@/lib/settings";
import { db } from "@/db";
import { financingRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/badge";
import { formatBRL, formatDate, specialtyLabel } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Master", robots: { index: false } };
export const maxDuration = 60; // "Rodar ingestão agora" pode demorar

const BANNERS = [
  {
    slot: "news" as const,
    title: "Banner das notícias",
    hint: "Aparece dentro de cada matéria e no topo da lista de notícias.",
  },
  {
    slot: "projects" as const,
    title: "Banner de Projetos (1920 × 500)",
    hint: "Faixa abaixo dos filtros na página Projetos. Use uma imagem 1920×500.",
  },
];

const IMG_HINT =
  "Cole o LINK DIRETO da imagem (termina em .jpg / .png). No ImgBB: abra a imagem, botão direito → Copiar endereço da imagem (i.ibb.co/…), não o link da página (ibb.co/…).";

export default async function MasterPage() {
  if (!(await isMasterSession())) redirect("/master/entrar");

  const [pending, pendingEditais, pendingNoticias, financing, banners] =
    await Promise.all([
      pendingProjects(),
      pendingOpportunities(),
      pendingArticles(),
      db.select().from(financingRequests).orderBy(desc(financingRequests.createdAt)),
      Promise.all(
        BANNERS.map(async (b) => ({
          ...b,
          image: await getSetting(`${b.slot}_banner_image`),
          link: await getSetting(`${b.slot}_banner_link`),
        })),
      ),
    ]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="inline-flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
            <ShieldCheck size={26} className="text-green-ink" />
            Master
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Acesso total — todas as contas, dados e conteúdos, sem barreiras.
          </p>
        </div>
        <form action={logoutMaster}>
          <button
            type="submit"
            className="rounded-lg border border-border-strong px-3.5 py-2 text-sm font-bold hover:border-green-ink"
          >
            Sair
          </button>
        </form>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Projetos", "/projetos"],
          ["Profissionais", "/profissionais"],
          ["Editais", "/editais"],
          ["Cursos", "/cursos"],
          ["Notícias", "/noticias"],
          ["Financiamento", "/financiamento"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3 text-sm font-semibold hover:border-green-ink"
          >
            {label} →
          </Link>
        ))}
      </div>

      <section className="mb-10 grid gap-5 sm:grid-cols-2">
        {banners.map((b) => (
          <div key={b.slot} className="border border-border bg-surface p-5">
            <h2 className="text-base font-bold">{b.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{b.hint}</p>
            <p className="mt-1 text-xs text-muted">{IMG_HINT}</p>
            <form action={saveBanner} className="mt-4 space-y-3">
              <input type="hidden" name="slot" value={b.slot} />
              <input
                name="image"
                defaultValue={b.image ?? ""}
                placeholder="https://i.ibb.co/…/banner.png"
                className="w-full border border-ink/25 bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
              />
              <input
                name="link"
                defaultValue={b.link ?? ""}
                placeholder="https://… (destino do clique, opcional)"
                className="w-full border border-ink/25 bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
              />
              <button
                type="submit"
                className="bg-green px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-green-hover"
              >
                Salvar
              </button>
            </form>
            {b.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.image}
                alt="Banner atual"
                className="mt-4 max-h-28 border border-ink/15"
              />
            )}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold">
          Projetos aguardando aprovação{" "}
          <span className="font-mono text-sm text-muted">({pending.length} na fila)</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Todo projeto publicado por um usuário passa por aqui antes de ir ao ar. Novos
          perfis não precisam de revisão. Editais e cursos entram na fila quando esses
          módulos forem ligados.
        </p>

        <div className="mt-4 space-y-3">
          {pending.length === 0 && (
            <p className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Nada na fila.
            </p>
          )}

          {pending.map((p) => {
            const mode =
              (p.requirements ?? []).find((r) => r.startsWith("__mode:"))?.slice(7) ??
              "aberto";
            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:flex-row sm:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">
                      {mode === "vitrine" ? "Vitrine" : "Brief aberto"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />
                      {p.submittedAt ? formatDate(p.submittedAt.toISOString()) : "—"}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-ink">{p.title}</p>
                  <p className="text-sm text-ink-soft">
                    {p.assetName} · {p.city}/{p.uf}
                    {p.year ? ` · ${p.year}` : ""}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{p.summary}</p>
                  {p.specialties.length > 0 && (
                    <p className="mt-1 text-xs text-muted">
                      {p.specialties.map((s) => specialtyLabel(s)).join(" · ")}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:w-56">
                  <form action={moderateProject} className="contents">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value="approve" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
                    >
                      <Check size={15} />
                      Aprovar e publicar
                    </button>
                  </form>
                  <form action={moderateProject} className="flex gap-1.5">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value="reject" />
                    <input
                      name="reason"
                      placeholder="Motivo (opcional)"
                      className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-2 py-2 text-xs outline-none focus:border-crit"
                    />
                    <button
                      type="submit"
                      aria-label="Recusar"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-2 text-sm font-bold text-ink-soft hover:border-crit hover:text-crit"
                    >
                      <X size={15} />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Radar: editais ingeridos ---- */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            Editais a aprovar{" "}
            <span className="font-mono text-sm text-muted">({pendingEditais.length})</span>
          </h2>
          <form action={triggerIngest}>
            <button
              type="submit"
              className="border border-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] hover:bg-ink hover:text-white"
            >
              Rodar ingestão agora
            </button>
          </form>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Coletados do PNCP e triados por palavra-chave. Revise o resumo, aprove ou recuse.
        </p>

        <div className="mt-4 space-y-3">
          {pendingEditais.length === 0 && (
            <p className="border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Nada na fila. Rode a ingestão ou aguarde a execução diária.
            </p>
          )}
          {pendingEditais.map(({ o, s }) => (
            <div key={o.id} className="border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <Badge tone="neutral">{s?.name ?? "PNCP"}</Badge>
                {o.deadlineAt && <span>prazo {formatDate(o.deadlineAt.toISOString())}</span>}
                {o.estimatedValue != null && <span>{formatBRL(Number(o.estimatedValue))}</span>}
                {o.uf && <span>{o.city ? `${o.city}/` : ""}{o.uf}</span>}
                {o.url && (
                  <a href={o.url} target="_blank" rel="noreferrer" className="text-green-ink hover:underline">
                    ver no PNCP →
                  </a>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                casou: {(o.matchedTerms ?? []).join(", ") || "—"}
              </p>
              <div className="mt-2 space-y-2">
                <form action={moderateOpportunity} className="space-y-2">
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="decision" value="aprovado" />
                  <input
                    name="title"
                    defaultValue={o.title}
                    className="w-full border border-ink/20 bg-surface px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-green-ink"
                  />
                  <textarea
                    name="summary"
                    defaultValue={o.summary ?? o.object ?? ""}
                    rows={3}
                    className="w-full border border-ink/20 bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-green-ink"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
                  >
                    <Check size={15} /> Aprovar e publicar
                  </button>
                </form>
                <form action={moderateOpportunity}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="decision" value="recusado" />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-crit"
                  >
                    <X size={13} /> Recusar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Radar: notícias ingeridas ---- */}
      <section className="mt-12">
        <h2 className="text-lg font-bold">
          Notícias a aprovar{" "}
          <span className="font-mono text-sm text-muted">({pendingNoticias.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Vindas de feeds RSS. Ajuste título/resumo, escolha a editoria, publique ou recuse.
        </p>

        <div className="mt-4 space-y-3">
          {pendingNoticias.length === 0 && (
            <p className="border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Nada na fila.
            </p>
          )}
          {pendingNoticias.map((a) => (
            <div key={a.id} className="border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{a.sourceName ?? "Fonte"}</span>
                <span>· {formatDate(a.publishedAt.toISOString())}</span>
                {a.sourceUrl && (
                  <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="text-green-ink hover:underline">
                    abrir matéria →
                  </a>
                )}
              </div>
              <div className="mt-2 space-y-2">
                <form action={moderateArticle} className="space-y-2">
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="decision" value="publicado" />
                  <input
                    name="title"
                    defaultValue={a.title}
                    className="w-full border border-ink/20 bg-surface px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-green-ink"
                  />
                  <textarea
                    name="excerpt"
                    defaultValue={a.excerpt}
                    rows={2}
                    className="w-full border border-ink/20 bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-green-ink"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      name="category"
                      defaultValue={a.category}
                      className="border border-ink/20 bg-surface px-2 py-1.5 text-sm"
                    >
                      {["obra", "tecnica", "politica", "mercado", "curso", "edital"].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ),
                      )}
                    </select>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
                    >
                      <Check size={15} /> Publicar
                    </button>
                  </div>
                </form>
                <form action={moderateArticle}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="decision" value="recusado" />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-crit"
                  >
                    <X size={13} /> Recusar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold">
          Pedidos de financiamento{" "}
          <span className="font-mono text-sm text-muted">({financing.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Enviados pela trilha &ldquo;Quero financiamento de obra&rdquo; para membros do Patrinu.
        </p>

        <div className="mt-4 space-y-3">
          {financing.length === 0 && (
            <p className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Nenhum pedido ainda.
            </p>
          )}
          {financing.map((f) => (
            <div
              key={f.id}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{f.status}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />
                  {formatDate(f.createdAt.toISOString())}
                </span>
              </div>
              <p className="mt-1 font-semibold text-ink">
                {f.assetName} — {f.organization}
              </p>
              <p className="text-sm text-ink-soft">
                {f.contactName} · {f.contactEmail}
                {f.city ? ` · ${f.city}` : ""}
                {f.uf ? `/${f.uf}` : ""}
              </p>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-ink-soft sm:grid-cols-2">
                {f.projectStage && (
                  <div>
                    <dt className="inline text-muted">Estágio: </dt>
                    <dd className="inline">{f.projectStage}</dd>
                  </div>
                )}
                {f.fundingGoal && (
                  <div>
                    <dt className="inline text-muted">Meta: </dt>
                    <dd className="inline">{f.fundingGoal}</dd>
                  </div>
                )}
                {f.mechanism && (
                  <div>
                    <dt className="inline text-muted">Mecanismo: </dt>
                    <dd className="inline">{f.mechanism}</dd>
                  </div>
                )}
              </dl>
              {f.summary && (
                <p className="mt-2 rounded-md bg-sunk px-3 py-2 text-sm text-ink-soft">
                  {f.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
