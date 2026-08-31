import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { listProjects, type ProjectMode } from "@/lib/projects";
import { ProjectTile } from "@/components/project-tile";
import { CategoryRail } from "@/components/category-rail";
import { HeaderSearch } from "@/components/header-search";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Obras de restauro concluídas como referência e projetos abertos para profissionais disputarem.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const MODES: { key: ProjectMode; label: string }[] = [
  { key: "todos", label: "Tudo" },
  { key: "vitrine", label: "Vitrine" },
  { key: "abertos", label: "Abertos para proposta" },
];

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const mode = (one(sp.mode) as ProjectMode) ?? "todos";
  const q = one(sp.q);
  const specialty = one(sp.specialty);
  const uf = one(sp.uf);
  const projects = await listProjects({ mode, q, specialty, uf });

  const qs = (next: Partial<Record<string, string>>) => {
    const p = new URLSearchParams();
    const merged = { mode, q, specialty, uf, ...next };
    for (const [k, v] of Object.entries(merged)) if (v && v !== "todos") p.set(k, v);
    const s = p.toString();
    return s ? `/projetos?${s}` : "/projetos";
  };

  return (
    <div>
      {/* cabeçalho editorial — bloco da marca, tipografia grande */}
      <header className="band">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
            Mural do restauro brasileiro
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl">
            {q ? (
              <>
                Projetos <span className="accent text-accent">“{q}”</span>
              </>
            ) : (
              <>
                Obras, briefs e <span className="accent text-accent">restauros</span> em
                curso
              </>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Um mesmo bem em estados diferentes: concluído como referência, ou aberto para
            profissionais disputarem.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="mb-5 max-w-xl lg:hidden">
          <Suspense>
            <HeaderSearch compact defaultValue={q ?? ""} />
          </Suspense>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-3">
          <div className="flex flex-wrap gap-5">
            {MODES.map((m) => (
              <Link
                key={m.key}
                href={qs({ mode: m.key })}
                className={cn(
                  "text-sm font-bold uppercase tracking-wide transition-colors",
                  mode === m.key
                    ? "text-ink underline decoration-2 underline-offset-[6px]"
                    : "text-muted hover:text-ink",
                )}
              >
                {m.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-ink-soft">
            <strong className="font-bold text-ink tabular-nums">{projects.length}</strong>{" "}
            {projects.length === 1 ? "projeto" : "projetos"}
          </p>
        </div>

        <div className="my-5">
          <CategoryRail />
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhum projeto com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectTile key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
