import type { Metadata } from "next";
import { Suspense } from "react";

import { RadarFilters } from "@/components/radar-filters";
import { OpportunityCard } from "@/components/opportunity-card";
import { listOpportunities } from "@/lib/opportunities";
import type { OpportunityFilters } from "@/lib/types";
import type { KindKey, OrganScopeKey, SpecialtyKey } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Radar de Oportunidades",
  description:
    "Licitações, editais e chamamentos de restauro e conservação de patrimônio, estruturados e filtráveis.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toFilters(sp: SearchParams): OpportunityFilters {
  return {
    q: one(sp.q),
    specialty: one(sp.specialty) as SpecialtyKey | undefined,
    uf: one(sp.uf),
    kind: one(sp.kind) as KindKey | undefined,
    scope: one(sp.scope) as OrganScopeKey | undefined,
  };
}

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = toFilters(sp);
  const opportunities = await listOpportunities(filters);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Radar de Oportunidades</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Feed do mercado de restauro e conservação. Dados de demonstração no formato da
          ingestão real — ver{" "}
          <a
            href="/docs/radar-fontes.html"
            className="text-accent underline underline-offset-2"
          >
            fontes do Radar
          </a>
          .
        </p>
      </header>

      <Suspense>
        <RadarFilters />
      </Suspense>

      <p className="mt-4 mb-3 font-mono text-xs text-muted">
        {opportunities.length}{" "}
        {opportunities.length === 1 ? "oportunidade" : "oportunidades"}
      </p>

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong p-10 text-center text-sm text-muted">
          Nenhuma oportunidade com esses filtros.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {opportunities.map((op) => (
            <OpportunityCard key={op.id} op={op} />
          ))}
        </div>
      )}
    </main>
  );
}
