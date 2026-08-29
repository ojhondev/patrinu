"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";

import { KINDS, SPECIALTIES, UFS, HERITAGE_HUBS } from "@/lib/taxonomy";

const SELECTS = [
  { key: "specialty", label: "Especialidade", options: Object.entries(SPECIALTIES) },
  { key: "kind", label: "Tipo", options: Object.entries(KINDS) },
  {
    key: "uf",
    label: "UF",
    options: [
      ...HERITAGE_HUBS.map((uf) => [uf, `${uf} · polo`] as [string, string]),
      ...UFS.filter((uf) => !HERITAGE_HUBS.includes(uf)).map((uf) => [uf, uf] as [string, string]),
    ],
  },
] as const;

export function RadarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

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

  const hasFilters = [...params.keys()].length > 0;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-pending={pending ? "" : undefined}
    >
      <label className="relative flex-1 min-w-[14rem]">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Buscar por técnica, bem, órgão…"
          onChange={(e) => setParam("q", e.target.value)}
          className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </label>

      {SELECTS.map(({ key, label, options }) => (
        <select
          key={key}
          value={params.get(key) ?? ""}
          onChange={(e) => setParam(key, e.target.value)}
          className="rounded-md border border-border bg-surface px-2.5 py-2 text-sm outline-none focus:border-accent"
          aria-label={label}
        >
          <option value="">{label}</option>
          {options.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      ))}

      {hasFilters && (
        <button
          type="button"
          onClick={() =>
            startTransition(() => router.replace(pathname, { scroll: false }))
          }
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-2 text-sm text-muted hover:text-ink hover:border-border-strong"
        >
          <X size={14} />
          Limpar
        </button>
      )}
    </div>
  );
}
