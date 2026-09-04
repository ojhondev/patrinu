"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Galeria de imagens do projeto: slide principal com setas + tiras de
 * miniatura, e um lightbox em tela cheia para ver cada foto com qualidade.
 */
export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = images.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom, go]);

  return (
    <div className="mt-6">
      {/* slide principal */}
      <div className="group relative overflow-hidden rounded-card border border-border bg-sunk">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="block w-full"
          aria-label="Ampliar imagem"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`${title} — imagem ${index + 1} de ${count}`}
            className="aspect-[16/10] w-full object-cover"
          />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill bg-black/55 px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn size={13} /> Ampliar
          </span>
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-card)] transition hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-card)] transition hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-3 left-3 rounded-pill bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* miniaturas */}
      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-btn border-2 transition",
                i === index ? "border-green-ink" : "border-border opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[120] flex flex-col bg-black/90"
          onClick={() => setZoom(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-semibold">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => setZoom(false)}
              aria-label="Fechar"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="flex flex-1 items-center justify-center px-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {count > 1 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${title} — imagem ${index + 1}`}
              className="max-h-full max-w-full rounded-card object-contain"
            />
            {count > 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
