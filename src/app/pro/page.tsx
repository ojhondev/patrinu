import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Hammer, Landmark } from "lucide-react";

import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export const metadata: Metadata = {
  title: "Seja membro",
  description:
    "O Patrinu é uma plataforma independente que reúne conservação e restauro do patrimônio no Brasil, mantida pela assinatura dos seus membros.",
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
      <section className="band band-hairlines text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11 lg:py-24">
          <p className="kicker text-accent">Plataforma independente</p>
          <h1 className="display mt-4 max-w-3xl text-4xl text-white sm:text-6xl">
            Torne-se membro do <span className="accent text-accent">Patrinu</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">
            O Patrinu reúne num só lugar tudo sobre conservação e restauro do patrimônio no
            Brasil — projetos, profissionais, editais, notícias e cursos. É uma plataforma
            independente: o que a mantém no ar é a assinatura de quem usa.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <p className="kicker text-muted">Escolha por onde começar</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {(Object.keys(TRACKS) as ProTrack[]).map((key) => {
            const t = TRACKS[key];
            const Icon = ICONS[key];
            return (
              <Link
                key={key}
                href={`/pro/${key}`}
                className="group flex flex-col border border-ink/12 bg-surface p-6 transition-colors hover:border-ink"
              >
                <span className="grid h-12 w-12 place-items-center bg-green-weak text-green-ink">
                  <Icon size={24} />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold group-hover:text-green-ink">
                  {t.label}
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink-soft">{t.who}</p>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{HELP[key]}</p>
                <p className="mt-4 font-display text-2xl font-extrabold tracking-tight">
                  {t.priceCents != null ? (
                    <>
                      {t.priceLabel.split("/")[0]}
                      <span className="text-sm font-semibold text-muted"> /mês</span>
                    </>
                  ) : (
                    <span className="text-lg">Sob análise</span>
                  )}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-green-ink">
                  {t.priceCents != null ? "Ver e tornar-se membro" : "Enviar meu projeto"}
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 border-l-4 border-brand py-2 pl-6">
          <p className="kicker text-green-ink">Por que assinar</p>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Sem anúncios que atrapalham, sem comissão sobre o seu trabalho e sem depender de
            um único patrocinador. Quem é membro sustenta um acervo que fica para o setor —
            e ganha o Radar de Editais completo, propostas ilimitadas e os painéis com match.
          </p>
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-green-ink hover:underline">
            Entrar
          </Link>
          . O acervo (projetos, profissionais, editais, notícias, cursos) continua aberto
          para consulta.
        </p>
      </section>
    </>
  );
}
