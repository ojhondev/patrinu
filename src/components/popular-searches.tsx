import Link from "next/link";

const ITEMS: { label: string; href: string }[] = [
  { label: "Talha e douramento", href: "/busca?q=talha" },
  { label: "Restauro de fachada", href: "/busca?q=fachada" },
  { label: "Conservação de acervo", href: "/busca?q=acervo" },
  { label: "Cantaria", href: "/busca?q=cantaria" },
  { label: "Editais abertos", href: "/editais" },
];

export function PopularSearches({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className={dark ? "py-1.5 text-sm text-white/70" : "py-1.5 text-sm text-ink-soft"}>
        Populares:
      </span>
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            dark
              ? "inline-flex items-center rounded-pill border border-white/35 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink"
              : "inline-flex items-center rounded-pill border border-border-strong px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
