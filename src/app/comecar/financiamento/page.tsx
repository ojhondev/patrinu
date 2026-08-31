import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { FinancingForm } from "@/components/financing-form";

export const metadata: Metadata = { title: "Quero financiamento de obra" };

export default async function FinanciamentoOnboardingPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/pro" className="text-sm font-semibold text-green-ink hover:underline">
        ← Patrinu Pro
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Quero financiamento de obra
      </h1>
      <p className="mt-2 text-ink-soft">
        Conte sobre o bem e o projeto. A Patrinu analisa e conecta com bancos, institutos e
        leis de incentivo com aderência — as respostas vão direto para a nossa equipe.
      </p>

      <FinancingForm defaultName={user?.name} defaultEmail={user?.email} />
    </div>
  );
}
