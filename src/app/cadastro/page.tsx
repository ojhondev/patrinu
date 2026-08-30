import type { Metadata } from "next";
import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = { title: "Cadastrar" };

export default function CadastroPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <Wordmark className="text-3xl" />
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
        Cadastro em breve
      </h1>
      <p className="mt-2 text-ink-soft">
        O cadastro de profissionais e empresas entra junto com a autenticação. Enquanto
        isso, veja como a plataforma funciona.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/projetos"
          className="rounded-lg bg-green px-5 py-3 text-sm font-bold text-white hover:bg-green-hover"
        >
          Ver os projetos
        </Link>
        <Link
          href="/#como-funciona"
          className="rounded-lg border border-border-strong px-5 py-3 text-sm font-bold hover:border-green-ink"
        >
          Como funciona
        </Link>
      </div>
    </div>
  );
}
