import Link from "next/link";

import { CATEGORY_GROUPS } from "@/lib/categories";
import { GroupIcon } from "@/components/specialty-visual";
import { cn } from "@/lib/cn";

/**
 * Grade de grupos de categoria. `base` = rota de destino
 * (`/profissionais`, `/vagas`, `/editais`…), filtro via `?grupo=`.
 * `limit` corta a lista (a home mostra alguns + "ver todos").
 */
export function CategoryRail({
  className,
  base = "/profissionais",
  limit,
}: {
  className?: string;
  base?: string;
  limit?: number;
}) {
  const groups = limit ? CATEGORY_GROUPS.slice(0, limit) : CATEGORY_GROUPS;
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {groups.map((g) => (
        <Link
          key={g.key}
          href={`${base}?grupo=${g.key}`}
          className="card card-hover group flex flex-col gap-2.5 p-4"
        >
          <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-green-weak text-green-ink">
            <GroupIcon group={g.key} size={20} />
          </span>
          <span className="text-sm font-semibold leading-tight text-ink group-hover:text-green-ink">
            {g.label}
          </span>
          <span className="text-xs text-muted">
            {g.specialties.length} especialidade{g.specialties.length === 1 ? "" : "s"}
          </span>
        </Link>
      ))}
    </div>
  );
}
