import Link from "next/link";
import { MapPin } from "lucide-react";

import type { Project } from "@/lib/types";
import { projectStatusLabel, specialtyLabel } from "@/lib/taxonomy";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { Locked } from "@/components/locked";
import { getPlan } from "@/lib/membership";

const OPEN = new Set(["aberto", "em_captacao"]);

export async function ProjectTile({ project: p }: { project: Project }) {
  const open = OPEN.has(p.status);
  const canSeeValue = (await getPlan()) !== "visitante";

  return (
    <Link href={`/projetos/${p.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <SpecialtyThumb
            specialty={p.specialties[0] ?? "arquitetura"}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute left-3 top-3 rounded-pill bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-ink-soft shadow-[var(--shadow-card)]">
          {projectStatusLabel(p.status)}
        </span>
        {/* revela no hover, estilo mural */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
            {p.specialties.map((s) => specialtyLabel(s)).join(" · ")}
          </p>
          <p className="mt-1 line-clamp-2 font-display text-lg font-bold leading-tight text-white">
            {p.title}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-bold text-ink group-hover:text-green-ink">
            {p.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink-soft">
            <MapPin size={12} className="shrink-0" />
            {p.city}/{p.uf}
            {p.credits[0]?.name ? ` · ${p.credits[0].name}` : ""}
          </p>
        </div>
        {open && p.budgetRange ? (
          <Locked locked={!canSeeValue} cta="Cadastre-se" asLabel>
            <span className="shrink-0 font-bold text-green-ink">{p.budgetRange}</span>
          </Locked>
        ) : open ? (
          <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-green-ink">
            Aberto
          </span>
        ) : null}
      </div>
    </Link>
  );
}
