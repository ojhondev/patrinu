import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Logo } from "@/components/logo";

const BULLETS = [
  "Busque oportunidades",
  "Publique projetos",
  "Encontre profissionais",
  "Editais, notícias e cursos",
];

/** Moldura editorial de 2 colunas para /entrar e /cadastro (mesma linguagem do popup). */
export function AuthShell({
  heading,
  sub,
  children,
}: {
  heading: string;
  sub: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* esquerda — bloco da marca */}
      <div className="relative hidden flex-col justify-between p-10 text-white lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/popup-artesao.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
        <Link href="/" className="relative">
          <Logo className="h-7" />
        </Link>
        <div className="relative">
          <h2 className="display text-4xl">
            O patrimônio do Brasil <span className="accent text-accent">está aqui.</span>
          </h2>
          <ul className="mt-6 space-y-2.5">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-white/90">
                <Check size={16} className="shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* direita — formulário */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo className="h-7" />
          </Link>
          <h1 className="display text-3xl text-ink">{heading}</h1>
          <p className="mt-2 text-sm text-ink-soft">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
