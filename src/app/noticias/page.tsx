import type { Metadata } from "next";
import Link from "next/link";

import { listArticles } from "@/lib/directory";
import { articleCategoryLabel } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
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
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Notícias</h1>
        <p className="mt-1 text-ink-soft">
          Uma edição por semana no seu e-mail — obras, editais e a matéria da semana.
        </p>
        <div className="mt-4">
          <NewsletterSignup />
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/noticias"
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
            !cat
              ? "border-green bg-green text-white"
              : "border-border-strong text-ink hover:border-green-ink",
          )}
        >
          Tudo
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/noticias?categoria=${c}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
              cat === c
                ? "border-green bg-green text-white"
                : "border-border-strong text-ink hover:border-green-ink",
            )}
          >
            {articleCategoryLabel(c)}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nenhuma matéria nessa categoria.
        </div>
      ) : (
        <>
          {lead && (
            <Link
              href={`/noticias/${lead.slug}`}
              className="group mb-6 block overflow-hidden rounded-[var(--radius-card)] border border-border bg-green-weak p-6 transition-colors hover:border-green-ink sm:p-8"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-green-ink">
                {articleCategoryLabel(lead.category)}
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-ink group-hover:underline sm:text-3xl">
                {lead.title}
              </h2>
              <p className="mt-2 max-w-2xl text-ink-soft">{lead.excerpt}</p>
            </Link>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
