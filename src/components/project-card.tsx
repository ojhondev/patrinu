import Link from "next/link";
import { MapPin, Users } from "lucide-react";

import type { Project } from "@/lib/types";
import { projectStatusLabel, specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { SpecialtyThumb } from "@/components/specialty-visual";

const OPEN = new Set(["aberto", "em_captacao"]);

export function ProjectCard({ project: p }: { project: Project }) {
  const open = OPEN.has(p.status);
  return (
    <Link
      href={`/projetos/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
    >
      <SpecialtyThumb
        specialty={p.specialties[0] ?? "arquitetura"}
        label={projectStatusLabel(p.status)}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {p.specialties.slice(0, 2).map((s) => (
            <Badge key={s} tone="neutral">
              {specialtyLabel(s)}
            </Badge>
          ))}
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-ink group-hover:underline">
          {p.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{p.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {p.city}/{p.uf}
          </span>
          {p.year ? <span>· {p.year}</span> : null}
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-border pt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-ink-soft">
            <Users size={13} />
            {p.credits[0]?.name}
          </span>
          {open ? (
            <span className="font-bold text-green-ink">
              {p.budgetRange ?? "Aberto para proposta"}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
