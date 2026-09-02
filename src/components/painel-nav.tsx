"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Inbox,
  UserRound,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
  external?: boolean;
};

export function PainelNav({
  horizontal = false,
  counts = {},
}: {
  horizontal?: boolean;
  counts?: { publicacoes?: number; candidaturas?: number };
}) {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/painel", label: "Visão geral", icon: LayoutDashboard, exact: true },
    {
      href: "/painel/publicacoes",
      label: "Minhas publicações",
      icon: Megaphone,
      badge: counts.publicacoes,
    },
    {
      href: "/painel/candidaturas",
      label: "Candidaturas",
      icon: Inbox,
      badge: counts.candidaturas,
    },
    { href: "/painel/perfil", label: "Meu perfil", icon: UserRound },
    { href: "/pro", label: "Plano e créditos", icon: Sparkles, external: true },
  ];

  const isActive = (it: Item) =>
    it.external ? false : it.exact ? pathname === it.href : pathname.startsWith(it.href);

  return (
    <nav
      className={cn(
        horizontal
          ? "no-scrollbar flex gap-1 overflow-x-auto px-3 py-2"
          : "flex flex-1 flex-col gap-1 p-3",
      )}
    >
      {items.map((it) => {
        const active = isActive(it);
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap rounded-btn px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-surface font-semibold text-green-ink shadow-[var(--shadow-card)]"
                : "text-ink-soft hover:bg-surface/60 hover:text-ink",
            )}
          >
            <Icon size={16} className="shrink-0" />
            {it.label}
            {it.badge ? (
              <span className="ml-auto grid h-[18px] min-w-[18px] place-items-center rounded-pill bg-sunk-2 px-1 text-[10px] font-bold text-ink-soft">
                {it.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
