import Link from "next/link";

import { SPECIALTIES, type SpecialtyKey } from "@/lib/taxonomy";
import { SpecialtyIcon } from "@/components/specialty-visual";
import { cn } from "@/lib/cn";

export function CategoryRail({
  className,
  base = "/projetos",
}: {
  className?: string;
  base?: string;
}) {
  const entries = Object.entries(SPECIALTIES) as [SpecialtyKey, string][];
  return (
    <nav
      aria-label="Especialidades"
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto sm:flex-wrap sm:justify-center",
        className,
      )}
    >
      {entries.map(([key, label]) => (
        <Link
          key={key}
          href={`${base}?specialty=${key}`}
          className="group flex shrink-0 flex-col items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-center transition-colors hover:border-border hover:bg-sunk"
        >
          <SpecialtyIcon
            specialty={key}
            size={24}
            className="text-ink-soft transition-colors group-hover:text-green-ink"
          />
          <span className="max-w-[7.5rem] text-xs font-semibold leading-tight text-ink-soft group-hover:text-ink">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
