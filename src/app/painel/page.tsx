import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Clock, Coins, FileText, Plus, Sparkles } from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner } from "@/lib/projects";
import { creditStatus } from "@/lib/credits";
import type { Project, ProjectStatus } from "@/lib/types";
import {
  interestsByUser,
  interestsForOwner,
  proposalsByUser,
  proposalsForOwner,
} from "@/lib/interactions";
import { formatDate, specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { Avatar } from "@/components/avatar";
import { ProposalThread } from "@/components/proposal-thread";
import { updateAvatar } from "@/app/conta/actions";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Painel" };

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const AVAIL_LABEL: Record<string, string> = {
  imediata: "disponível imediatamente",
  "15_dias": "disponível em até 15 dias",
  "30_dias": "disponível em até 30 dias",
  a_combinar: "disponibilidade a combinar",
};

const STATUS_BADGE: Record<
  ProjectStatus,
  { tone: "green" | "neutral" | "ok" | "warn" | "crit"; label: string }
> = {
  rascunho: { tone: "neutral", label: "rascunho" },
  em_analise: { tone: "warn", label: "em análise" },
  recusado: { tone: "crit", label: "recusado" },
  vitrine: { tone: "green", label: "publicado · vitrine" },
  aberto: { tone: "green", label: "publicada" },
  em_captacao: { tone: "green", label: "em captação" },
  em_execucao: { tone: "ok", label: "em execução" },
  concluido: { tone: "ok", label: "concluído" },
};

const OPEN_STATUSES = ["aberto", "em_captacao"];

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="font-display text-lg font-bold text-ink">
      {children}
      {count != null && <span className="ml-1.5 text-sm font-medium text-muted">({count})</span>}
    </h2>
  );
}

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const sp = await searchParams;
  const enviado = one(sp.enviado) === "1";

  const plan = await getPlan();
  const isPro = plan === "pro";

  const [myProjects, myApplications, receivedInterests, receivedProposals, sentProposals, credits] =
    await Promise.all([
      projectsByOwner(user.id),
      interestsByUser(user.id),
      interestsForOwner(user.id),
      proposalsForOwner(user.id),
      proposalsByUser(user.id),
      creditStatus(user.id, isPro),
    ]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <details className="group relative">
            <summary className="cursor-pointer list-none">
              <Avatar name={user.name} src={user.avatarUrl} size={56} />
            </summary>
            <form
              action={updateAvatar}
              className="absolute left-0 top-full z-20 mt-2 w-72 rounded-card border border-border bg-surface p-3 shadow-[var(--shadow-pop)]"
            >
              <label className="mb-1 block text-xs font-semibold text-ink">URL da sua foto</label>
              <input
                name="avatarUrl"
                defaultValue={user.avatarUrl ?? ""}
                placeholder="https://…"
                className="w-full rounded-btn border border-border-strong bg-surface px-3 py-1.5 text-sm outline-none focus:border-brand"
              />
              <button type="submit" className="btn btn-primary btn-sm mt-2 w-full">
                Salvar foto
              </button>
              <p className="mt-1 text-[11px] text-muted">Upload de arquivo em breve.</p>
            </form>
          </details>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Olá, {user.name.split(/\s+/)[0]}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              <span
                className={cn(
                  "rounded-pill px-2 py-0.5 text-xs font-semibold",
                  isPro ? "bg-green-weak text-green-ink" : "bg-sunk text-ink-soft",
                )}
              >
                {isPro ? "Membro Pro" : "Conta gratuita"}
              </span>
              {!isPro && (
                <>
                  {" · "}
                  <Link href="/pro" className="font-semibold text-green-ink hover:underline">
                    torne-se membro
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/painel/perfil" className="btn btn-secondary">
            <BadgeCheck size={16} />
            Meu perfil profissional
          </Link>
          <Link href="/projetos/novo" className="btn btn-primary">
            <Plus size={16} />
            Publicar
          </Link>
        </div>
      </header>

      {enviado && (
        <div className="mb-6 flex items-start gap-3 rounded-card border border-green-ink/25 bg-green-weak p-4">
          <Clock size={18} className="mt-0.5 shrink-0 text-green-ink" />
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">Publicação em análise.</strong> Tudo que é publicado
            passa por revisão do time da Patrinu antes de ir ao ar — normalmente em até 1 dia útil.
          </p>
        </div>
      )}

      {/* ---------- CRÉDITOS ---------- */}
      <section className="mb-10">
        {isPro ? (
          <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles size={16} className="text-brand" />
              Membro Pro — publicações e candidaturas ilimitadas.
            </span>
          </div>
        ) : (
          <div className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                <Coins size={16} className="text-brand" />
                Créditos deste mês
              </span>
              <span className="text-sm font-extrabold tabular-nums text-ink">
                {credits.remaining}
                <span className="font-semibold text-muted"> de {credits.limit}</span>
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-sunk">
              <span
                className="block h-full rounded-pill bg-brand"
                style={{ width: `${(credits.remaining / credits.limit) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Publicar um projeto ou uma vaga e candidatar-se a uma vaga custam 1 crédito cada. O
              saldo volta a {credits.limit} no início de cada mês.{" "}
              <Link href="/pro" className="font-semibold text-green-ink hover:underline">
                Seja Pro para não ter limite
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* ---------- MINHAS PUBLICAÇÕES ---------- */}
      <section className="mb-12">
        <SectionTitle count={myProjects.length || undefined}>Minhas publicações</SectionTitle>
        <p className="mt-1 text-sm text-ink-soft">
          Vagas e projetos que você publicou — com o status de moderação.
        </p>
        <div className="mt-4 space-y-3">
          {myProjects.length === 0 ? (
            <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Você ainda não publicou nada.{" "}
              <Link href="/projetos/novo" className="font-semibold text-green-ink hover:underline">
                Publicar uma vaga ou um projeto
              </Link>
              .
            </p>
          ) : (
            myProjects.map((p) => <MyProjectRow key={p.id} p={p} />)
          )}
        </div>
      </section>

      {/* ---------- MINHAS CANDIDATURAS ---------- */}
      <section className="mb-12">
        <SectionTitle count={myApplications.length || undefined}>Minhas candidaturas</SectionTitle>
        <p className="mt-1 text-sm text-ink-soft">
          Vagas e projetos em que você se candidatou. O contratante entra em contato pelo e-mail
          ou WhatsApp que você informou.
        </p>
        <div className="mt-4 space-y-3">
          {myApplications.length === 0 ? (
            <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Você ainda não se candidatou a nenhuma vaga.{" "}
              <Link href="/vagas" className="font-semibold text-green-ink hover:underline">
                Ver vagas abertas
              </Link>
              .
            </p>
          ) : (
            myApplications.map((a) => {
              const open = OPEN_STATUSES.includes(a.projectStatus);
              return (
                <div key={a.projectId} className="card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={open ? "green" : "neutral"}>
                      {open ? "candidatura enviada" : "vaga encerrada"}
                    </Badge>
                    <span className="text-xs text-muted">
                      {formatDate(a.createdAt.toISOString())}
                    </span>
                  </div>
                  <Link
                    href={`/projetos/${a.projectSlug}`}
                    className="mt-1 block font-semibold text-ink hover:underline"
                  >
                    {a.projectTitle}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                    <span>
                      {a.nationwide
                        ? "Você atende todo o Brasil"
                        : a.applicantCity
                          ? `Sua praça: ${a.applicantCity}`
                          : null}
                    </span>
                    {a.availability && <span>{AVAIL_LABEL[a.availability] ?? a.availability}</span>}
                    {a.cvUrl && (
                      <a
                        href={a.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-green-ink hover:underline"
                      >
                        <FileText size={12} />
                        currículo enviado
                      </a>
                    )}
                  </div>
                  {a.message && (
                    <p className="mt-2 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
                      {a.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {open
                      ? "Aguardando retorno do contratante."
                      : "Esta vaga não está mais recebendo candidaturas."}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ---------- CANDIDATURAS RECEBIDAS ---------- */}
      {receivedInterests.length > 0 && (
        <section className="mb-12">
          <SectionTitle count={receivedInterests.length}>
            Candidaturas nas minhas publicações
          </SectionTitle>
          <p className="mt-1 text-sm text-ink-soft">
            Quem se candidatou às suas vagas ou pediu para participar dos seus projetos. Fale
            direto pelo e-mail ou WhatsApp.
          </p>
          <div className="mt-4 space-y-2">
            {receivedInterests.map((i) => (
              <div key={`${i.projectId}-${i.userId}`} className="card p-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-ink">{i.applicantName || i.userName}</span>
                  <a
                    href={`mailto:${i.applicantEmail || i.userEmail}`}
                    className="text-xs text-green-ink hover:underline"
                  >
                    {i.applicantEmail || i.userEmail}
                  </a>
                  <span className="text-xs text-muted">
                    · {formatDate(i.createdAt.toISOString())}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">
                  em{" "}
                  <Link
                    href={`/projetos/${i.projectSlug}`}
                    className="font-semibold text-green-ink hover:underline"
                  >
                    {i.projectTitle}
                  </Link>
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                  {i.nationwide ? (
                    <span>Atende todo o Brasil</span>
                  ) : (
                    i.applicantCity && <span>{i.applicantCity}</span>
                  )}
                  {i.availability && (
                    <span>{AVAIL_LABEL[i.availability] ?? i.availability}</span>
                  )}
                  {i.cvUrl && (
                    <a
                      href={i.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green-ink hover:underline"
                    >
                      Ver currículo (PDF)
                    </a>
                  )}
                </div>
                {i.message && (
                  <p className="mt-1.5 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
                    {i.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- PROPOSTAS (legado — só se houver) ---------- */}
      {receivedProposals.length > 0 && (
        <section className="mb-12">
          <SectionTitle count={receivedProposals.length}>Propostas recebidas</SectionTitle>
          <div className="mt-4 space-y-3">
            {receivedProposals.map((p) => (
              <ProposalThread key={p.id} proposal={p} viewer="owner" currentUserId={user.id} />
            ))}
          </div>
        </section>
      )}
      {sentProposals.length > 0 && (
        <section className="mb-12">
          <SectionTitle count={sentProposals.length}>Minhas propostas</SectionTitle>
          <div className="mt-4 space-y-3">
            {sentProposals.map((p) => (
              <ProposalThread key={p.id} proposal={p} viewer="proponent" currentUserId={user.id} />
            ))}
          </div>
        </section>
      )}

      {!isPro && (
        <section className="mt-4 rounded-card border border-brand/25 bg-green-weak/50 p-5">
          <p className="inline-flex items-center gap-2 font-display text-base font-bold text-ink">
            <Sparkles size={16} className="text-brand" />
            Patrinu Pro
          </p>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Publicações e candidaturas ilimitadas, contato dos contratantes das vagas visível,
            editais completos e prioridade no diretório de profissionais.
          </p>
          <Link href="/pro" className="btn btn-primary btn-sm mt-3">
            Ver planos
          </Link>
        </section>
      )}
    </div>
  );
}

function MyProjectRow({ p }: { p: Project }) {
  const s = STATUS_BADGE[p.status];
  const published = ["vitrine", "aberto", "em_captacao", "em_execucao", "concluido"].includes(
    p.status,
  );
  return (
    <div className="flex flex-col gap-2 card p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={s.tone}>{s.label}</Badge>
          <span className="text-xs text-muted">
            {p.entryKind === "vaga" ? "Vaga" : "Projeto"} · {p.city}/{p.uf}
            {p.year ? ` · ${p.year}` : ""}
          </span>
        </div>
        <p className="mt-1 font-semibold text-ink">{p.title}</p>
        <p className="line-clamp-1 text-sm text-ink-soft">{p.summary}</p>
        {p.status === "recusado" && (
          <p className="mt-1 text-xs font-semibold text-crit">
            Recusado. Ajuste e publique novamente.
          </p>
        )}
        {p.specialties.length > 0 && (
          <p className="mt-1 text-xs text-muted">
            {p.specialties.map((sp) => specialtyLabel(sp)).join(" · ")}
          </p>
        )}
      </div>
      {published && (
        <Link href={`/projetos/${p.slug}`} className="btn btn-secondary btn-sm shrink-0">
          Ver publicado
        </Link>
      )}
    </div>
  );
}
