import Link from "next/link";
import { MapPin, BadgeCheck, Clock, Star } from "lucide-react";

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
    <article className="border-b border-ink/12 py-6 first:pt-0">
      <div className="flex gap-4 sm:gap-5">
        <Link
          href={`/profissionais/${pro.slug}`}
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-green-weak text-green-ink sm:h-20 sm:w-20"
        >
          <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={30} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/profissionais/${pro.slug}`}
              className="font-display text-lg font-bold text-ink hover:text-green-ink"
            >
              {pro.displayName}
            </Link>
            {pro.verified && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-green-weak px-1.5 py-0.5 text-[11px] font-bold text-green-ink">
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
                className="rounded-sm border border-ink/15 px-2 py-0.5 text-xs text-ink-soft"
              >
                {specialtyLabel(s)}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end justify-between sm:flex">
          {pro.plan === "pro" && (
            <span className="bg-band px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              Pro
            </span>
          )}
          <Link
            href={`/profissionais/${pro.slug}`}
            className="mt-auto whitespace-nowrap rounded-lg border border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
