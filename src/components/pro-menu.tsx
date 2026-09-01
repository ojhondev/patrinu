"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Building2, Hammer } from "lucide-react";

import { cn } from "@/lib/cn";

const OPTIONS = [
  {
    href: "/pro/contratar",
    icon: Building2,
    title: "Quero contratar um especialista",
    desc: "Publique uma vaga, receba candidaturas e monte sua equipe de restauro.",
  },
  {
    href: "/pro/oferecer",
    icon: Hammer,
    title: "Quero oferecer serviços",
    desc: "Monte seu perfil verificado, apareça no diretório e candidate-se a vagas.",
  },
];

/** Item de nav "Patrinu Pro" com dropdown (desktop). */
export function ProMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = pathname.startsWith("/pro");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href="/pro"
        className={cn(
          "flex items-center gap-1 py-2 text-sm font-semibold transition-colors",
          active || open ? "text-green-ink" : "text-ink hover:text-green-ink",
        )}
        aria-expanded={open}
      >
        Patrinu Pro
        <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 w-[420px] pt-2">
          <div className="overflow-hidden rounded-card border border-border bg-surface shadow-[var(--shadow-pop)]">
            <p className="px-5 pb-2 pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              O que você procura?
            </p>
            {OPTIONS.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-sunk"
              >
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-green-weak text-green-ink">
                  <o.icon size={18} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">{o.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{o.desc}</span>
                </span>
              </Link>
            ))}
            <div className="border-t border-border px-5 py-3">
              <Link href="/pro" className="text-[13px] font-semibold text-green-ink hover:underline">
                Ver tudo sobre o Patrinu Pro →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
