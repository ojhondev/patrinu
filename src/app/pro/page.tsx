import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Hammer, Landmark } from "lucide-react";

import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export const metadata: Metadata = {
  title: "Patrinu Pro",
  description:
    "A experiência guiada da Patrinu: quero contratar, quero oferecer serviços ou quero financiamento de obra.",
};

const ICONS: Record<ProTrack, typeof Building2> = {
  contratar: Building2,
  oferecer: Hammer,
  financiamento: Landmark,
};

const HELP: Record<ProTrack, string> = {
  contratar:
    "Publique o projeto, receba propostas comparáveis e veja no painel os profissionais que dão match com o que você precisa.",
  oferecer:
    "Monte perfil e portfólio, e receba no painel as oportunidades — editais e projetos — que casam com a sua especialidade, antes dos concorrentes.",
  financiamento:
    "Cadastre o bem e o projeto, gere o dossiê e veja no painel quais bancos, institutos e leis de incentivo sinalizam elegibilidade.",
};

export default function ProPage() {
  return (
    <>
      <section className="bg-band text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Patrinu Pro
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Comece pelo que você <span className="accent text-accent">quer fazer</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Três trilhas, três experiências. Cada uma com o seu cadastro e o seu painel.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div className="grid gap-6 lg:grid-cols-3">
          {(Object.keys(TRACKS) as ProTrack[]).map((key) => {
            const t = TRACKS[key];
            const Icon = ICONS[key];
            return (
              <Link
                key={key}
                href={`/pro/${key}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-green-ink hover:shadow-[var(--shadow-pop)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-weak text-green-ink">
                  <Icon size={24} />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold group-hover:underline">
                  {t.label}
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink-soft">{t.who}</p>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{HELP[key]}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green-ink">
                  Ver a trilha
                  <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-green-ink hover:underline">
            Entrar
          </Link>
          . O hub (projetos, profissionais, editais, notícias, cursos) continua aberto e
          gratuito.
        </p>
      </section>
    </>
  );
}
