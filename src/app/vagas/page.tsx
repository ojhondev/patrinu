import type { Metadata } from "next";
import { Suspense } from "react";

import { listProjects } from "@/lib/projects";
import { getPlan } from "@/lib/membership";
import { CONTRACT_TYPES, SENIORITY, WORK_MODES, UFS } from "@/lib/taxonomy";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { VagaCard } from "@/components/vaga-card";
import { FilterBar } from "@/components/filter-bar";
import { HeaderSearch } from "@/components/header-search";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vagas",
  description:
    "Vagas em escritórios de restauro, ateliês, museus e órgãos de patrimônio — com função, áreas de atuação e faixa salarial.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const CONTRACT_SEGMENTS = [
  { key: "todas", label: "Todas" },
  ...Object.entries(CONTRACT_TYPES).map(([key, label]) => ({ key, label })),
];

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = one(sp.q);
  const grupo = one(sp.grupo);
  const uf = one(sp.uf);
  const seniority = one(sp.seniority);
  const workMode = one(sp.workMode);
  const contractSeg = one(sp.contract);
  const contractType = contractSeg && contractSeg !== "todas" ? contractSeg : undefined;

  const [items, isPro] = await Promise.all([
    listProjects({
      mode: "abertos",
      entryKind: "vaga",
      q,
      grupo,
      uf,
      seniority,
      workMode,
      contractType,
    }),
    (async () => (await getPlan()) === "pro")(),
  ]);

  return (
    <div>
      <header className="border-b border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11 lg:py-14">
          <p className="kicker text-muted">Contratação no patrimônio</p>
          <h1 className="display mt-2 max-w-4xl text-3xl text-ink sm:text-5xl">
            {q ? (
              <>
                Vagas <span className="accent font-medium text-green-ink">“{q}”</span>
              </>
            ) : (
              <>
                Vagas <span className="accent font-medium text-green-ink">em escritórios de restauro</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Escritórios, ateliês, museus e órgãos publicam vagas com a função, as áreas de atuação
            e, quando quiserem, a faixa salarial.
          </p>
          <ButtonLink href={isPro ? "/projetos/novo?tipo=vaga" : "/pro/contratar"} className="mt-5">
            Publicar uma vaga
          </ButtonLink>
          {!isPro && (
            <p className="mt-2 text-xs text-muted">
              Candidatar-se e publicar vagas são recursos do Patrinu Pro.
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="mb-5 max-w-xl lg:hidden">
          <Suspense>
            <HeaderSearch compact defaultValue={q ?? ""} />
          </Suspense>
        </div>

        <FilterBar
          segments={CONTRACT_SEGMENTS}
          segmentParam="contract"
          segmentDefault="todas"
          showSpecialty={false}
          extraSelects={[
            {
              param: "grupo",
              label: "Todos os grupos",
              options: CATEGORY_GROUPS.map((g) => ({ value: g.key, label: g.label })),
            },
            { param: "uf", label: "UF", options: UFS.map((u) => ({ value: u, label: u })) },
            {
              param: "seniority",
              label: "Senioridade",
              options: Object.entries(SENIORITY).map(([v, l]) => ({ value: v, label: l })),
            },
            {
              param: "workMode",
              label: "Modelo de trabalho",
              options: Object.entries(WORK_MODES).map(([v, l]) => ({ value: v, label: l })),
            },
          ]}
          total={items.length}
          unit={["vaga", "vagas"]}
        />

        <div className="mt-6" />

        {items.length === 0 ? (
          <div className="rounded-card border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhuma vaga com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((v) => (
              <VagaCard key={v.id} vaga={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
