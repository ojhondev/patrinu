import type { Metadata } from "next";
import Link from "next/link";

import { listCourses } from "@/lib/directory";
import { courseFormatLabel, courseLevelLabel } from "@/lib/taxonomy";
import { CourseCard } from "@/components/course-card";
import { CategoryRail } from "@/components/category-rail";
import { PageHero } from "@/components/page-hero";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Cursos",
  description:
    "Diretório curado de cursos, oficinas e pós-graduações de conservação-restauro no Brasil.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const FORMATS = ["presencial", "online", "hibrido"];
const LEVELS = ["introducao", "tecnico", "especializacao", "pos_graduacao"];

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const format = one(sp.formato);
  const level = one(sp.nivel);
  const specialty = one(sp.specialty);
  const courses = await listCourses({ format, level, specialty });

  const qs = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ formato: format, nivel: level, specialty, ...next }))
      if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/cursos?${s}` : "/cursos";
  };

  const chip = (active: boolean) =>
    cn(
      "text-[11px] font-bold uppercase tracking-[0.13em] transition-colors",
      active
        ? "text-ink underline decoration-2 underline-offset-[6px]"
        : "text-muted hover:text-ink",
    );

  return (
    <div>
      <PageHero tone="paper" eyebrow="Formação em conservação-restauro" title={<>Cursos</>}>
        Diretório curado de cursos, oficinas e pós-graduações. Listagem com link direto de
        inscrição.
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2">
        <Link href={qs({ formato: undefined })} className={chip(!format)}>
          Todos os formatos
        </Link>
        {FORMATS.map((f) => (
          <Link key={f} href={qs({ formato: f })} className={chip(format === f)}>
            {courseFormatLabel(f)}
          </Link>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={qs({ nivel: undefined })} className={chip(!level)}>
          Todos os níveis
        </Link>
        {LEVELS.map((l) => (
          <Link key={l} href={qs({ nivel: l })} className={chip(level === l)}>
            {courseLevelLabel(l)}
          </Link>
        ))}
      </div>

      <div className="my-5">
        <CategoryRail base="/cursos" />
      </div>

      <p className="rule mb-5 pb-3 text-sm text-ink-soft">
        <strong className="font-bold text-ink tabular-nums">{courses.length}</strong>{" "}
        {courses.length === 1 ? "curso" : "cursos"}
      </p>

      {courses.length === 0 ? (
        <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nenhum curso com esses filtros.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-ink-soft">
        Oferece um curso ou oficina?{" "}
        <Link href="/entrar" className="font-semibold text-green-ink hover:underline">
          Envie para o diretório
        </Link>
        .
      </p>
      </div>
    </div>
  );
}
