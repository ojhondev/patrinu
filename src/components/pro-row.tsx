import Link from "next/link";
import { MapPin, BadgeCheck, Clock, Star, Sparkles } from "lucide-react";

import type { Professional } from "@/lib/types";
import { specialtyLabel } from "@/lib/taxonomy";
import { SpecialtyIcon } from "@/components/specialty-visual";

const VERIF_LABEL: Record<Professional["verificationLevel"], string> = {
  email: "Cadastro",
  registro: "Registro verificado",
  projeto_documentado: "Obra documentada",
  completo: "Pro verificado",
};

export function ProRow({ pro }: { pro: Professional }) {
  return (
    <article
      className={
        "border-b border-border py-6 first:pt-0 " +
        (pro.pro ? "relative pl-4 before:absolute before:inset-y-4 before:left-0 before:w-1 before:rounded-pill before:bg-brand" : "")
      }
    >
      <div className="flex gap-4 sm:gap-5">
        <Link
          href={`/profissionais/${pro.slug}`}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-pill sm:h-20 sm:w-20"
        >
          {pro.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pro.avatarUrl} alt={pro.displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center bg-green-weak text-green-ink">
              <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={30} />
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/profissionais/${pro.slug}`}
              className="font-display text-lg font-bold text-ink hover:text-green-ink"
            >
              {pro.displayName}
            </Link>
            {pro.pro && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
                <Sparkles size={11} />
                Pro
              </span>
            )}
            {pro.verified && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-green-weak px-2 py-0.5 text-[11px] font-bold text-green-ink">
                <BadgeCheck size={12} />
                {VERIF_LABEL[pro.verificationLevel]}
              </span>
            )}
            {pro.score != null && (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                <Star size={13} className="fill-star text-star" />
                {(pro.score / 20).toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{pro.headline}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {pro.city}/{pro.uf}
            </span>
            {pro.responseHours ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                responde em ~{pro.responseHours}h
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {pro.specialties.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-pill border border-border bg-sunk px-2.5 py-0.5 text-xs text-ink-soft"
              >
                {specialtyLabel(s)}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-end sm:flex">
          <Link href={`/profissionais/${pro.slug}`} className="btn btn-secondary btn-sm">
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
