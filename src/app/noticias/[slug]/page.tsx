import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getArticle, listArticles } from "@/lib/directory";
import { articleCategoryLabel, formatDate } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NewsBanner } from "@/components/news-banner";

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

  const body = a.body.filter((p) => p.trim().length > 0);
  const half = Math.ceil(body.length / 2) || 1;

  return (
    <div className="[overflow-wrap:anywhere]">
      {/* masthead editorial */}
      <div className="border-b-4 border-brand">
        <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={13} />
            Notícias
          </Link>

          <p className="kicker mt-6 text-green-ink">{articleCategoryLabel(a.category)}</p>
          <h1 className="display mt-3 text-3xl text-ink sm:text-5xl">{a.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{a.excerpt}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Por {a.author}</span>
            <span>·</span>
            <span>{formatDate(a.publishedAt)}</span>
            <span>·</span>
            <span>{a.readingMinutes} min de leitura</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
        <article className="space-y-5 text-[1.075rem] leading-relaxed text-ink-soft first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-ink">
          {body.slice(0, half).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>

        {/* espaço de anúncio no meio da matéria */}
        <NewsBanner className="my-8" />

        {body.length > half && (
          <article className="space-y-5 text-[1.075rem] leading-relaxed text-ink-soft">
            {body.slice(half).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        )}

        {a.source?.name && (
          <p className="mt-10 text-sm text-muted">
            Com informações de <span className="font-semibold text-ink-soft">{a.source.name}</span>.
          </p>
        )}

        <div className="mt-12 border-t-4 border-brand pt-8">
          <p className="kicker text-green-ink">Newsletter</p>
          <p className="display mt-2 text-xl text-ink">Receba a próxima edição</p>
          <div className="mt-4">
            <NewsletterSignup />
          </div>
        </div>

        {more.length > 0 && (
          <section className="mt-12 border-t border-ink/12 pt-8">
            <h2 className="kicker text-muted">
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
    </div>
  );
}
