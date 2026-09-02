import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getArticle, listArticles } from "@/lib/directory";
import { articleCategoryLabel, formatDate } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NewsBanner } from "@/components/news-banner";
import { NewsShareBar } from "@/components/news-share-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  return { title: a ? a.title : "Notícia" };
}

/** Reagrupa o corpo em parágrafos de tamanho de leitura (estilo Exame). */
function readableParagraphs(raw: string[]): string[] {
  const out: string[] = [];
  for (const block of raw) {
    const t = block.trim();
    if (!t) continue;
    if (t.length <= 460) {
      out.push(t);
      continue;
    }
    // quebra blocos longos em parágrafos de ~2–3 frases
    const sentences = t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [t];
    let buf = "";
    for (const s of sentences) {
      buf += s;
      if (buf.length >= 320) {
        out.push(buf.trim());
        buf = "";
      }
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out;
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

  const body = readableParagraphs(a.body);
  // anúncio depois do 3º parágrafo (ou no meio, se a matéria for curta)
  const adAfter = Math.min(3, Math.max(1, Math.floor(body.length / 2)));
  const lead = body.slice(0, adAfter);
  const rest = body.slice(adAfter);

  return (
    <div className="pb-16">
      {/* masthead editorial */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[680px] px-4 py-10 sm:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={13} />
            Notícias
          </Link>

          <p className="kicker mt-6 text-green-ink">{articleCategoryLabel(a.category)}</p>
          <h1 className="display mt-3 text-[1.9rem] leading-[1.15] text-ink sm:text-[2.7rem]">
            {a.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{a.excerpt}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 text-sm text-muted">
            <span>Por {a.author}</span>
            <span>·</span>
            <span>{formatDate(a.publishedAt)}</span>
            <span>·</span>
            <span>{a.readingMinutes} min de leitura</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-4 py-10 sm:px-6">
        <div className="article-body">
          {lead.map((para, i) => (
            <p key={i} className={i === 0 ? "article-lead" : undefined}>
              {para}
            </p>
          ))}
        </div>

        {/* espaço de anúncio incorporado ao corpo da matéria */}
        <NewsBanner className="my-9 rounded-card" />

        {rest.length > 0 && (
          <div className="article-body">
            {rest.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {a.source?.name && (
          <p className="mt-10 border-t border-border pt-5 text-sm text-muted">
            Com informações de{" "}
            {a.source.url ? (
              <a
                href={a.source.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-green-ink hover:underline"
              >
                {a.source.name}
              </a>
            ) : (
              <span className="font-semibold text-ink-soft">{a.source.name}</span>
            )}
            .
          </p>
        )}

        <div className="mt-12 border-t-2 border-brand pt-8">
          <p className="kicker text-green-ink">Newsletter</p>
          <p className="display mt-2 text-xl text-ink">Receba a próxima edição</p>
          <div className="mt-4">
            <NewsletterSignup />
          </div>
        </div>

        {more.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="kicker text-muted">Mais em {articleCategoryLabel(a.category)}</h2>
            <div className="mt-4 space-y-3">
              {more.map((m) => (
                <ArticleCard key={m.slug} article={m} compact />
              ))}
            </div>
          </section>
        )}
      </div>

      <NewsShareBar slug={a.slug} title={a.title} />
    </div>
  );
}
