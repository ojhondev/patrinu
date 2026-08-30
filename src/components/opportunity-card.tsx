import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

import type { Opportunity } from "@/lib/types";
import { daysUntil, formatBRL, kindLabel, specialtyLabel } from "@/lib/taxonomy";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/badge";
import { MatchScore } from "@/components/match-score";
import { SpecialtyThumb } from "@/components/specialty-visual";

function Deadline({ op }: { op: Opportunity }) {
  if (op.status !== "aberta") {
    return (
      <Badge tone={op.status === "homologada" ? "ok" : "neutral"} className="capitalize">
        {op.status}
      </Badge>
    );
  }
  const d = daysUntil(op.deadlineAt);
  if (d == null)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
        <Clock size={13} /> fluxo contínuo
      </span>
    );
  const tone = d <= 7 ? "text-crit" : d <= 20 ? "text-warn" : "text-ink-soft";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", tone)}>
      <Clock size={13} />
      {d < 0 ? "encerrada" : d === 0 ? "encerra hoje" : `${d} dias restantes`}
    </span>
  );
}

export function OpportunityCard({ op }: { op: Opportunity }) {
  return (
    <Link
      href={`/editais/${op.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
    >
      <SpecialtyThumb
        specialty={op.specialties[0] ?? "arquitetura"}
        label={kindLabel(op.kind)}
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
          <span className="truncate font-semibold">{op.source.name}</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-ink group-hover:underline">
          {op.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {op.city ? `${op.city}/${op.uf}` : op.uf ?? "Nacional"}
          </span>
          {op.specialties[0] ? (
            <span className="truncate">{specialtyLabel(op.specialties[0])}</span>
          ) : null}
        </div>

        <div className="mt-2">
          <MatchScore score={op.relevanceScore} showLabel={false} />
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
          <Deadline op={op} />
          <div className="text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
              {op.kind === "licitacao" ? "Valor estimado" : "A partir de"}
            </span>
            <span className="text-sm font-extrabold tabular-nums text-ink">
              {formatBRL(op.estimatedValue)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
