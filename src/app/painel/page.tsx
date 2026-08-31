import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner } from "@/lib/projects";
import type { Project, ProjectStatus } from "@/lib/types";
import {
  compatibleForProfissional,
  eligibilityForFinanciamento,
  prospectsForContratante,
} from "@/lib/pro";
import { formatDate, daysUntil, specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { SpecialtyIcon } from "@/components/specialty-visual";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Painel" };

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

type Perfil = "contratante" | "profissional" | "financiamento";
const PERFIS: { key: Perfil; label: string }[] = [
  { key: "contratante", label: "Contratante" },
  { key: "profissional", label: "Profissional" },
  { key: "financiamento", label: "Financiamento" },
];

const TRACK_TO_PERFIL: Record<string, Perfil> = {
  contratar: "contratante",
  oferecer: "profissional",
  financiamento: "financiamento",
};

const STATUS_BADGE: Record<
  ProjectStatus,
  { tone: "green" | "neutral" | "ok" | "warn" | "crit"; label: string }
> = {
  rascunho: { tone: "neutral", label: "rascunho" },
  em_analise: { tone: "warn", label: "em análise" },
  recusado: { tone: "crit", label: "recusado" },
  vitrine: { tone: "green", label: "publicado · vitrine" },
  aberto: { tone: "green", label: "publicado · brief aberto" },
  em_captacao: { tone: "green", label: "em captação" },
  em_execucao: { tone: "ok", label: "em execução" },
  concluido: { tone: "ok", label: "concluído" },
};

function Tile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <Icon size={14} className="text-green-ink" />
        {label}
      </div>
      <p className="mt-1.5 font-display text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
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
  const defaultPerfil = TRACK_TO_PERFIL[user.track ?? ""] ?? "contratante";
  const perfil = (one(sp.perfil) as Perfil) || defaultPerfil;

  const [plan, myProjects] = await Promise.all([
    getPlan(),
    projectsByOwner(user.id),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Olá, {user.name.split(/\s+/)[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Plano{" "}
            <strong className="text-ink">
              {plan === "pro" ? "Pro" : plan === "cadastrado" ? "Cadastrado (grátis)" : "Visitante"}
            </strong>
            {plan !== "pro" && (
              <>
                {" · "}
                <Link href="/pro" className="font-semibold text-green-ink hover:underline">
                  assinar Pro
                </Link>
              </>
            )}
          </p>
        </div>
        <Link
          href="/projetos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
        >
          <Plus size={16} />
          Publicar projeto
        </Link>
      </header>

      {enviado && (
        <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-green-ink/30 bg-green-weak p-4">
          <Clock size={18} className="mt-0.5 shrink-0 text-green-ink" />
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">Projeto em análise.</strong> Tudo que é publicado
            passa por revisão do time da Patrinu antes de ir ao ar — normalmente em até 1
            dia útil.
          </p>
        </div>
      )}

      {/* ---------- MEUS PROJETOS (real) ---------- */}
      <section className="mb-12">
        <h2 className="text-lg font-bold">Meus projetos</h2>
        <div className="mt-4 space-y-3">
          {myProjects.length === 0 ? (
            <p className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              Você ainda não publicou nenhum projeto.{" "}
              <Link href="/projetos/novo" className="font-semibold text-green-ink hover:underline">
                Publicar o primeiro
              </Link>
              .
            </p>
          ) : (
            myProjects.map((p) => <MyProjectRow key={p.id} p={p} />)
          )}
        </div>
      </section>

      {/* ---------- DEMONSTRAÇÃO ---------- */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-8">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Oportunidades e conexões
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Prévia de demonstração — os dados abaixo ainda são exemplos.
          </p>
        </div>
        <div className="flex gap-2">
          {PERFIS.map((pf) => (
            <Link
              key={pf.key}
              href={`/painel?perfil=${pf.key}`}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                perfil === pf.key
                  ? "border-green bg-green text-white"
                  : "border-border-strong text-ink hover:border-green-ink",
              )}
            >
              {pf.label}
            </Link>
          ))}
        </div>
      </div>

      {perfil === "contratante" && <Contratante />}
      {perfil === "profissional" && <Profissional />}
      {perfil === "financiamento" && <Financiamento />}
    </div>
  );
}

function MyProjectRow({ p }: { p: Project }) {
  const s = STATUS_BADGE[p.status];
  const published = ["vitrine", "aberto", "em_captacao", "em_execucao", "concluido"].includes(
    p.status,
  );
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={s.tone}>{s.label}</Badge>
          <span className="text-xs text-muted">
            {p.city}/{p.uf}
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
        <Link
          href={`/projetos/${p.slug}`}
          className="shrink-0 rounded-lg border border-border-strong px-3.5 py-2 text-sm font-bold hover:border-green-ink"
        >
          Ver publicado
        </Link>
      )}
    </div>
  );
}

/* ---------------- contratante (demo) ---------------- */

function ProspectRow({
  p,
}: {
  p: Awaited<ReturnType<typeof prospectsForContratante>>[number];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:flex-row sm:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-weak text-green-ink">
        <SpecialtyIcon
          specialty={p.professional?.specialties[0] ?? "arquitetura"}
          size={20}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/profissionais/${p.professionalSlug}`}
            className="font-semibold text-ink hover:underline"
          >
            {p.professional?.displayName ?? p.professionalSlug}
          </Link>
          {p.professional?.verified && <BadgeCheck size={15} className="text-green" />}
          <ProspectStatus status={p.status} />
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">
          <Link href={`/projetos/${p.projectSlug}`} className="hover:underline">
            {p.projectTitle}
          </Link>{" "}
          — {p.reason}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-bold text-green-ink tabular-nums">
          {Math.round(p.fit * 100)}%
        </span>
        <button
          type="button"
          className="rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
        >
          {p.status === "candidatou" || p.status === "em_conversa"
            ? "Ver proposta"
            : "Convidar"}
        </button>
      </div>
    </div>
  );
}

async function Contratante() {
  const prospects = await prospectsForContratante();
  const candidatos = prospects.filter(
    (p) => p.status === "candidatou" || p.status === "em_conversa",
  );
  const matches = prospects.filter(
    (p) => p.status === "match" || p.status === "convidado",
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Candidaturas" value={String(candidatos.length)} icon={BadgeCheck} />
        <Tile label="Matches (não candidatados)" value={String(matches.length)} icon={Sparkles} />
        <Tile label="Projetos publicados" value="—" icon={TrendingUp} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Quem se candidatou</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Profissionais e ateliês que enviaram proposta ou manifestaram interesse nos seus
          projetos.
        </p>
        <div className="mt-4 space-y-3">
          {candidatos.length > 0 ? (
            candidatos.map((p) => (
              <ProspectRow key={`${p.professionalSlug}-${p.projectSlug}`} p={p} />
            ))
          ) : (
            <p className="text-sm text-muted">Nenhuma candidatura ainda.</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Matches sugeridos</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Deram match com o seu projeto pelo perfil, mas ainda não se candidataram — você
          pode convidar.
        </p>
        <div className="mt-4 space-y-3">
          {matches.length > 0 ? (
            matches.map((p) => (
              <ProspectRow key={`${p.professionalSlug}-${p.projectSlug}`} p={p} />
            ))
          ) : (
            <p className="text-sm text-muted">Nenhum match no momento.</p>
          )}
        </div>
      </section>
    </>
  );
}

function ProspectStatus({ status }: { status: string }) {
  const map: Record<string, { tone: "green" | "neutral" | "ok"; label: string }> = {
    candidatou: { tone: "ok", label: "candidatou-se" },
    match: { tone: "neutral", label: "deu match" },
    convidado: { tone: "green", label: "convidado" },
    em_conversa: { tone: "green", label: "em conversa" },
  };
  const m = map[status] ?? map.match;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

/* ---------------- profissional (demo) ---------------- */

async function Profissional() {
  const opps = await compatibleForProfissional();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Oportunidades compatíveis" value={String(opps.length)} icon={Sparkles} />
        <Tile label="Candidaturas" value="—" icon={BadgeCheck} />
        <Tile label="Visitas ao perfil (7d)" value="—" icon={TrendingUp} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Oportunidades compatíveis com o seu perfil</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Editais e projetos abertos que casam com especialidade, técnica, região e porte.
        </p>
        <div className="mt-4 space-y-3">
          {opps.map((o) => {
            const d = daysUntil(o.deadlineAt);
            return (
              <div
                key={o.id}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green">{o.kind === "edital" ? "Edital" : "Projeto aberto"}</Badge>
                  <span className="text-sm font-bold text-green-ink tabular-nums">
                    {Math.round(o.fit * 100)}% aderência
                  </span>
                  {d != null && d >= 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-warn">
                      <Clock size={12} />
                      {d} dias
                    </span>
                  )}
                </div>
                <Link
                  href={o.kind === "edital" ? `/editais/${o.id}` : `/projetos/${o.id}`}
                  className="mt-1.5 block font-semibold text-ink hover:underline"
                >
                  {o.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                  <span>{o.organ}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {o.uf}
                  </span>
                  <span className="font-mono">{o.value}</span>
                  {o.deadlineAt && <span>· prazo {formatDate(o.deadlineAt)}</span>}
                </div>
                <p className="mt-2 text-sm text-ink-soft">{o.reason}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ---------------- financiamento (demo) ---------------- */

async function Financiamento() {
  const signals = await eligibilityForFinanciamento();
  const elegiveis = signals.filter((s) => s.status === "elegivel").length;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Investidores sinalizando" value={String(signals.length)} icon={Users} />
        <Tile label="Elegibilidade confirmada" value={String(elegiveis)} icon={BadgeCheck} />
        <Tile label="Meta de captação" value="—" icon={TrendingUp} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Quem sinaliza elegibilidade</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Bancos, institutos, estatais e leis de incentivo que marcaram o seu projeto como
          aderente — com o próximo passo.
        </p>
        <div className="mt-4 space-y-3">
          {signals.map((s) => (
            <div
              key={`${s.investor}-${s.projectSlug}`}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{s.investor}</span>
                <EligibilityStatus status={s.status} />
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                <Link href={`/projetos/${s.projectSlug}`} className="hover:underline">
                  {s.projectTitle}
                </Link>{" "}
                — {s.reason}
              </p>
              <p className="mt-2 rounded-md bg-sunk px-3 py-2 text-sm text-ink-soft">
                <strong className="text-ink">Próximo passo:</strong> {s.nextStep}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function EligibilityStatus({ status }: { status: string }) {
  const map: Record<string, { tone: "ok" | "warn" | "neutral"; label: string }> = {
    elegivel: { tone: "ok", label: "elegível" },
    aderencia_parcial: { tone: "warn", label: "aderência parcial" },
    em_analise: { tone: "neutral", label: "em análise" },
  };
  const m = map[status] ?? map.em_analise;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
