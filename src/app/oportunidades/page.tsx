import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { listProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { FilterBar } from "@/components/filter-bar";
import { HeaderSearch } from "@/components/header-search";

export const metadata: Metadata = {
  title: "Oportunidades",
  description:
    "Projetos de restauro abertos para propostas e obras buscando patrocínio — publicados por instituições, empresas e detentores do bem.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

type Mode = "todas" | "propostas" | "captacao";
const MODES: { key: Mode; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "propostas", label: "Abertas para proposta" },
  { key: "captacao", label: "Buscando patrocínio" },
];

export default async function OportunidadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const mode = (one(sp.mode) as Mode) ?? "todas";
  const q = one(sp.q);
  const specialty = one(sp.specialty);
  const uf = one(sp.uf);

  const all = await listProjects({ mode: "abertos", q, specialty, uf });
  const items =
    mode === "propostas"
      ? all.filter((p) => p.status === "aberto")
      : mode === "captacao"
        ? all.filter((p) => p.status === "em_captacao")
        : all;

  return (
    <div>
      <header className="band band-hairlines">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-20">
          <p className="kicker text-accent">Marketplace do patrimônio</p>
          <h1 className="display mt-3 max-w-4xl text-4xl text-white sm:text-6xl">
            {q ? (
              <>
                Oportunidades <span className="accent text-accent">“{q}”</span>
              </>
            ) : (
              <>
                Restauros <span className="accent text-accent">à procura</span> de quem
                executa
              </>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Projetos publicados por instituições, empresas e detentores do bem — abertos
            para propostas de profissionais ou buscando patrocínio.
          </p>
          <Link
            href="/pro/contratar"
            className="mt-6 inline-flex bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-band hover:bg-white/90"
          >
            Publicar uma oportunidade
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
          segments={MODES.map((m) => ({ key: m.key, label: m.label }))}
          segmentParam="mode"
          segmentDefault="todas"
          total={items.length}
          unit={["oportunidade", "oportunidades"]}
        />

        <div className="mt-6" />

        {items.length === 0 ? (
          <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhuma oportunidade com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
