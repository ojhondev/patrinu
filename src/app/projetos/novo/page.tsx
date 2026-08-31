import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { NewProjectForm } from "@/components/new-project-form";

export const metadata: Metadata = { title: "Publicar projeto" };

export default async function NovoProjetoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/projetos/novo");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/painel" className="text-sm font-semibold text-green-ink hover:underline">
        ← Voltar ao painel
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Publicar um projeto
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Um brief para encontrar profissionais, ou uma obra concluída para a vitrine.
      </p>

      <NewProjectForm />
    </div>
  );
}
