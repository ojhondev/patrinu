import Link from "next/link";
import { Lock } from "lucide-react";

import type { Project } from "@/lib/types";
import {
  specialtyLabel,
  contractTypeLabel,
  workModeLabel,
  seniorityLabel,
  formatSalary,
} from "@/lib/taxonomy";
import { getPlan } from "@/lib/membership";

export async function VagaCard({ vaga: v }: { vaga: Project }) {
  const isPro = (await getPlan()) === "pro";
  const org = v.credits[0]?.name ?? "—";
  const salary = formatSalary(v.salaryMin, v.salaryMax, v.salaryConfidential);
  const meta = [
    v.contractType && contractTypeLabel(v.contractType),
    v.workMode && workModeLabel(v.workMode),
    v.seniority && seniorityLabel(v.seniority),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/projetos/${v.slug}`}
      className="card card-hover group flex flex-col gap-3 p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-sunk-2 text-[13px] font-bold text-ink-soft">
          {org.slice(0, 2).toUpperCase()}
        </span>
        <span className="truncate text-[13px] text-muted">
          {org} · {v.city}/{v.uf}
        </span>
      </div>

      <h3 className="font-display text-base font-bold leading-snug text-ink group-hover:text-green-ink">
        {v.vagaRole ?? v.title}
      </h3>

      {v.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {v.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-pill border border-border bg-sunk px-2.5 py-0.5 text-xs text-ink-soft"
            >
              {specialtyLabel(s)}
            </span>
          ))}
        </div>
      )}

      {/* hover: revela a ação; padrão: rodapé de meta + salário */}
      <div className="mt-auto pt-3">
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs group-hover:hidden">
          <span className="text-muted">{meta || "Contratação"}</span>
          {salary ? (
            <span className="text-sm font-bold text-green-ink">{salary}</span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-muted">
              <Lock size={12} /> A combinar
            </span>
          )}
        </div>
        <span
          className={
            isPro
              ? "btn btn-primary btn-sm hidden w-full group-hover:flex"
              : "btn btn-secondary btn-sm hidden w-full group-hover:flex"
          }
        >
          {isPro ? "Candidatar-se" : "Torne-se membro Pro"}
        </span>
      </div>
    </Link>
  );
}
