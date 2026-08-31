import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Pedido enviado" };

export default function FinanciamentoEnviadoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <CheckCircle2 size={44} className="text-green-ink" />
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
        Pedido enviado
      </h1>
      <p className="mt-2 text-ink-soft">
        A equipe da Patrinu recebeu o seu projeto e vai analisar as fontes de financiamento
        com aderência. Retornamos pelo e-mail informado.
      </p>
      <Link
        href="/financiamento"
        className="mt-6 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
      >
        Ver fontes de financiamento
      </Link>
    </div>
  );
}
