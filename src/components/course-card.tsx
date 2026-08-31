import { MapPin, Clock, ArrowUpRight } from "lucide-react";

import type { Course } from "@/lib/types";
import { courseFormatLabel, courseLevelLabel, specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";

export function CourseCard({ course: c }: { course: Course }) {
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col border border-ink/12 bg-surface p-5 transition-colors hover:border-ink"
    >
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <Badge tone="green">{courseLevelLabel(c.level)}</Badge>
        <Badge tone="outline">{courseFormatLabel(c.format)}</Badge>
        {c.proDiscount && <Badge tone="neutral">desconto PRO</Badge>}
      </div>
      <h3 className="mt-2 font-semibold leading-snug text-ink group-hover:underline">
        {c.title}
      </h3>
      <p className="mt-0.5 text-sm font-medium text-ink-soft">{c.provider}</p>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{c.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.specialties.slice(0, 2).map((s) => (
          <span key={s} className="rounded-md bg-sunk px-2 py-0.5 text-xs text-ink-soft">
            {specialtyLabel(s)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/12 pt-3 text-xs text-ink-soft">
        {c.city ? (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {c.city}/{c.uf}
          </span>
        ) : (
          <span>A distância</span>
        )}
        {c.hours ? (
          <span className="inline-flex items-center gap-1">
            <Clock size={13} />
            {c.hours}h
          </span>
        ) : null}
        {c.nextClass ? <span>· {c.nextClass}</span> : null}
        <span className="ml-auto inline-flex items-center gap-0.5 font-bold text-green-ink">
          Inscrição
          <ArrowUpRight size={13} />
        </span>
      </div>
    </a>
  );
}
