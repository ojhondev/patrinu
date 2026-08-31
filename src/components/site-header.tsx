"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";

import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import { HeaderSearch } from "@/components/header-search";
import { signOut } from "@/app/conta/actions";

export type HeaderAccount = {
  name: string;
  plan: "visitante" | "cadastrado" | "pro";
  master: boolean;
  avatarUrl?: string | null;
} | null;

const NAV = [
  { href: "/oportunidades", label: "Oportunidades" },
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
  const proArea =
    pathname.startsWith("/profissionais") ||
    pathname === "/pro" ||
    pathname.startsWith("/pro/");
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
          <Logo className="h-7" variant={proArea ? "pro" : "default"} />
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

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] transition-colors",
                  active ? "text-green-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1.5 h-4 w-px bg-ink/15" />
          {account ? (
            <>
              <Link
                href={account.master ? "/master" : "/painel"}
                className={cn(
                  "inline-flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em]",
                  pathname.startsWith("/painel") || pathname.startsWith("/master")
                    ? "text-green-ink"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                <Avatar name={account.name} src={account.avatarUrl} size={26} />
                {account.master ? "Master" : firstName}
              </Link>
              {!account.master && account.plan !== "pro" && (
                <Link
                  href="/pro"
                  className="bg-green px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-green-hover"
                >
                  Seja membro
                </Link>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
              >
                Entrar
              </Link>
              <Link
                href="/pro"
                className="bg-green px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-green-hover"
              >
                Seja membro
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:hidden">
          <Link
            href="/editais"
            aria-label="Buscar"
            className="border border-ink/20 p-2 text-ink-soft"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="border border-ink/20 p-2 text-ink-soft"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/12 bg-surface px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-2 py-2.5 text-xs font-bold uppercase tracking-[0.13em] text-ink-soft hover:bg-sunk hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-ink/12 pt-3">
            {account ? (
              <>
                <Link
                  href={account.master ? "/master" : "/painel"}
                  className="flex-1 border border-ink px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.13em]"
                >
                  {account.master ? "Master" : "Meu painel"}
                </Link>
                <form action={signOut} className="flex-1">
                  <button
                    type="submit"
                    className="w-full bg-green px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.13em] text-white"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="flex-1 border border-ink px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.13em]"
                >
                  Entrar
                </Link>
                <Link
                  href="/pro"
                  className="flex-1 bg-green px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.13em] text-white"
                >
                  Seja membro
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
