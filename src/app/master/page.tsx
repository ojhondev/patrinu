import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Clock, Check, X } from "lucide-react";

import { isMasterSession } from "@/lib/auth";
import { logoutMaster } from "./actions";
import { MOCK_PENDING } from "@/lib/mock/moderation";
import { Badge } from "@/components/badge";
import { formatDate } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Master", robots: { index: false } };

const KIND_LABEL: Record<string, string> = {
  projeto: "Projeto",
  edital: "Edital",
  curso: "Curso",
  vaga: "Vaga",
};

export default async function MasterPage() {
  if (!(await isMasterSession())) redirect("/master/entrar");

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="inline-flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
            <ShieldCheck size={26} className="text-green-ink" />
            Master
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Acesso total — todas as contas, dados e conteúdos, sem barreiras.
          </p>
        </div>
        <form action={logoutMaster}>
          <button
            type="submit"
            className="rounded-lg border border-border-strong px-3.5 py-2 text-sm font-bold hover:border-green-ink"
          >
            Sair
          </button>
        </form>
      </header>

      {/* atalhos */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Projetos", "/projetos"],
          ["Profissionais", "/profissionais"],
          ["Editais", "/editais"],
          ["Cursos", "/cursos"],
          ["Notícias", "/noticias"],
          ["Financiamento", "/financiamento"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3 text-sm font-semibold hover:border-green-ink"
          >
            {label} →
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-bold">
          Aprovação de conteúdo{" "}
          <span className="font-mono text-sm text-muted">({MOCK_PENDING.length} na fila)</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Tudo que usuários publicam — projetos, vagas, editais ingeridos, pedidos de
          divulgação de curso — passa por aqui antes de ir ao ar. Novos perfis não precisam
          de revisão.
        </p>

        <div className="mt-4 space-y-3">
          {MOCK_PENDING.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{KIND_LABEL[item.kind]}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {formatDate(item.submittedAt)}
                  </span>
                </div>
                <p className="mt-1 font-semibold text-ink">{item.title}</p>
                <p className="text-sm text-ink-soft">Enviado por {item.submittedBy}</p>
                {item.note ? (
                  <p className="mt-1 text-xs text-muted">{item.note}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
                >
                  <Check size={15} />
                  Aprovar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3.5 py-2 text-sm font-bold text-ink-soft hover:border-crit hover:text-crit"
                >
                  <X size={15} />
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted">
          Protótipo — a fila usa dados de demonstração e os botões ainda não persistem.
        </p>
      </section>
    </div>
  );
}
