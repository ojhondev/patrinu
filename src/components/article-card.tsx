import Link from "next/link";

import type { Article } from "@/lib/types";
import { articleCategoryLabel, formatDate } from "@/lib/taxonomy";

export function ArticleCard({
  article: a,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/noticias/${a.slug}`}
      className="group flex flex-col border border-ink/12 bg-surface p-5 transition-colors [overflow-wrap:anywhere] hover:border-green-ink"
    >
      <div className="flex items-center gap-2 text-xs text-ink-soft">
        <span className="kicker text-green-ink">{articleCategoryLabel(a.category)}</span>
        <span>{formatDate(a.publishedAt)}</span>
        <span>· {a.readingMinutes} min</span>
      </div>
      <h3
        className={
          compact
            ? "mt-2 line-clamp-2 font-display font-bold leading-snug text-ink group-hover:text-green-ink"
            : "mt-2 line-clamp-3 font-display text-lg font-bold leading-snug text-ink group-hover:text-green-ink"
        }
      >
        {a.title}
      </h3>
      {!compact && (
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{a.excerpt}</p>
      )}
      {a.source && (
        <p className="mt-2 text-xs text-muted">via {a.source.name}</p>
      )}
    </Link>
  );
}
