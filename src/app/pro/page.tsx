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
    "Mostre os projetos da sua empresa na vitrine, publique vagas sem limite, receba candidatos com o contato completo e acompanhe editais e licitações de todo o Brasil em tempo real.",
  oferecer:
    "Sua página pública com portfólio e contato, prioridade no diretório e o selo Membro Pro, mais candidaturas ilimitadas às vagas do setor e o Radar de Editais completo.",
  financiamento:
    "Cadastre o bem e o projeto, gere o dossiê e veja no painel quais bancos, institutos e leis de incentivo sinalizam elegibilidade.",
};

export default function ProPage() {
  return (
    <>
      <section className="border-b border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-16">
          <p className="kicker text-muted">Plataforma independente</p>
          <h1 className="display mt-2 max-w-3xl text-3xl text-ink sm:text-5xl">
            Torne-se membro do <span className="accent font-medium text-green-ink">Patrinu</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
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
              <div key={key} className="card flex flex-col p-6">
                <span className="grid h-12 w-12 place-items-center rounded-[10px] bg-green-weak text-green-ink">
                  <Icon size={24} />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">
                  <Link href={`/pro/${key}`} className="hover:text-green-ink">
                    {t.label}
                  </Link>
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
                {t.checkoutUrl ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={t.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Assinar agora
                      <ArrowRight size={15} />
                    </a>
                    <Link
                      href={`/pro/${key}`}
                      className="text-center text-sm font-semibold text-green-ink hover:underline"
                    >
                      Ver o que inclui
                    </Link>
                  </div>
                ) : (
                  <Link href={`/pro/${key}`} className="btn btn-secondary mt-4">
                    Enviar meu projeto
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-card border border-border bg-sunk p-6">
          <p className="kicker text-green-ink">Por que assinar</p>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Sem comissão sobre o seu trabalho e sem intermediário entre você e quem contrata.
            Profissionais ganham página pública, prioridade no diretório e candidaturas
            ilimitadas. Empresas ganham vagas e projetos sem limite e o contato completo de
            cada candidato. Os dois lados recebem o Radar de Editais completo — valores,
            prazos e checklist de habilitação de todo o Brasil.
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
