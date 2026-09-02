import Link from "next/link";
import { FileText } from "lucide-react";

import type { MyApplicationRow } from "@/lib/interactions";
import { formatDate } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { AVAIL_LABEL } from "./applicant-card";

const OPEN = ["aberto", "em_captacao"];

/** Candidatura enviada — o profissional acompanha o status. */
export function ApplicationCard({ a }: { a: MyApplicationRow }) {
  const open = OPEN.includes(a.projectStatus);
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={open ? "green" : "neutral"}>
          {open ? "candidatura enviada" : "vaga encerrada"}
        </Badge>
        <span className="text-xs text-muted">{formatDate(a.createdAt.toISOString())}</span>
      </div>
      <Link
        href={`/projetos/${a.projectSlug}`}
        className="mt-1 block font-semibold text-ink hover:underline"
      >
        {a.projectTitle}
      </Link>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
        {a.nationwide
          ? "Você atende todo o Brasil"
          : a.applicantCity && <span>Sua praça: {a.applicantCity}</span>}
        {a.availability && <span>{AVAIL_LABEL[a.availability] ?? a.availability}</span>}
        {a.cvUrl && (
          <a
            href={a.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-green-ink hover:underline"
          >
            <FileText size={12} />
            currículo enviado
          </a>
        )}
      </div>
      {a.message && (
        <p className="mt-2 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">{a.message}</p>
      )}
      <p className="mt-2 text-xs text-muted">
        {open
          ? "Aguardando retorno do contratante — ele fala com você pelo e-mail ou WhatsApp informado."
          : "Esta vaga não está mais recebendo candidaturas."}
      </p>
    </div>
  );
}
