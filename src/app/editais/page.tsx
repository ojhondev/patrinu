import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RadarFilters } from "@/components/radar-filters";
import { OpportunityCard } from "@/components/opportunity-card";
import { HeaderSearch } from "@/components/header-search";
import { PageHero } from "@/components/page-hero";
import { LockedPanel } from "@/components/locked";
import { listOpportunities } from "@/lib/opportunities";
import { has } from "@/lib/membership";
import type { OpportunityFilters, OpportunitySort } from "@/lib/types";
import type { KindKey, OrganScopeKey, SpecialtyKey } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Editais e licitações",
  description:
    "Licitações, editais e chamamentos de restauro e conservação de patrimônio, de fontes públicas, com checklist de habilitação.",
};

type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function toFilters(sp: SearchParams): OpportunityFilters {
  const min = one(sp.minValue);
  return {
    q: one(sp.q),
    specialty: one(sp.specialty) as SpecialtyKey | undefined,
    grupo: one(sp.grupo),
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
  const [opportunities, isPro] = await Promise.all([
    listOpportunities(filters),
    has("pro"),
  ]);
  const q = filters.q;

  const grid =
    opportunities.length === 0 ? (
      <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center">
        <p className="font-semibold text-ink">Nenhuma oportunidade com esses filtros</p>
        <p className="mt-1 text-sm text-ink-soft">
          Tente ampliar a região ou a faixa de valor.
        </p>
      </div>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {opportunities.slice(0, isPro ? undefined : 8).map((op) => (
          <OpportunityCard key={op.id} op={op} />
        ))}
      </div>
    );

  return (
    <div>
      <PageHero
        tone="band"
        eyebrow="O Radar de Editais"
        title={
          q ? (
            <>
              Editais <span className="accent text-accent">“{q}”</span>
            </>
          ) : (
            <>
              Licitações e chamamentos de{" "}
              <span className="accent text-accent">patrimônio</span>
            </>
          )
        }
      >
        Coletados de fontes públicas, revisados pelo time e organizados com checklist de
        habilitação —{" "}
        <Link href="/fontes" className="font-semibold text-accent underline">
          ver as fontes monitoradas
        </Link>
        .
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <div className="mb-5 max-w-xl md:hidden">
        <Suspense>
          <HeaderSearch compact defaultValue={q ?? ""} />
        </Suspense>
      </div>

      <div className="sticky top-[64px] z-10 -mx-4 mb-6 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-11 lg:px-11">
        <Suspense>
          <RadarFilters total={opportunities.length} />
        </Suspense>
      </div>

      {isPro ? (
        grid
      ) : (
        <LockedPanel
          title="O Radar de Editais é para membros"
          body="Feed completo, alertas por perfil, checklist de habilitação e histórico de desfecho. Membros veem tudo."
          cta="Torne-se membro"
        >
          {grid}
        </LockedPanel>
      )}
      </div>
    </div>
  );
}
