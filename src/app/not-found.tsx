"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-ink">
        Erro 404
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Página não encontrada
      </h1>
      <p className="mt-2 text-ink-soft">
        O endereço que você tentou abrir não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-green px-5 py-3 text-sm font-bold text-green-deep hover:bg-green-hover"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
