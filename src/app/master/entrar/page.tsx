import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isMasterSession } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { MasterLoginForm } from "./form";

export const metadata: Metadata = { title: "Acesso Master", robots: { index: false } };

export default async function MasterEntrarPage() {
  if (await isMasterSession()) redirect("/master");

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 text-center">
      <Logo className="h-8" />
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Acesso Master</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Área de administração da Patrinu. Acesso restrito.
      </p>
      <MasterLoginForm />
    </div>
  );
}
