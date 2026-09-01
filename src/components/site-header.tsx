"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import { HeaderSearch } from "@/components/header-search";
import { ProMenu } from "@/components/pro-menu";
import { signOut } from "@/app/conta/actions";

export type HeaderAccount = {
  name: string;
  plan: "visitante" | "cadastrado" | "pro";
  master: boolean;
  avatarUrl?: string | null;
} | null;

const NAV = [
  { href: "/vagas", label: "Vagas" },
  { href: "/projetos", label: "Projetos" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/editais", label: "Editais" },
  { href: "/noticias", label: "Notícias" },
];

const PRO_LINKS = [
  { href: "/pro/contratar", label: "Quero contratar um especialista" },
  { href: "/pro/oferecer", label: "Quero oferecer serviços" },
];

export function SiteHeader({ account }: { account: HeaderAccount }) {
  const pathname = usePathname();
  const firstName = account?.name.trim().split(/\s+/)[0] ?? "";
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!onHome);
  const [open, setOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);

  useEffect(() => {
    if (!onHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:h-[70px] lg:px-10">
        <Link href="/" aria-label="Patrinu — início" className="shrink-0">
          <Logo className="h-7" />
        </Link>

        {/* busca colapsa na barra depois do hero (xl+) */}
        <div
          className={cn(
            "hidden min-w-0 flex-1 transition-all duration-200 xl:block",
            scrolled ? "max-w-sm opacity-100" : "pointer-events-none max-w-0 opacity-0",
          )}
        >
          <HeaderSearch compact />
        </div>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 text-sm font-medium transition-colors",
                  active ? "text-green-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ProMenu />

          <span className="mx-1 h-5 w-px bg-border" />

          {account ? (
            <>
              <Link
                href={account.master ? "/master" : "/painel"}
                className={cn(
                  "inline-flex items-center gap-2 py-1.5 text-sm font-medium",
                  pathname.startsWith("/painel") || pathname.startsWith("/master")
                    ? "text-green-ink"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                <Avatar name={account.name} src={account.avatarUrl} size={26} />
                {account.master ? "Master" : firstName}
              </Link>
              {!account.master && account.plan !== "pro" && (
                <Link href="/pro" className="btn btn-primary btn-sm">
                  Seja membro
                </Link>
              )}
              <form action={signOut}>
                <button type="submit" className="py-2 text-sm font-medium text-ink-soft hover:text-ink">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar" className="py-2 text-sm font-medium text-ink-soft hover:text-ink">
                Entrar
              </Link>
              <Link href="/pro" className="btn btn-primary btn-sm">
                Seja membro
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:hidden">
          <Link
            href="/busca"
            aria-label="Buscar"
            className="rounded-btn border border-border-strong p-2 text-ink-soft"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-btn border border-border-strong p-2 text-ink-soft"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-btn px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-sunk hover:text-ink"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setProOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-btn px-3 py-2.5 text-sm font-semibold text-ink"
          >
            Patrinu Pro
            <ChevronDown size={16} className={cn("text-muted transition-transform", proOpen && "rotate-180")} />
          </button>
          {proOpen &&
            PRO_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-btn py-2 pl-7 pr-3 text-[13px] text-ink-soft hover:text-ink"
              >
                {l.label}
              </Link>
            ))}

          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {account ? (
              <>
                <Link
                  href={account.master ? "/master" : "/painel"}
                  className="btn btn-secondary btn-sm flex-1"
                >
                  {account.master ? "Master" : "Meu painel"}
                </Link>
                <form action={signOut} className="flex-1">
                  <button type="submit" className="btn btn-primary btn-sm w-full">
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/entrar" className="btn btn-secondary btn-sm flex-1">
                  Entrar
                </Link>
                <Link href="/pro" className="btn btn-primary btn-sm flex-1">
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
