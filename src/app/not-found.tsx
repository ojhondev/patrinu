"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Erro 404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="mt-2 text-ink-soft">
        O endereço que você tentou abrir não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
