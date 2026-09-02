import Link from "next/link";
import { FileText } from "lucide-react";

import type { InterestRow } from "@/lib/interactions";
import { formatDate } from "@/lib/taxonomy";

export const AVAIL_LABEL: Record<string, string> = {
  imediata: "disponível imediatamente",
  "15_dias": "disponível em até 15 dias",
  "30_dias": "disponível em até 30 dias",
  a_combinar: "disponibilidade a combinar",
};

/** Candidatura recebida — o contratante vê os dados de quem se candidatou. */
export function ApplicantCard({ i }: { i: InterestRow }) {
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-semibold text-ink">{i.applicantName || i.userName}</span>
        <a
          href={`mailto:${i.applicantEmail || i.userEmail}`}
          className="text-xs font-medium text-green-ink hover:underline"
        >
          {i.applicantEmail || i.userEmail}
        </a>
        <span className="text-xs text-muted">· {formatDate(i.createdAt.toISOString())}</span>
      </div>
      <p className="mt-0.5 text-sm text-ink-soft">
        em{" "}
        <Link
          href={`/projetos/${i.projectSlug}`}
          className="font-semibold text-green-ink hover:underline"
        >
          {i.projectTitle}
        </Link>
      </p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
        {i.nationwide ? (
          <span>Atende todo o Brasil</span>
        ) : (
          i.applicantCity && <span>{i.applicantCity}</span>
        )}
        {i.availability && <span>{AVAIL_LABEL[i.availability] ?? i.availability}</span>}
        {i.cvUrl && (
          <a
            href={i.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-green-ink hover:underline"
          >
            <FileText size={12} />
            currículo (PDF)
          </a>
        )}
      </div>
      {i.message && (
        <p className="mt-2 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">{i.message}</p>
      )}
    </div>
  );
}
