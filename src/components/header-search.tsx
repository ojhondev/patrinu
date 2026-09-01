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
    router.push(term ? `/busca?q=${encodeURIComponent(term)}` : "/busca");
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        "flex w-full items-center gap-1 rounded-card border border-border-strong bg-surface transition focus-within:border-brand focus-within:ring-2 focus-within:ring-green-weak",
        compact ? "h-11 pl-3 pr-1" : "h-14 pl-4 pr-1.5 sm:h-[58px]",
      )}
    >
      <Search
        size={compact ? 17 : 20}
        strokeWidth={2}
        className="shrink-0 text-muted"
        aria-hidden
      />
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder={
          compact
            ? "Buscar em todo o Patrinu…"
            : "Buscar em todo o Patrinu — técnica, bem, cidade, escritório…"
        }
        className={cn(
          "min-w-0 flex-1 bg-transparent px-2 text-ink outline-none placeholder:text-muted",
          compact ? "text-sm" : "text-[15px] sm:text-base",
        )}
      />
      <button
        type="submit"
        className={cn("btn btn-primary shrink-0", compact ? "btn-sm" : "")}
      >
        Buscar
      </button>
    </form>
  );
}
