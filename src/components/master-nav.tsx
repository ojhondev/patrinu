"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: LucideIcon; badge: number };

export function MasterNav({
  items,
  horizontal = false,
}: {
  items: Item[];
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
      {items.map((it) => {
        const active = isActive(it.href);
        const Icon = it.icon;
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
            {it.badge > 0 && (
              <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {it.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
