import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  FileWarning,
  MapPin,
  Building2,
  CalendarClock,
  ShieldCheck,
  Users,
} from "lucide-react";

import { getOpportunity, relatedOpportunities } from "@/lib/opportunities";
import {
  daysUntil,
  formatBRL,
  formatDate,
  kindLabel,
  scopeLabel,
  specialtyLabel,
} from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { MatchScore } from "@/components/match-score";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { OpportunityCard } from "@/components/opportunity-card";
import { DEMO_PROFESSIONAL, documentSatisfies } from "@/lib/mock/professional";
import { has } from "@/lib/membership";
import { UpgradeButton } from "@/components/upgrade-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const op = await getOpportunity(id);
  return { title: op ? op.title : "Oportunidade" };
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const op = await getOpportunity(id);
  if (!op) notFound();

  if (!(await has("pro"))) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <Link
          href="/editais"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={14} />
          Editais
        </Link>
        <h1 className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight text-balance">
          {op.title}
        </h1>
        <p className="mt-3 text-ink-soft">
          O detalhe do edital, o checklist de habilitação e o fluxo de resposta são{" "}
          <strong className="text-ink">para membros</strong>.
        </p>
        <div className="mt-6 flex justify-center">
          <UpgradeButton label="Torne-se membro" />
        </div>
      </div>
    );
  }

  const related = await relatedOpportunities(op);
  const pro = DEMO_PROFESSIONAL;
  const checklist = op.habilitacao.map((req) => ({
    ...req,
    met: documentSatisfies(req.label),
  }));
  const metCount = checklist.filter((c) => c.met).length;
  const missing = checklist.length - metCount;
  const d = daysUntil(op.deadlineAt);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-11">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft">
        <Link href="/editais" className="inline-flex items-center gap-1 hover:text-ink">
          <ArrowLeft size={13} />
          Editais
        </Link>
        <ChevronRight size={12} className="text-muted" />
        <Link href={`/editais?specialty=${op.specialties[0]}`} className="hover:text-ink">
          {specialtyLabel(op.specialties[0] ?? "arquitetura")}
        </Link>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ---------------- main ---------------- */}
        <article className="min-w-0">
          <p className="kicker text-green-ink">
            {kindLabel(op.kind)}
            {" · "}
            {op.specialties.map((s) => specialtyLabel(s)).join(" · ")}
          </p>

          <h1 className="display mt-3 text-3xl text-ink sm:text-5xl">{op.title}</h1>

          {/* órgão "seller" row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sunk text-ink-soft">
                <Building2 size={16} />
              </span>
              {op.organ.split("—")[0].trim()}
            </span>
            <span className="inline-flex items-center gap-1 text-ink-soft">
              <MapPin size={14} />
              {op.city ? `${op.city}/${op.uf}` : op.uf ?? "Nacional"} ·{" "}
              {scopeLabel(op.organScope)}
            </span>
            <MatchScore score={op.relevanceScore} />
          </div>

          {/* gallery */}
          <SpecialtyThumb
            specialty={op.specialties[0] ?? "arquitetura"}
            className="mt-6 aspect-[16/8] w-full rounded-[var(--radius-card)]"
          />

          <section className="mt-8">
            <h2 className="text-lg font-bold">Resumo</h2>
            <p className="mt-2 text-ink-soft">{op.summary}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-bold">Objeto</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{op.object}</p>
          </section>

          {op.techniques.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">Técnicas envolvidas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {op.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-6 grid gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {op.kind === "licitacao" ? "Valor estimado" : "Recurso"}
              </p>
              <p className="mt-1 font-bold tabular-nums">{formatBRL(op.estimatedValue)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Prazo
              </p>
              <p className="mt-1 font-bold">
                {op.deadlineAt ? formatDate(op.deadlineAt) : "Fluxo contínuo"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Publicado
              </p>
              <p className="mt-1 font-bold">{formatDate(op.publishedAt)}</p>
            </div>
          </section>

          {op.outcome && (
            <section className="mt-6 rounded-[var(--radius-card)] border border-ok/40 bg-[color-mix(in_oklab,var(--ok)_7%,transparent)] p-4">
              <h2 className="text-sm font-bold text-ok">Desfecho registrado</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Homologado para <strong className="text-ink">{op.outcome.winner}</strong>
                {op.outcome.winnerValue
                  ? ` por ${formatBRL(op.outcome.winnerValue)}`
                  : ""}
                {op.outcome.homologatedAt
                  ? ` em ${formatDate(op.outcome.homologatedAt)}`
                  : ""}
                . Mantido no acervo para a base histórica.
              </p>
            </section>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {op.url && (
              <a
                href={op.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-2 font-semibold hover:border-green-ink"
              >
                Ver na fonte oficial
                <ExternalLink size={14} />
              </a>
            )}
            <span className="text-muted">
              {op.source.name} · {op.externalId}
            </span>
          </div>
        </article>

        {/* ---------------- responder panel ---------------- */}
        <aside className="lg:sticky lg:top-[84px] lg:h-max">
          <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-bold">Responder</span>
              {d != null && d >= 0 && op.status === "aberta" && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-warn">
                  <CalendarClock size={13} />
                  {d} dias
                </span>
              )}
            </div>

            <div className="p-5">
              {op.status === "aberta" ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <ShieldCheck size={15} className="text-green-ink" />
                    Perfil {pro.displayName}
                    {pro.verified && (
                      <Badge tone="green" className="ml-1">
                        verificado
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-extrabold tabular-nums">
                      {metCount}/{checklist.length}
                    </span>
                    <span className="text-xs text-ink-soft">
                      itens de habilitação já cobertos pelo seu cofre
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunk">
                    <div
                      className="h-full rounded-full bg-green"
                      style={{ width: `${(metCount / checklist.length) * 100}%` }}
                    />
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {checklist.map((item) => (
                      <li key={item.label} className="flex gap-2 text-sm">
                        <span
                          className={
                            item.met ? "mt-0.5 shrink-0 text-ok" : "mt-0.5 shrink-0 text-warn"
                          }
                        >
                          {item.met ? <Check size={15} /> : <FileWarning size={15} />}
                        </span>
                        <span className={item.met ? "text-ink-soft" : "text-ink"}>
                          {item.label}
                          {item.detail && (
                            <span className="block text-xs text-muted">{item.detail}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-lg bg-green px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-hover"
                  >
                    {missing === 0
                      ? "Manifestar interesse"
                      : `Manifestar interesse · faltam ${missing}`}
                  </button>
                  <button
                    type="button"
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-bold hover:border-green-ink"
                  >
                    <Users size={15} />
                    Quero participar
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    &ldquo;Quero participar&rdquo; te coloca na lista de interessados deste
                    edital — quem vencer pode te chamar para a equipe. Protótipo, sem
                    gravação ainda.
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Oportunidade {op.status}. Mantida no acervo para a base histórica de
                  desfecho.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ---------------- related ---------------- */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Oportunidades relacionadas
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <OpportunityCard key={r.id} op={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
