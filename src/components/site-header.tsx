"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";

import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import { HeaderSearch } from "@/components/header-search";
import { signOut } from "@/app/conta/actions";

export type HeaderAccount = {
  name: string;
  plan: "visitante" | "cadastrado" | "pro";
  master: boolean;
} | null;

const NAV = [
  { href: "/projetos", label: "Projetos" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/editais", label: "Editais" },
  { href: "/noticias", label: "Notícias" },
  { href: "/cursos", label: "Cursos" },
  { href: "/financiamento", label: "Financiamento" },
];

export function SiteHeader({ account }: { account: HeaderAccount }) {
  const pathname = usePathname();
  const firstName = account?.name.trim().split(/\s+/)[0] ?? "";
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!onHome);
  const [open, setOpen] = useState(false);

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

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-surface",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:h-[68px] lg:px-11">
        <Link href="/" aria-label="Patrinu — início" className="shrink-0">
          <Logo className="h-7" />
        </Link>

        {/* search collapses into the bar once scrolled past the hero (xl+) */}
        <div
          className={cn(
            "hidden min-w-0 flex-1 transition-all duration-200 xl:block",
            scrolled ? "max-w-md opacity-100" : "pointer-events-none max-w-0 opacity-0",
          )}
        >
          <HeaderSearch compact />
        </div>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-semibold transition-colors",
                  active ? "text-green-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1.5 h-5 w-px bg-border" />
          {account ? (
            <>
              <Link
                href={account.master ? "/master" : "/painel"}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-semibold",
                  pathname.startsWith("/painel") || pathname.startsWith("/master")
                    ? "text-green-ink"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {account.master ? "Painel Master" : `Olá, ${firstName}`}
              </Link>
              {!account.master && account.plan !== "pro" && (
                <Link
                  href="/pro"
                  className="rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-green-hover"
                >
                  Assinar Pro
                </Link>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md px-2.5 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-md px-2.5 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                Entrar
              </Link>
              <Link
                href="/pro"
                className="rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-green-hover"
              >
                Patrinu Pro
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:hidden">
          <Link
            href="/editais"
            aria-label="Buscar"
            className="rounded-lg border border-border p-2 text-ink-soft"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-border p-2 text-ink-soft"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-2 py-2.5 text-sm font-semibold text-ink-soft hover:bg-sunk hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {account ? (
              <>
                <Link
                  href={account.master ? "/master" : "/painel"}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-bold"
                >
                  {account.master ? "Painel Master" : "Meu painel"}
                </Link>
                <form action={signOut} className="flex-1">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green px-3 py-2 text-center text-sm font-bold text-white"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-bold"
                >
                  Entrar
                </Link>
                <Link
                  href="/pro"
                  className="flex-1 rounded-lg bg-green px-3 py-2 text-center text-sm font-bold text-white"
                >
                  Patrinu Pro
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
