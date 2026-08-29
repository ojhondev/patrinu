import Link from "next/link";

const NAV = [
  { href: "/radar", label: "Radar" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/passaporte", label: "Passaporte" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-[4px] bg-accent"
            style={{ boxShadow: "inset 0 0 0 2px var(--bg), inset 0 0 0 3px var(--accent)" }}
          />
          Patrinu
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-surface-sunk transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/radar"
            className="ml-2 px-3 py-1.5 rounded-md bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
