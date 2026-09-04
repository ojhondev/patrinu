"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { KINDS, UFS, HERITAGE_HUBS } from "@/lib/taxonomy";
import { CATEGORY_GROUPS } from "@/lib/categories";

const UF_OPTIONS: [string, string][] = [
  ...HERITAGE_HUBS.map((uf) => [uf, `${uf} · polo`] as [string, string]),
  ...UFS.filter((uf) => !HERITAGE_HUBS.includes(uf)).map((uf) => [uf, uf] as [string, string]),
];

const SELECTS: { key: string; label: string; options: [string, string][] }[] = [
  {
    key: "grupo",
    label: "Categoria",
    options: CATEGORY_GROUPS.map((g) => [g.key, g.label] as [string, string]),
  },
  { key: "kind", label: "Tipo", options: Object.entries(KINDS) },
  { key: "uf", label: "Localização", options: UF_OPTIONS },
  {
    key: "minValue",
    label: "Valor mínimo",
    options: [
      ["100000", "R$ 100 mil+"],
      ["300000", "R$ 300 mil+"],
      ["1000000", "R$ 1 mi+"],
      ["3000000", "R$ 3 mi+"],
    ],
  },
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  const active = value !== "";
  const current = options.find(([v]) => v === value)?.[1];
  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border text-sm font-semibold transition-colors",
        active
          ? "border-green bg-green text-white"
          : "border-border-strong text-ink hover:border-green-ink",
      )}
    >
      <span className="pointer-events-none flex items-center gap-1.5 pl-4 pr-8">
        {active ? current : label}
        <ChevronDown size={15} className={active ? "text-white/75" : "text-muted"} />
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="">{label}: todos</option>
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RadarFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [openMobile, setOpenMobile] = useState(false);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      startTransition(() => {
        router.replace(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  const activeCount = SELECTS.filter((s) => params.get(s.key)).length + (params.get("q") ? 1 : 0);
  const sort = params.get("sort") ?? "prazo";

  return (
    <div data-pending={pending ? "" : undefined}>
      {/* linha de topo: no mobile é um botão que abre os filtros */}
      <div className="flex items-center justify-between gap-2 py-1">
        <button
          type="button"
          onClick={() => setOpenMobile((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink sm:cursor-default"
        >
          <SlidersHorizontal size={15} />
          Filtros
          {activeCount > 0 && (
            <span className="rounded-pill bg-green-weak px-2 py-0.5 text-[11px] font-bold text-green-ink">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={cn("text-muted transition-transform sm:hidden", openMobile && "rotate-180")}
          />
        </button>

        <label className="inline-flex shrink-0 items-center gap-1.5 text-sm">
          <span className="hidden text-ink-soft sm:inline">Ordenar:</span>
          <select
            aria-label="Ordenar"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "prazo" ? "" : e.target.value)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-[13px] font-semibold text-ink outline-none focus:border-green-ink"
          >
            <option value="prazo">Prazo mais próximo</option>
            <option value="valor">Maior valor</option>
            <option value="aderencia">Maior aderência</option>
            <option value="recentes">Mais recentes</option>
          </select>
        </label>
      </div>

      <div
        className={cn(
          "flex-wrap items-center gap-2 pb-1 sm:flex",
          openMobile ? "flex pt-2" : "hidden",
        )}
      >
        {SELECTS.map((s) => (
          <FilterSelect
            key={s.key}
            label={s.label}
            value={params.get(s.key) ?? ""}
            options={s.options}
            onChange={(v) => setParam(s.key, v)}
          />
        ))}

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            <X size={14} />
            Limpar ({activeCount})
          </button>
        )}

        <span className="ml-auto hidden text-sm text-ink-soft sm:inline">
          <strong className="font-bold text-ink tabular-nums">{total}</strong>{" "}
          {total === 1 ? "resultado" : "resultados"}
        </span>
      </div>
    </div>
  );
}
