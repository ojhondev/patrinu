"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { SPECIALTIES } from "@/lib/taxonomy";
import { cn } from "@/lib/cn";

type Segment = { key: string; label: string };

/**
 * Barra de filtros responsiva e explícita para as páginas de listagem
 * (oportunidades, projetos, cursos). Segmentos roláveis + selects nativos.
 */
export function FilterBar({
  segments,
  segmentParam = "mode",
  segmentDefault,
  showSpecialty = true,
  extraSelects = [],
  total,
  unit,
}: {
  segments?: Segment[];
  segmentParam?: string;
  segmentDefault?: string;
  showSpecialty?: boolean;
  extraSelects?: { param: string; label: string; options: { value: string; label: string }[] }[];
  total: number;
  unit: [singular: string, plural: string];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = (k: string) => params.get(k) ?? "";
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params.toString());
    if (v) next.set(k, v);
    else next.delete(k);
    const s = next.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  };

  const activeSeg = current(segmentParam) || segmentDefault || segments?.[0]?.key || "";
  const hasFilters =
    [...params.keys()].filter((k) => k !== "q" && k !== segmentParam).length > 0 ||
    (segments && activeSeg !== (segmentDefault ?? segments[0]?.key));

  const selectCls =
    "h-9 min-w-[calc(50%-6px)] grow rounded-pill border border-border-strong bg-surface pl-3.5 pr-8 text-[13px] text-ink-soft outline-none transition-colors focus:border-brand sm:min-w-0 sm:grow-0";

  return (
    <div className="border-b border-border pb-4">
      {segments && (
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {segments.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setParam(segmentParam, s.key === (segmentDefault ?? segments[0].key) ? "" : s.key)}
              className={cn("chip shrink-0", activeSeg === s.key && "is-active")}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        {showSpecialty && (
          <select
            value={current("specialty")}
            onChange={(e) => setParam("specialty", e.target.value)}
            className={selectCls}
          >
            <option value="">Todas as especialidades</option>
            {Object.entries(SPECIALTIES).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        )}

        {extraSelects.map((sel) => (
          <select
            key={sel.param}
            value={current(sel.param)}
            onChange={(e) => setParam(sel.param, e.target.value)}
            className={selectCls}
          >
            <option value="">{sel.label}</option>
            {sel.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-[13px] font-semibold text-crit hover:underline"
          >
            Limpar
          </button>
        )}

        <p className="w-full text-sm text-ink-soft sm:ml-auto sm:w-auto">
          <strong className="font-bold text-ink tabular-nums">{total}</strong>{" "}
          {total === 1 ? unit[0] : unit[1]}
        </p>
      </div>
    </div>
  );
}
