import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "neutral" | "green" | "ink" | "ok" | "warn" | "crit" | "outline";

const TONES: Record<Tone, string> = {
  neutral: "bg-sunk text-ink-soft",
  green: "bg-green-weak text-green-ink",
  ink: "bg-ink text-white",
  ok: "bg-[color-mix(in_oklab,var(--ok)_16%,transparent)] text-ok",
  warn: "bg-[color-mix(in_oklab,var(--warn)_16%,transparent)] text-warn",
  crit: "bg-[color-mix(in_oklab,var(--crit)_15%,transparent)] text-crit",
  outline: "border border-border text-ink-soft",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold leading-5",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
