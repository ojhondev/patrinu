import Link from "next/link";
import { MapPin, Building2, CalendarClock } from "lucide-react";

import type { Opportunity } from "@/lib/types";
import { daysUntil, formatBRL, kindLabel, specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";

function DeadlinePill({ deadlineAt, status }: Pick<Opportunity, "deadlineAt" | "status">) {
  if (status !== "aberta") {
    return <Badge tone={status === "homologada" ? "ok" : "neutral"}>{status}</Badge>;
  }
  const d = daysUntil(deadlineAt);
  if (d == null) return <Badge tone="neutral">sem prazo</Badge>;
  if (d < 0) return <Badge tone="crit">encerrada</Badge>;
  const tone = d <= 7 ? "crit" : d <= 20 ? "warn" : "accent";
  return (
    <Badge tone={tone}>
      <CalendarClock size={11} strokeWidth={2.2} />
      {d === 0 ? "hoje" : `${d} d`}
    </Badge>
  );
}

export function OpportunityCard({ op }: { op: Opportunity }) {
  return (
    <Link
      href={`/radar/${op.id}`}
      className="group block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-sunk/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="rust">{kindLabel(op.kind)}</Badge>
          {op.specialties.slice(0, 2).map((s) => (
            <Badge key={s}>{specialtyLabel(s)}</Badge>
          ))}
        </div>
        <DeadlinePill deadlineAt={op.deadlineAt} status={op.status} />
      </div>

      <h3 className="mt-2.5 font-medium leading-snug text-ink group-hover:text-accent transition-colors text-balance">
        {op.title}
      </h3>

      <p className="mt-1.5 text-sm text-ink-soft line-clamp-2">{op.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Building2 size={13} />
          {op.organ.split("—")[0].trim()}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} />
          {op.city ? `${op.city}/${op.uf}` : op.uf ?? "Nacional"}
        </span>
        <span className="ml-auto font-mono tabular-nums text-ink-soft">
          {formatBRL(op.estimatedValue)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[0.68rem] font-mono text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/70" />
        {op.source.name}
      </div>
    </Link>
  );
}
