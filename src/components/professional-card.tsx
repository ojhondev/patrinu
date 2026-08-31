import Link from "next/link";
import { MapPin, BadgeCheck, Clock } from "lucide-react";

import type { Professional } from "@/lib/types";
import { specialtyLabel } from "@/lib/taxonomy";
import { SpecialtyIcon } from "@/components/specialty-visual";

export function ProfessionalCard({ pro }: { pro: Professional }) {
  return (
    <Link
      href={`/profissionais/${pro.slug}`}
      className="group flex flex-col border border-ink/12 bg-surface p-5 transition-colors hover:border-ink"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-green-weak text-green-ink">
          <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={22} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display font-bold text-ink group-hover:text-green-ink">
              {pro.displayName}
            </h3>
            {pro.verified && <BadgeCheck size={16} className="shrink-0 text-green" />}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{pro.headline}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pro.specialties.slice(0, 3).map((s) => (
          <span
            key={s}
            className="border border-ink/15 px-2 py-0.5 text-xs text-ink-soft"
          >
            {specialtyLabel(s)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/12 pt-3 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} />
          {pro.city}/{pro.uf}
        </span>
        {pro.responseHours ? (
          <span className="inline-flex items-center gap-1">
            <Clock size={13} />
            responde em ~{pro.responseHours}h
          </span>
        ) : null}
        {pro.plan === "pro" ? (
          <span className="ml-auto font-bold text-green-ink">PRO</span>
        ) : null}
      </div>
    </Link>
  );
}
