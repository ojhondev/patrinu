"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CATEGORY_GROUPS } from "@/lib/categories";
import { GROUP_IMAGE } from "@/lib/category-images";
import { GroupIcon } from "@/components/specialty-visual";
import { cn } from "@/lib/cn";

/**
 * Carrossel rotativo de grupos de categoria. `base` = rota de destino
 * (`/profissionais`, `/vagas`, `/editais`…), filtro via `?grupo=`.
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
      >
        {groups.map((g) => {
          const img = GROUP_IMAGE[g.key];
          return (
            <Link
              key={g.key}
              href={`${base}?grupo=${g.key}`}
              className="group w-[190px] shrink-0 snap-start sm:w-[220px]"
            >
              {img ? (
                <div className="overflow-hidden rounded-2xl bg-[#0b0b0b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={g.label}
                    loading="lazy"
                    className="aspect-[13/10] w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div className="flex aspect-[13/10] flex-col justify-between rounded-2xl bg-gradient-to-br from-brand to-[#b3220f] p-4 text-white transition-transform duration-300 group-hover:scale-[1.03]">
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-white/15">
                    <GroupIcon group={g.key} size={20} />
                  </span>
                  <span className="text-[11px] font-semibold text-white/80">
                    {g.specialties.length} especialidade{g.specialties.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}
              <span className="mt-2 block px-0.5 text-xs font-semibold leading-tight text-ink group-hover:text-green-ink">
                {g.label}
              </span>
            </Link>
          );
        })}
      </div>

      {!atStart && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Anterior"
          className="absolute -left-3 top-[40%] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink shadow-[var(--shadow-pop)] hover:border-brand"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Próximo"
          className="absolute -right-3 top-[40%] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink shadow-[var(--shadow-pop)] hover:border-brand"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
