import Link from "next/link";

import type { Project, ProjectStatus } from "@/lib/types";
import { specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { DeleteProjectButton } from "@/components/delete-project-button";

const STATUS_BADGE: Record<
  ProjectStatus,
  { tone: "green" | "neutral" | "ok" | "warn" | "crit"; label: string }
> = {
  rascunho: { tone: "neutral", label: "rascunho" },
  em_analise: { tone: "warn", label: "em análise" },
  recusado: { tone: "crit", label: "recusado" },
  vitrine: { tone: "green", label: "publicado · vitrine" },
  aberto: { tone: "green", label: "publicada" },
  em_captacao: { tone: "green", label: "em captação" },
  em_execucao: { tone: "ok", label: "em execução" },
  concluido: { tone: "ok", label: "concluído" },
};

const PUBLISHED = ["vitrine", "aberto", "em_captacao", "em_execucao", "concluido"];

export function PublicationRow({ p, applicants }: { p: Project; applicants: number }) {
  const s = STATUS_BADGE[p.status];
  const published = PUBLISHED.includes(p.status);
  return (
    <div className="flex flex-col gap-3 card p-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={s.tone}>{s.label}</Badge>
          <span className="text-xs text-muted">
            {p.entryKind === "vaga" ? "Vaga" : "Projeto"} · {p.city}/{p.uf}
            {p.year ? ` · ${p.year}` : ""}
          </span>
          {applicants > 0 && (
            <span className="rounded-pill bg-green-weak px-2 py-0.5 text-[11px] font-bold text-green-ink">
              {applicants} {applicants === 1 ? "candidatura" : "candidaturas"}
            </span>
          )}
        </div>
        <p className="mt-1 font-semibold text-ink">{p.title}</p>
        <p className="line-clamp-1 text-sm text-ink-soft">{p.summary}</p>
        {p.status === "recusado" && (
          <p className="mt-1 text-xs font-semibold text-crit">
            Recusado. Ajuste e publique novamente.
          </p>
        )}
        {p.specialties.length > 0 && (
          <p className="mt-1 text-xs text-muted">
            {p.specialties.map((sp) => specialtyLabel(sp)).join(" · ")}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
        {published && (
          <Link href={`/projetos/${p.slug}`} className="btn btn-secondary btn-sm">
            Ver publicado
          </Link>
        )}
        <DeleteProjectButton
          projectId={p.id}
          kind={p.entryKind === "vaga" ? "vaga" : "projeto"}
          hasApplicants={applicants > 0}
        />
      </div>
    </div>
  );
}
