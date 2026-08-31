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

  return (
    <div className="rule pb-4">
      {segments && (
        <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
          {segments.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setParam(segmentParam, s.key === (segmentDefault ?? segments[0].key) ? "" : s.key)}
              className={cn(
                "shrink-0 whitespace-nowrap border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] transition-colors",
                activeSeg === s.key
                  ? "border-ink bg-ink text-white"
                  : "border-ink/20 text-ink-soft hover:border-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {showSpecialty && (
          <select
            value={current("specialty")}
            onChange={(e) => setParam("specialty", e.target.value)}
            className="border border-ink/25 bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
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
            className="border border-ink/25 bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
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
            className="text-[11px] font-bold uppercase tracking-[0.13em] text-crit hover:underline"
          >
            Limpar
          </button>
        )}

        <p className="ml-auto text-sm text-ink-soft">
          <strong className="font-bold text-ink tabular-nums">{total}</strong>{" "}
          {total === 1 ? unit[0] : unit[1]}
        </p>
      </div>
    </div>
  );
}
