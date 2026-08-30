import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { listProjects, type ProjectMode } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
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
  { key: "todos", label: "Todos" },
  { key: "vitrine", label: "Vitrine (concluídos)" },
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
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {q ? (
            <>
              Projetos: <span className="accent">“{q}”</span>
            </>
          ) : (
            "Projetos"
          )}
        </h1>
        <p className="mt-1 text-ink-soft">
          Obras concluídas como referência e projetos abertos para disputar. Um mesmo
          objeto, estados diferentes.
        </p>
      </header>

      <div className="mb-5 max-w-xl lg:hidden">
        <Suspense>
          <HeaderSearch compact defaultValue={q ?? ""} />
        </Suspense>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Link
            key={m.key}
            href={qs({ mode: m.key })}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              mode === m.key
                ? "border-green bg-green text-white"
                : "border-border-strong text-ink hover:border-green-ink",
            )}
          >
            {m.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 border-b border-border pb-3">
        <CategoryRail />
      </div>

      <p className="mb-3 text-sm text-ink-soft">
        <strong className="font-bold text-ink tabular-nums">{projects.length}</strong>{" "}
        {projects.length === 1 ? "projeto" : "projetos"}
      </p>

      {projects.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nenhum projeto com esses filtros.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
