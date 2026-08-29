import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "rust" | "ok" | "warn" | "crit";

const TONES: Record<Tone, string> = {
  neutral: "border-border-strong text-muted",
  accent: "border-accent text-accent",
  rust: "border-rust/60 text-rust",
  ok: "border-ok/50 text-ok",
  warn: "border-warn/50 text-warn",
  crit: "border-crit/50 text-crit",
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
        "inline-flex items-center gap-1 rounded-[3px] border px-1.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide leading-none",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
