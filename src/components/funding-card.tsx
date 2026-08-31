import { ArrowUpRight, Check } from "lucide-react";

import type { FundingSource } from "@/lib/types";
import { fundingKindLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";

export function FundingCard({ source: f }: { source: FundingSource }) {
  return (
    <div className="flex flex-col border border-ink/12 bg-surface p-5">
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <Badge tone="green">{fundingKindLabel(f.kind)}</Badge>
        <Badge tone="outline" className="capitalize">
          {f.scope}
        </Badge>
      </div>
      <h3 className="mt-2 font-bold leading-snug text-ink">{f.name}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{f.summary}</p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
        Aderência
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {f.fitFor.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-ink-soft">
            <Check size={15} className="mt-0.5 shrink-0 text-green-ink" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/12 pt-3 text-xs text-ink-soft">
        {f.ticket ? <span>{f.ticket}</span> : null}
        {f.cycle ? <span>· {f.cycle}</span> : null}
        <a
          href={f.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-0.5 font-bold text-green-ink hover:underline"
        >
          Site oficial
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}
