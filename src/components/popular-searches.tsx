import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ITEMS: { label: string; href: string }[] = [
  { label: "Talha e douramento", href: "/oportunidades?q=talha" },
  { label: "Restauro de fachada", href: "/oportunidades?q=fachada" },
  { label: "Projetos de acervo", href: "/projetos?specialty=acervo" },
  { label: "Editais abertos", href: "/editais" },
  { label: "Cursos e oficinas", href: "/cursos" },
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
              ? "inline-flex items-center gap-1.5 border border-white/30 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              : "inline-flex items-center gap-1.5 border border-ink/20 px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          }
        >
          {item.label}
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      ))}
    </div>
  );
}
