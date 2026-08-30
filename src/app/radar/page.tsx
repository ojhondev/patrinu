import type { Metadata } from "next";
import { Suspense } from "react";

import { RadarFilters } from "@/components/radar-filters";
import { OpportunityCard } from "@/components/opportunity-card";
import { CategoryRail } from "@/components/category-rail";
import { HeaderSearch } from "@/components/header-search";
import { listOpportunities } from "@/lib/opportunities";
import type { OpportunityFilters, OpportunitySort } from "@/lib/types";
import type { KindKey, OrganScopeKey, SpecialtyKey } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Radar de Oportunidades",
  description:
    "Licitações, editais e chamamentos de restauro e conservação de patrimônio, estruturados e filtráveis.",
};

type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function toFilters(sp: SearchParams): OpportunityFilters {
  const min = one(sp.minValue);
  return {
    q: one(sp.q),
    specialty: one(sp.specialty) as SpecialtyKey | undefined,
    uf: one(sp.uf),
    kind: one(sp.kind) as KindKey | undefined,
    scope: one(sp.scope) as OrganScopeKey | undefined,
    minValue: min ? Number(min) : undefined,
    sort: (one(sp.sort) as OpportunitySort | undefined) ?? "prazo",
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
  const q = filters.q;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {q ? (
            <>
              Resultados para <span className="accent">“{q}”</span>
            </>
          ) : (
            "Radar de Oportunidades"
          )}
        </h1>
        <p className="mt-1 text-ink-soft">
          Feed do mercado de restauro e conservação. Dados de demonstração no formato da
          ingestão real —{" "}
          <a
            href="/docs/radar-fontes.html"
            className="font-semibold text-green-ink underline underline-offset-2"
          >
            ver as 30 fontes
          </a>
          .
        </p>
      </header>

      <div className="mb-5 max-w-xl md:hidden">
        <Suspense>
          <HeaderSearch compact defaultValue={q ?? ""} />
        </Suspense>
      </div>

      <div className="mb-6 border-b border-border pb-3">
        <CategoryRail className="pb-1" />
      </div>

      <div className="sticky top-[72px] z-10 -mx-4 mb-6 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-11 lg:px-11">
        <Suspense>
          <RadarFilters total={opportunities.length} />
        </Suspense>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center">
          <p className="font-semibold text-ink">Nenhuma oportunidade com esses filtros</p>
          <p className="mt-1 text-sm text-ink-soft">
            Tente ampliar a região ou a faixa de valor.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {opportunities.map((op) => (
            <OpportunityCard key={op.id} op={op} />
          ))}
        </div>
      )}
    </div>
  );
}
