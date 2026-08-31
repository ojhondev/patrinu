import type { Metadata } from "next";
import Link from "next/link";

import { listArticles } from "@/lib/directory";
import { articleCategoryLabel } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
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
  const articles = await listArticles(cat);
  const [lead, ...rest] = articles;

  return (
    <div>
      <PageHero tone="paper" eyebrow="Jornalismo do setor" title={<>Notícias</>}>
        Uma edição por semana no seu e-mail — obras, editais e a matéria da semana.
        <span className="mt-4 block">
          <NewsletterSignup />
        </span>
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="rule mb-6 flex flex-wrap gap-5 pb-3">
          <Link
            href="/noticias"
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.13em] transition-colors",
              !cat
                ? "text-ink underline decoration-2 underline-offset-[6px]"
                : "text-muted hover:text-ink",
            )}
          >
            Tudo
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/noticias?categoria=${c}`}
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.13em] transition-colors",
                cat === c
                  ? "text-ink underline decoration-2 underline-offset-[6px]"
                  : "text-muted hover:text-ink",
              )}
            >
              {articleCategoryLabel(c)}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
            Nenhuma matéria nessa categoria.
          </div>
        ) : (
          <>
            {lead && (
              <Link
                href={`/noticias/${lead.slug}`}
                className="group mb-8 block border-l-4 border-brand bg-surface py-2 pl-6 transition-colors"
              >
                <span className="kicker text-green-ink">
                  {articleCategoryLabel(lead.category)}
                </span>
                <h2 className="display mt-2 max-w-3xl text-2xl text-ink group-hover:text-green-ink sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-3 max-w-2xl text-ink-soft">{lead.excerpt}</p>
              </Link>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
