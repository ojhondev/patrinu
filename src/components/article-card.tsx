import Link from "next/link";

import type { Article } from "@/lib/types";
import { articleCategoryLabel, formatDate } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";

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
      className="group flex flex-col rounded-[var(--radius-card)] border border-border bg-surface p-5 transition-colors hover:border-green-ink"
    >
      <div className="flex items-center gap-2 text-xs text-ink-soft">
        <Badge tone="green">{articleCategoryLabel(a.category)}</Badge>
        <span>{formatDate(a.publishedAt)}</span>
        <span>· {a.readingMinutes} min</span>
      </div>
      <h3
        className={
          compact
            ? "mt-2 line-clamp-2 font-semibold leading-snug text-ink group-hover:underline"
            : "mt-2 line-clamp-3 text-lg font-bold leading-snug text-ink group-hover:underline"
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
