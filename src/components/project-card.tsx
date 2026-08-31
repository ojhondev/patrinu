import Link from "next/link";
import { MapPin, Users } from "lucide-react";

import type { Project } from "@/lib/types";
import { projectStatusLabel, specialtyLabel } from "@/lib/taxonomy";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { Locked } from "@/components/locked";
import { getPlan } from "@/lib/membership";

const OPEN = new Set(["aberto", "em_captacao"]);

export async function ProjectCard({ project: p }: { project: Project }) {
  const open = OPEN.has(p.status);
  const plan = await getPlan();
  const canSeeValue = plan !== "visitante"; // valor: precisa de conta
  const isMember = plan === "pro"; // contratante: precisa ser membro
  return (
    <Link
      href={`/projetos/${p.slug}`}
      className="group flex flex-col overflow-hidden border border-ink/12 bg-surface transition-colors hover:border-ink"
    >
      {p.images?.[0] ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
          <span className="absolute left-0 top-0 bg-band px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {projectStatusLabel(p.status)}
          </span>
        </div>
      ) : (
        <SpecialtyThumb
          specialty={p.specialties[0] ?? "arquitetura"}
          label={projectStatusLabel(p.status)}
          className="aspect-[16/10] w-full"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="kicker text-muted">
          {p.specialties.slice(0, 2).map((s) => specialtyLabel(s)).join(" · ")}
        </p>
        <h3 className="mt-2 line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink group-hover:text-green-ink">
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

        <div className="mt-3 flex items-end justify-between border-t border-ink/12 pt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-ink-soft">
            <Users size={13} />
            {open ? (
              <Locked locked={!isMember} cta="Membros" asLabel>
                <span>{p.credits[0]?.name ?? "—"}</span>
              </Locked>
            ) : (
              (p.credits[0]?.name ?? "—")
            )}
          </span>
          {open && p.budgetRange ? (
            <Locked locked={!canSeeValue} cta="Cadastre-se" asLabel>
              <span className="font-bold text-green-ink">{p.budgetRange}</span>
            </Locked>
          ) : open ? (
            <span className="font-bold text-green-ink">Aberto para proposta</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
