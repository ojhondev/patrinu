import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { searchAll } from "@/lib/search";
import { getPlan } from "@/lib/membership";
import { redactContratante } from "@/lib/projects";
import { HeaderSearch } from "@/components/header-search";
import { PopularSearches } from "@/components/popular-searches";
import { CategoryRail } from "@/components/category-rail";
import { VagaCard } from "@/components/vaga-card";
import { ProjectCard } from "@/components/project-card";
import { ProfessionalCard } from "@/components/professional-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { ArticleCard } from "@/components/article-card";
import { CourseCard } from "@/components/course-card";

export const metadata: Metadata = { title: "Busca", robots: { index: false } };

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function Section({
  title,
  href,
  count,
  children,
}: {
  title: string;
  href: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between border-b border-border pb-2">
        <h2 className="font-display text-xl font-bold text-ink">
          {title} <span className="text-sm font-medium text-muted">({count})</span>
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-ink hover:text-ink"
        >
          Ver todos <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const grid = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const q = one((await searchParams).q)?.trim() ?? "";
  const r = await searchAll(q);
  const enc = encodeURIComponent(q);
  if ((await getPlan()) !== "pro") r.vagas = r.vagas.map(redactContratante);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-11">
      <p className="kicker text-muted">Busca</p>
      <h1 className="display mt-2 text-3xl text-ink sm:text-4xl">
        {q ? (
          <>
            Resultados para <span className="accent font-medium text-green-ink">“{q}”</span>
          </>
        ) : (
          "Buscar em todo o Patrinu"
        )}
      </h1>

      <div className="mt-5 max-w-2xl">
        <Suspense>
          <HeaderSearch defaultValue={q} autoFocus={!q} />
        </Suspense>
      </div>

      {!q ? (
        <div className="mt-8 space-y-10">
          <PopularSearches />
          <div>
            <p className="kicker text-muted">Explore por categoria</p>
            <div className="mt-5">
              <CategoryRail base="/profissionais" />
            </div>
          </div>
        </div>
      ) : r.total === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nada encontrado para “{q}”. Tente outro termo.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          <Section title="Vagas" href={`/vagas?q=${enc}`} count={r.vagas.length}>
            <div className={grid}>
              {r.vagas.map((v) => (
                <VagaCard key={v.id} vaga={v} />
              ))}
            </div>
          </Section>

          <Section title="Profissionais" href={`/profissionais?q=${enc}`} count={r.profissionais.length}>
            <div className={grid}>
              {r.profissionais.map((p) => (
                <ProfessionalCard key={p.slug} pro={p} />
              ))}
            </div>
          </Section>

          <Section title="Projetos" href={`/projetos?q=${enc}`} count={r.projetos.length}>
            <div className={grid}>
              {r.projetos.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </Section>

          <Section title="Editais" href={`/editais?q=${enc}`} count={r.editais.length}>
            <div className={grid}>
              {r.editais.map((op) => (
                <OpportunityCard key={op.id} op={op} />
              ))}
            </div>
          </Section>

          <Section title="Notícias" href={`/noticias?q=${enc}`} count={r.noticias.length}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {r.noticias.map((a) => (
                <ArticleCard key={a.slug} article={a} compact />
              ))}
            </div>
          </Section>

          <Section title="Cursos" href={`/cursos?q=${enc}`} count={r.cursos.length}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {r.cursos.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
