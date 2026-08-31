import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { listProjects } from "@/lib/projects";
import { ProjectTile } from "@/components/project-tile";
import { FilterBar } from "@/components/filter-bar";
import { AmbassadorsRail } from "@/components/ambassadors-rail";
import { HeaderSearch } from "@/components/header-search";

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
  const uf = one(sp.uf);
  const projects = await listProjects({ mode: "vitrine", q, specialty, uf });

  return (
    <div>
      <header className="band band-hairlines">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-20">
          <p className="kicker text-accent">O acervo visual do restauro brasileiro</p>
          <h1 className="display mt-3 max-w-4xl text-4xl text-white sm:text-6xl">
            {q ? (
              <>
                Projetos <span className="accent text-accent">“{q}”</span>
              </>
            ) : (
              <>
                Obras que já foram <span className="accent text-accent">restauradas</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Publicadas por quem as executou — antes, durante e depois. Referência técnica,
            portfólio e memória do patrimônio, num só lugar.
          </p>
          <Link
            href="/painel"
            className="mt-6 inline-flex bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-band hover:bg-white/90"
          >
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

        <FilterBar total={projects.length} unit={["projeto", "projetos"]} />

        <AmbassadorsRail variant="inline" />

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
