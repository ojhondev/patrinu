import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { Clock } from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { projectsByOwner } from "@/lib/projects";
import { interestsForOwner } from "@/lib/interactions";
import { PublicationRow } from "@/components/painel/publication-row";

export const metadata: Metadata = { title: "Minhas publicações · Painel" };

export default async function PublicacoesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel/publicacoes");

  const editado = (await searchParams).editado === "1";

  const [projects, received] = await Promise.all([
    projectsByOwner(user.id),
    interestsForOwner(user.id),
  ]);
  const countBy = new Map<string, number>();
  for (const i of received) countBy.set(i.projectId, (countBy.get(i.projectId) ?? 0) + 1);

  const vagas = projects.filter((p) => p.entryKind === "vaga");
  const projetos = projects.filter((p) => p.entryKind !== "vaga");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-3xl text-ink">Minhas publicações</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Vagas e projetos que você publicou, com o status de moderação e o número de
            candidaturas.
          </p>
        </div>
        <Link href="/projetos/novo" className="btn btn-primary btn-sm">
          <Plus size={15} />
          Publicar
        </Link>
      </header>

      {editado && (
        <div className="flex items-start gap-3 rounded-card border border-green-ink/25 bg-green-weak p-4">
          <Clock size={18} className="mt-0.5 shrink-0 text-green-ink" />
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">Alterações salvas.</strong> A publicação voltou para a
            fila de revisão e fica no ar de novo assim que for aprovada — normalmente em até 1
            dia útil.
          </p>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
          Você ainda não publicou nada.{" "}
          <Link href="/projetos/novo" className="font-semibold text-green-ink hover:underline">
            Publicar uma vaga ou um projeto
          </Link>
          .
        </p>
      ) : (
        <>
          {vagas.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-base font-bold text-ink">
                Vagas <span className="text-sm font-medium text-muted">({vagas.length})</span>
              </h2>
              <div className="space-y-3">
                {vagas.map((p) => (
                  <PublicationRow key={p.id} p={p} applicants={countBy.get(p.id) ?? 0} />
                ))}
              </div>
            </section>
          )}
          {projetos.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-base font-bold text-ink">
                Projetos na vitrine{" "}
                <span className="text-sm font-medium text-muted">({projetos.length})</span>
              </h2>
              <div className="space-y-3">
                {projetos.map((p) => (
                  <PublicationRow key={p.id} p={p} applicants={countBy.get(p.id) ?? 0} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
