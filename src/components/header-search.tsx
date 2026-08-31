"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/cn";

export function HeaderSearch({
  compact = false,
  autoFocus = false,
  defaultValue = "",
}: {
  compact?: boolean;
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function submit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/oportunidades?q=${encodeURIComponent(term)}` : "/oportunidades");
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        "flex w-full items-stretch overflow-hidden border border-ink/20 bg-surface",
        compact ? "h-11" : "h-14 sm:h-[54px]",
      )}
    >
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder={
          compact ? "Buscar oportunidades" : "Buscar por técnica, bem, órgão ou cidade…"
        }
        className={cn(
          "min-w-0 flex-1 bg-transparent px-4 text-ink outline-none placeholder:text-muted",
          compact ? "text-sm" : "text-[15px] sm:text-base",
        )}
      />
      <button
        type="submit"
        aria-label="Buscar"
        className={cn(
          "grid place-items-center bg-green text-white transition-colors hover:bg-green-hover",
          compact ? "w-11" : "w-14 sm:w-[54px]",
        )}
      >
        <Search size={compact ? 17 : 20} strokeWidth={2.5} />
      </button>
    </form>
  );
}
