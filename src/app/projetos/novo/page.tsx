import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { NewProjectForm } from "@/components/new-project-form";

export const metadata: Metadata = { title: "Publicar" };

export default async function NovoProjetoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/projetos/novo");
  const isPro = (await getPlan()) === "pro";
  const wantsProjeto = (await searchParams).tipo === "projeto";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/painel" className="text-sm font-semibold text-green-ink hover:underline">
        ← Voltar ao painel
      </Link>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">Publicar</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Uma vaga para contratar profissionais, ou uma obra concluída para a vitrine.
      </p>

      {!isPro && (
        <p className="mt-4 rounded-card border border-border bg-sunk px-4 py-3 text-sm text-ink-soft">
          Publicar <strong className="text-ink">vagas</strong> é um recurso do{" "}
          <Link href="/pro/contratar" className="font-semibold text-green-ink hover:underline">
            Patrinu Pro
          </Link>
          . Projetos para a vitrine seguem gratuitos (1 por mês).
        </p>
      )}

      <NewProjectForm isPro={isPro} defaultMode={isPro && !wantsProjeto ? "vaga" : "vitrine"} />
    </div>
  );
}
