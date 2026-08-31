import type { Metadata } from "next";
import Link from "next/link";

import { listCourses } from "@/lib/directory";
import { courseFormatLabel, courseLevelLabel } from "@/lib/taxonomy";
import { CourseCard } from "@/components/course-card";
import { FilterBar } from "@/components/filter-bar";
import { PageHero } from "@/components/page-hero";

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

  return (
    <div>
      <PageHero tone="paper" eyebrow="Formação em conservação-restauro" title={<>Cursos</>}>
        Diretório curado de cursos, oficinas e pós-graduações. Listagem com link direto de
        inscrição.
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <FilterBar
        total={courses.length}
        unit={["curso", "cursos"]}
        extraSelects={[
          {
            param: "formato",
            label: "Todos os formatos",
            options: FORMATS.map((f) => ({ value: f, label: courseFormatLabel(f) })),
          },
          {
            param: "nivel",
            label: "Todos os níveis",
            options: LEVELS.map((l) => ({ value: l, label: courseLevelLabel(l) })),
          },
        ]}
      />

      <div className="mt-6" />

      {courses.length === 0 ? (
        <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nenhum curso com esses filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
