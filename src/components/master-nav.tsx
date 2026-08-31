"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  BadgeCheck,
  Users,
  Wallet,
  Landmark,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type MasterBadges = {
  moderacao?: number;
  contas?: number;
  financiamento?: number;
};

const ITEMS: { href: string; label: string; icon: LucideIcon; badgeKey?: keyof MasterBadges }[] = [
  { href: "/master", label: "Visão geral", icon: LayoutDashboard },
  { href: "/master/moderacao", label: "Moderação", icon: ClipboardCheck, badgeKey: "moderacao" },
  { href: "/master/profissionais", label: "Profissionais", icon: BadgeCheck },
  { href: "/master/contas", label: "Contas", icon: Users, badgeKey: "contas" },
  { href: "/master/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/master/financiamento", label: "Financiamento", icon: Landmark, badgeKey: "financiamento" },
  { href: "/master/config", label: "Configurações", icon: Settings },
];

export function MasterNav({
  badges = {},
  horizontal = false,
}: {
  badges?: MasterBadges;
  horizontal?: boolean;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/master" ? pathname === "/master" : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        horizontal
          ? "no-scrollbar flex gap-1 overflow-x-auto px-3 py-2"
          : "flex flex-1 flex-col gap-0.5 p-3",
      )}
    >
      {ITEMS.map((it) => {
        const active = isActive(it.href);
        const Icon = it.icon;
        const badge = it.badgeKey ? badges[it.badgeKey] ?? 0 : 0;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors",
              horizontal ? "border-b-2" : "border-l-2",
              active
                ? "border-brand bg-surface text-green-ink"
                : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            <Icon size={15} className="shrink-0" />
            {it.label}
            {badge > 0 && (
              <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
