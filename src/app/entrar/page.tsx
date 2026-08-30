import type { Metadata } from "next";
import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = { title: "Entrar" };

export default function EntrarPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <Wordmark className="text-3xl" />
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
        Autenticação em breve
      </h1>
      <p className="mt-2 text-ink-soft">
        O login por sessão própria (cookie assinado + scrypt) é o próximo passo do MVP.
        Por enquanto, o Radar e o fluxo de resposta rodam com um perfil de demonstração.
      </p>
      <Link
        href="/radar"
        className="mt-6 rounded-lg bg-green px-5 py-3 text-sm font-bold text-green-deep hover:bg-green-hover"
      >
        Explorar o Radar
      </Link>
    </div>
  );
}
