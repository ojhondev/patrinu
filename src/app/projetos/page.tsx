import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { listProjects } from "@/lib/projects";
import { ProjectTile } from "@/components/project-tile";
import { FilterBar } from "@/components/filter-bar";
import { AdBanner } from "@/components/ad-banner";
import { HeaderSearch } from "@/components/header-search";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { UFS } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Obras de restauro e conservação do Brasil — publicadas por quem as executou. O acervo visual do patrimônio.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = one(sp.q);
  const specialty = one(sp.specialty);
  const grupo = one(sp.grupo);
  const uf = one(sp.uf);
  const projects = await listProjects({
    mode: "vitrine",
    entryKind: "projeto",
    q,
    specialty,
    grupo,
    uf,
  });

  return (
    <div>
      <header className="border-b border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11 lg:py-14">
          <p className="kicker text-muted">O acervo visual do restauro brasileiro</p>
          <h1 className="display mt-2 max-w-4xl text-3xl text-ink sm:text-5xl">
            {q ? (
              <>
                Projetos <span className="accent font-medium text-green-ink">“{q}”</span>
              </>
            ) : (
              <>
                Obras que já foram{" "}
                <span className="accent font-medium text-green-ink">restauradas</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Publicadas por quem as executou — antes, durante e depois. Referência técnica,
            portfólio e memória do patrimônio.
          </p>
          <Link href="/painel" className="btn btn-primary mt-5">
            Publicar um projeto
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="mb-5 max-w-xl lg:hidden">
          <Suspense>
            <HeaderSearch compact defaultValue={q ?? ""} />
          </Suspense>
        </div>

        <FilterBar
          showSpecialty={false}
          extraSelects={[
            {
              param: "grupo",
              label: "Todos os grupos",
              options: CATEGORY_GROUPS.map((g) => ({ value: g.key, label: g.label })),
            },
            { param: "uf", label: "UF", options: UFS.map((u) => ({ value: u, label: u })) },
          ]}
          total={projects.length}
          unit={["projeto", "projetos"]}
        />

        <AdBanner slot="projects" ratio="1920/500" className="my-8" />

        {projects.length === 0 ? (
          <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhum projeto com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectTile key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
