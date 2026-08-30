import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ITEMS: { label: string; href: string }[] = [
  { label: "Talha e douramento", href: "/radar?q=talha" },
  { label: "Restauro de fachada", href: "/radar?q=fachada" },
  { label: "Conservação de acervo", href: "/radar?specialty=acervo" },
  { label: "Cantaria", href: "/radar?q=cantaria" },
  { label: "Editais Rouanet", href: "/radar?q=rouanet" },
];

export function PopularSearches({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={dark ? "py-1.5 text-sm text-white/70" : "py-1.5 text-sm text-ink-soft"}
      >
        Populares:
      </span>
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            dark
              ? "inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              : "inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          }
        >
          {item.label}
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      ))}
    </div>
  );
}
