import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  compatibleForProfissional,
  eligibilityForFinanciamento,
  prospectsForContratante,
  TRACKS,
} from "@/lib/pro";
import { formatDate, daysUntil } from "@/lib/taxonomy";
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
  const sp = await searchParams;
  const perfil = (one(sp.perfil) as Perfil) || "contratante";
  const novo = one(sp.novo) === "1";
  const track = TRACKS[perfil === "contratante" ? "contratar" : perfil === "profissional" ? "oferecer" : "financiamento"];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Painel</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Área do usuário · trilha <strong className="text-ink">{track.label}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          {PERFIS.map((p) => (
            <Link
              key={p.key}
              href={`/painel?perfil=${p.key}`}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                perfil === p.key
                  ? "border-green bg-green text-white"
                  : "border-border-strong text-ink hover:border-green-ink",
              )}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </header>

      {novo && (
        <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-green-ink/30 bg-green-weak p-4">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-green-ink" />
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">Cadastro concluído.</strong> Estes são os primeiros
            resultados para o seu perfil — os dados abaixo são de demonstração até a
            autenticação entrar.
          </p>
        </div>
      )}

      {perfil === "contratante" && <Contratante />}
      {perfil === "profissional" && <Profissional />}
      {perfil === "financiamento" && <Financiamento />}

      <p className="mt-10 text-xs text-muted">
        Protótipo — painel com dados de demonstração. Ver PRD v5 §10. Troque a trilha nos
        botões acima.
      </p>
    </div>
  );
}

/* ---------------- contratante ---------------- */

async function Contratante() {
  const prospects = await prospectsForContratante();
  const candidatos = prospects.filter((p) => p.status === "candidatou").length;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Prospectos" value={String(prospects.length)} icon={Users} />
        <Tile label="Candidaturas" value={String(candidatos)} icon={BadgeCheck} />
        <Tile label="Projetos publicados" value="2" icon={TrendingUp} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Prospectos para os seus projetos</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Profissionais que deram match ou se candidataram, ordenados por aderência.
        </p>
        <div className="mt-4 space-y-3">
          {prospects.map((p) => (
            <div
              key={`${p.professionalSlug}-${p.projectSlug}`}
              className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
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
                  {p.professional?.verified && (
                    <BadgeCheck size={15} className="text-green" />
                  )}
                  <ProspectStatus status={p.status} />
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">
                  <Link
                    href={`/projetos/${p.projectSlug}`}
                    className="hover:underline"
                  >
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
                  {p.status === "candidatou" ? "Ver proposta" : "Convidar"}
                </button>
              </div>
            </div>
          ))}
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

/* ---------------- profissional ---------------- */

async function Profissional() {
  const opps = await compatibleForProfissional();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Oportunidades compatíveis" value={String(opps.length)} icon={Sparkles} />
        <Tile label="Candidaturas" value="1" icon={BadgeCheck} />
        <Tile label="Visitas ao perfil (7d)" value="34" icon={TrendingUp} />
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
                <div className="mt-3 flex gap-2">
                  <Link
                    href={o.kind === "edital" ? `/editais/${o.id}` : `/projetos/${o.id}`}
                    className="rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
                  >
                    {o.kind === "edital" ? "Responder" : "Enviar proposta"}
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border border-border-strong px-3.5 py-2 text-sm font-bold hover:border-green-ink"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ---------------- financiamento ---------------- */

async function Financiamento() {
  const signals = await eligibilityForFinanciamento();
  const elegiveis = signals.filter((s) => s.status === "elegivel").length;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Investidores sinalizando" value={String(signals.length)} icon={Users} />
        <Tile label="Elegibilidade confirmada" value={String(elegiveis)} icon={BadgeCheck} />
        <Tile label="Meta de captação" value="R$ 4,2 mi" icon={TrendingUp} />
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

        <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-green-weak p-5">
          <h3 className="font-bold text-ink">Dossiê do projeto</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Descrição, impacto e enquadramento fiscal gerados — prontos para enviar a um
            patrocinador.
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
          >
            Abrir dossiê
          </button>
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
