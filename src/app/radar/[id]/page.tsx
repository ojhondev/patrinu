import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  FileWarning,
  MapPin,
  Building2,
  CalendarClock,
  Users,
} from "lucide-react";

import { getOpportunity } from "@/lib/opportunities";
import {
  daysUntil,
  formatBRL,
  formatDate,
  kindLabel,
  scopeLabel,
  specialtyLabel,
} from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { DEMO_PROFESSIONAL, documentSatisfies } from "@/lib/mock/professional";

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

  const pro = DEMO_PROFESSIONAL;
  const checklist = op.habilitacao.map((req) => ({
    ...req,
    met: documentSatisfies(req.label, pro),
  }));
  const metCount = checklist.filter((c) => c.met).length;
  const missing = checklist.length - metCount;
  const d = daysUntil(op.deadlineAt);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <Link
        href="/radar"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Radar
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
        {/* main */}
        <article>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="rust">{kindLabel(op.kind)}</Badge>
            <Badge tone={op.status === "aberta" ? "accent" : op.status === "homologada" ? "ok" : "neutral"}>
              {op.status}
            </Badge>
            {op.specialties.map((s) => (
              <Badge key={s}>{specialtyLabel(s)}</Badge>
            ))}
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight leading-snug text-balance">
            {op.title}
          </h1>

          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-ink-soft">
              <Building2 size={15} className="text-muted shrink-0" />
              {op.organ}
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <MapPin size={15} className="text-muted shrink-0" />
              {op.city ? `${op.city}/${op.uf}` : op.uf ?? "Nacional"} · {scopeLabel(op.organScope)}
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <CalendarClock size={15} className="text-muted shrink-0" />
              {op.deadlineAt
                ? `Prazo ${formatDate(op.deadlineAt)}${d != null && d >= 0 ? ` · ${d} d` : ""}`
                : "Fluxo contínuo"}
            </div>
            <div className="flex items-center gap-2 font-mono tabular-nums text-ink-soft">
              {formatBRL(op.estimatedValue)}
            </div>
          </dl>

          <section className="mt-6">
            <h2 className="font-mono text-xs uppercase tracking-wide text-muted">Resumo</h2>
            <p className="mt-2 text-ink-soft leading-relaxed">{op.summary}</p>
          </section>

          <section className="mt-5">
            <h2 className="font-mono text-xs uppercase tracking-wide text-muted">
              Objeto (texto do edital)
            </h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{op.object}</p>
          </section>

          {op.techniques.length > 0 && (
            <section className="mt-5">
              <h2 className="font-mono text-xs uppercase tracking-wide text-muted">Técnicas</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {op.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {op.outcome && (
            <section className="mt-6 rounded-lg border border-ok/40 bg-ok/5 p-4 text-sm">
              <h2 className="font-mono text-xs uppercase tracking-wide text-ok">Desfecho</h2>
              <p className="mt-1.5 text-ink-soft">
                Homologado para <strong className="text-ink">{op.outcome.winner}</strong>
                {op.outcome.winnerValue
                  ? ` por ${formatBRL(op.outcome.winnerValue)}`
                  : ""}
                {op.outcome.homologatedAt
                  ? ` em ${formatDate(op.outcome.homologatedAt)}`
                  : ""}
                .
              </p>
            </section>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {op.url && (
              <a
                href={op.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-border-strong"
              >
                Fonte oficial
                <ExternalLink size={14} />
              </a>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-mono text-muted">
              {op.source.name} · {op.externalId}
            </span>
          </div>
        </article>

        {/* responder — Marketplace camada A */}
        <aside className="lg:sticky lg:top-20 h-max rounded-lg border border-border bg-surface p-5">
          <h2 className="font-semibold">Responder</h2>
          <p className="mt-1 text-xs text-muted">
            Perfil: {pro.displayName} · {pro.city}/{pro.uf}
          </p>

          {op.status === "aberta" ? (
            <>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {metCount}/{checklist.length}
                </span>
                <span className="text-xs text-muted">
                  itens de habilitação cobertos pelo seu cofre
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {checklist.map((item) => (
                  <li key={item.label} className="flex gap-2 text-sm">
                    <span
                      className={
                        item.met
                          ? "mt-0.5 shrink-0 text-ok"
                          : "mt-0.5 shrink-0 text-warn"
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
                className="mt-4 w-full rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
              >
                {missing === 0
                  ? "Manifestar interesse"
                  : `Manifestar interesse · faltam ${missing}`}
              </button>
              <button
                type="button"
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-border-strong"
              >
                <Users size={14} />
                Formar consórcio
              </button>
              <p className="mt-3 text-[0.68rem] leading-relaxed text-muted">
                Protótipo — o fluxo de manifestação, cofre de documentos e consórcio será
                persistido no banco (ver PRD §6.2, camada A).
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Oportunidade {op.status}. Mantida no Radar para a base histórica de desfecho.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
