import { Star } from "lucide-react";

import { cn } from "@/lib/cn";

/** Mostra a aderência da oportunidade (0..1) ao estilo "rating" do Fiverr. */
export function MatchScore({
  score,
  className,
  showLabel = true,
}: {
  score: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.round(score * 100);
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star size={14} className="fill-star text-star" />
      <span className="font-bold text-ink">{(score * 5).toFixed(1)}</span>
      {showLabel ? (
        <span className="text-ink-soft">
          · {pct}% aderência
        </span>
      ) : null}
    </span>
  );
}
