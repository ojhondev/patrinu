import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getArticle, listArticles } from "@/lib/directory";
import { articleCategoryLabel, formatDate } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  return { title: a ? a.title : "Notícia" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  const more = (await listArticles())
    .filter((x) => x.slug !== a.slug && x.category === a.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6">
      <Link
        href="/noticias"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={14} />
        Notícias
      </Link>

      <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
        <Badge tone="green">{articleCategoryLabel(a.category)}</Badge>
        <span>{formatDate(a.publishedAt)}</span>
        <span>· {a.readingMinutes} min de leitura</span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
        {a.title}
      </h1>
      <p className="mt-3 text-lg text-ink-soft">{a.excerpt}</p>
      <p className="mt-2 text-sm text-muted">Por {a.author}</p>

      <article className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink-soft">
        {a.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      {a.source && (
        <p className="mt-6 rounded-[var(--radius-card)] border border-border bg-sunk p-4 text-sm">
          Curadoria a partir de{" "}
          <a
            href={a.source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-green-ink hover:underline"
          >
            {a.source.name}
            <ExternalLink size={13} />
          </a>
        </p>
      )}

      <div className="mt-10 rounded-[var(--radius-card)] border border-border bg-green-weak p-6 text-center">
        <p className="font-semibold text-ink">Receba a próxima edição</p>
        <div className="mt-3 flex justify-center">
          <NewsletterSignup />
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-lg font-bold tracking-tight">
            Mais em {articleCategoryLabel(a.category)}
          </h2>
          <div className="mt-4 space-y-3">
            {more.map((m) => (
              <ArticleCard key={m.slug} article={m} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
