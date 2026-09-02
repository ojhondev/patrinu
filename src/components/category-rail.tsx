"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CATEGORY_GROUPS } from "@/lib/categories";
import { GROUP_IMAGE } from "@/lib/category-images";
import { cn } from "@/lib/cn";

/**
 * Carrossel rotativo dos grupos de categoria que têm arte pronta.
 * `base` = rota de destino (`/profissionais`, `/vagas`, `/editais`…), filtro `?grupo=`.
 */
export function CategoryRail({
  className,
  base = "/profissionais",
}: {
  className?: string;
  base?: string;
}) {
  const groups = CATEGORY_GROUPS.filter((g) => GROUP_IMAGE[g.key]);
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
        {groups.map((g) => (
          <Link
            key={g.key}
            href={`${base}?grupo=${g.key}`}
            className="group w-[228px] shrink-0 snap-start sm:w-[250px]"
          >
            <div className="flex aspect-[3/4] flex-col overflow-hidden rounded-[20px] bg-gradient-to-b from-[#e5391e] to-[#c1260f] p-5 shadow-[var(--shadow-card)] transition-shadow group-hover:shadow-[var(--shadow-pop)]">
              <span className="font-display text-[20px] font-extrabold leading-[1.12] text-white">
                {g.label}
              </span>
              <span className="mt-1.5 text-[13px] text-white/70">
                {g.specialties.length} especialidade{g.specialties.length === 1 ? "" : "s"}
              </span>
              <div className="mt-auto overflow-hidden rounded-[14px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={GROUP_IMAGE[g.key]}
                  alt={g.label}
                  loading="lazy"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!atStart && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Anterior"
          className="absolute -left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink shadow-[var(--shadow-pop)] hover:border-brand"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Próximo"
          className="absolute -right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink shadow-[var(--shadow-pop)] hover:border-brand"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
