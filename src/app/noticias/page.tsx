import type { Metadata } from "next";
import Link from "next/link";

import { listArticles } from "@/lib/directory";
import { articleCategoryLabel } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NewsBanner } from "@/components/news-banner";
import { PageHero } from "@/components/page-hero";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Obras, técnicas, políticas de preservação, editais e mercado do restauro brasileiro.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const CATEGORIES = ["obra", "tecnica", "politica", "mercado", "edital"];

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const cat = one(sp.categoria);
  const q = one(sp.q);
  const articles = await listArticles(cat, q);
  const [lead, ...rest] = articles;

  return (
    <div className="[overflow-wrap:anywhere]">
      <PageHero tone="paper" eyebrow="Jornalismo do setor" title={<>Notícias</>}>
        Uma edição por semana no seu e-mail — obras, editais e a matéria da semana.
        <span className="mt-4 block">
          <NewsletterSignup />
        </span>
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <NewsBanner className="mb-8" />
        {q && (
          <p className="mb-5 text-sm text-ink-soft">
            Resultados para <span className="font-semibold text-ink">“{q}”</span> ·{" "}
            <Link href="/noticias" className="text-green-ink hover:underline">
              limpar
            </Link>
          </p>
        )}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
          <Link
            href="/noticias"
            className={cn("chip", !cat && "is-active")}
          >
            Tudo
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/noticias?categoria=${c}`}
              className={cn("chip", cat === c && "is-active")}
            >
              {articleCategoryLabel(c)}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="rounded-card border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhuma matéria encontrada.
          </div>
        ) : (
          <>
            {lead && (
              <Link
                href={`/noticias/${lead.slug}`}
                className="group mb-8 block rounded-card border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-green-ink">
                  {articleCategoryLabel(lead.category)}
                </span>
                <h2 className="display mt-2 max-w-3xl text-2xl text-ink group-hover:text-green-ink sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-3 max-w-2xl text-ink-soft">{lead.excerpt}</p>
              </Link>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
