import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { creditStatus } from "@/lib/credits";
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
  const credits = isPro ? null : await creditStatus(user.id, false);
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

      {!isPro && credits && (
        <p className="mt-4 rounded-card border border-border bg-sunk px-4 py-3 text-sm text-ink-soft">
          Você tem{" "}
          <strong className="text-ink">
            {credits.remaining} de {credits.limit} créditos grátis
          </strong>{" "}
          neste mês. Publicar uma vaga ou um projeto custa 1 crédito. Com o{" "}
          <Link href="/pro" className="font-semibold text-green-ink hover:underline">
            Patrinu Pro
          </Link>{" "}
          é ilimitado.
        </p>
      )}

      <NewProjectForm
        canPublish={isPro || (credits ? credits.remaining > 0 : true)}
        defaultMode={!wantsProjeto ? "vaga" : "vitrine"}
      />
    </div>
  );
}
