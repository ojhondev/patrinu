"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/wordmark";
import { HeaderSearch } from "@/components/header-search";

const NAV = [
  { href: "/radar", label: "Radar" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/passaporte", label: "Passaporte" },
  { href: "/empresas", label: "Para empresas" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!onHome);

  useEffect(() => {
    if (!onHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-surface transition-shadow",
        scrolled ? "border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-11">
        <Link href="/" aria-label="Patrinu — início" className="shrink-0">
          <Wordmark className="text-[26px]" />
        </Link>

        {/* search collapses into the bar once scrolled past the hero */}
        <div
          className={cn(
            "min-w-0 flex-1 transition-all duration-200",
            scrolled ? "max-w-xl opacity-100" : "pointer-events-none max-w-0 opacity-0",
          )}
        >
          <HeaderSearch compact />
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-[15px] font-semibold transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-2 h-5 w-px bg-border" />
          <Link
            href="/entrar"
            className="rounded-md px-3 py-2 text-[15px] font-semibold text-ink-soft hover:text-ink"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg border border-green px-3.5 py-2 text-[15px] font-bold text-green-ink transition-colors hover:bg-green hover:text-white"
          >
            Cadastrar
          </Link>
        </nav>

        <Link
          href="/radar"
          aria-label="Buscar oportunidades"
          className="ml-auto rounded-lg border border-border p-2 text-ink-soft md:hidden"
        >
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
