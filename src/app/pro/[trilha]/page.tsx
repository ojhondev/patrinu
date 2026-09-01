import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";

import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export function generateStaticParams() {
  return (["contratar", "oferecer", "financiamento"] as ProTrack[]).map((trilha) => ({
    trilha,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trilha: string }>;
}): Promise<Metadata> {
  const { trilha } = await params;
  const t = TRACKS[trilha as ProTrack];
  return { title: t ? `Membro Patrinu — ${t.label}` : "Membro Patrinu" };
}

type Content = {
  headline: string;
  accent: string;
  sub: string;
  steps: { title: string; body: string }[];
  painel: { title: string; items: string[] };
};

const CONTENT: Record<ProTrack, Content> = {
  contratar: {
    headline: "Encontre quem executa.",
    accent: "Publique seu projeto.",
    sub: "Para instituições, empresas, órgãos e dioceses com patrimônio para restaurar. Sem comissão — assinatura.",
    steps: [
      {
        title: "Descreva o que precisa restaurar",
        body: "O bem, o tipo de intervenção e o que você já tem de projeto ou recurso. Fotos ajudam o match.",
      },
      {
        title: "Publique ou só prospecte",
        body: "Abra o projeto para receber propostas, ou navegue os prospectos e convide profissionais direto.",
      },
      {
        title: "Compare e contrate",
        body: "Propostas lado a lado, com portfólio, registros e aderência à vista. A contratação acontece entre vocês.",
      },
    ],
    painel: {
      title: "No seu painel",
      items: [
        "Prospectos: profissionais que deram match ou se candidataram ao seu projeto",
        "Propostas recebidas, comparáveis lado a lado",
        "Status dos projetos publicados e das vagas abertas",
        "Sugestões de quem convidar",
      ],
    },
  },
  oferecer: {
    headline: "Seu portfólio, sua reputação",
    accent: "e o trabalho do setor num lugar.",
    sub: "Para restauradores, conservadores, ateliês e escritórios. Receba as oportunidades certas antes dos concorrentes.",
    steps: [
      {
        title: "Monte o perfil",
        body: "Especialidades, técnicas, registros (CAU/CREA, ART/RRT, ABRACOR) e um portfólio com antes/depois.",
      },
      {
        title: "Receba oportunidades compatíveis",
        body: "Editais e projetos abertos que casam com o seu perfil chegam no painel, ordenados por aderência e prazo.",
      },
      {
        title: "Dispute — sozinho ou em equipe",
        body: "Checklist de habilitação do edital cruzado com o seu cofre de documentos. Junte-se a uma equipe para projetos maiores.",
      },
    ],
    painel: {
      title: "No seu painel",
      items: [
        "Oportunidades compatíveis: editais e briefs por aderência ao seu perfil",
        "Minhas candidaturas: rascunho, manifestada, enviada, resultado",
        "Convites de contratantes e equipes em formação",
        "Desempenho do perfil: visitas, contatos, posição no diretório",
      ],
    },
  },
  financiamento: {
    headline: "Conecte o projeto ao recurso.",
    accent: "Elegibilidade sinalizada.",
    sub: "Para detentores do bem com projeto aprovado ou em elaboração. Descubra quem financia antes de abrir o processo.",
    steps: [
      {
        title: "Cadastre o bem e o projeto",
        body: "Status do projeto (ideia, básico, aprovado), meta de captação e a lei de incentivo que você pretende usar.",
      },
      {
        title: "Gere o dossiê",
        body: "Descrição, impacto cultural e social, e o enquadramento fiscal — pronto para enviar a um patrocinador.",
      },
      {
        title: "Veja quem sinaliza elegibilidade",
        body: "Bancos, institutos, estatais e leis de incentivo que marcaram o seu projeto como aderente, com o próximo passo.",
      },
    ],
    painel: {
      title: "No seu painel",
      items: [
        "Elegibilidade sinalizada: o leque de investidores por projeto, com o motivo",
        "Status de captação: meta, comprometido, gap",
        "Dossiê do projeto gerado, pronto para enviar",
        "Prazos das linhas de incentivo pretendidas",
      ],
    },
  },
};

export default async function ProTrackPage({
  params,
}: {
  params: Promise<{ trilha: string }>;
}) {
  const { trilha } = await params;
  const track = TRACKS[trilha as ProTrack];
  if (!track) notFound();
  const c = CONTENT[trilha as ProTrack];

  return (
    <>
      <section className="band band-hairlines text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11 lg:py-20">
          <nav className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/pro" className="hover:text-white">
              Membro Patrinu
            </Link>
            <ChevronRight size={13} />
            <span className="text-white/80">{track.label}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            {c.headline} <span className="accent text-accent">{c.accent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75">{c.sub}</p>

          <div className="mt-6 flex items-baseline gap-2">
            {track.priceCents != null ? (
              <>
                <span className="font-display text-4xl font-extrabold tracking-tight">
                  {track.priceLabel.split("/")[0]}
                </span>
                <span className="text-white/70">/mês · cancele quando quiser</span>
              </>
            ) : (
              <span className="font-display text-2xl font-bold">
                Análise gratuita do seu projeto
              </span>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {track.checkoutUrl ? (
              <a
                href={track.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="btn bg-white text-band hover:bg-white/90"
              >
                Assinar — {track.priceLabel.split("/")[0]}/mês
                <ArrowRight size={16} />
              </a>
            ) : (
              <Link href="/comecar/financiamento" className="btn bg-white text-band hover:bg-white/90">
                Responder o questionário
                <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href={`/painel?perfil=${track.perfil}`}
              className="btn border border-white/40 text-white hover:bg-white hover:text-band"
            >
              Ver um painel de exemplo
            </Link>
          </div>
          {track.checkoutUrl && (
            <p className="mt-2 text-xs text-white/55">
              Pagamento seguro pelo Mercado Pago. Depois de assinar, faça login com o mesmo
              e-mail para liberar os recursos Pro.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <h2 className="font-display text-2xl font-bold tracking-tight">Como funciona</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {c.steps.map((step, i) => (
            <div key={step.title}>
              <span className="text-sm font-bold text-green-ink">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-border bg-green-weak p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            {c.painel.title}
          </h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {c.painel.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft">
                <Check size={16} className="mt-0.5 shrink-0 text-green-ink" />
                {item}
              </li>
            ))}
          </ul>
          {track.checkoutUrl ? (
            <a
              href={track.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-6"
            >
              Assinar — {track.priceLabel.split("/")[0]}/mês
              <ArrowRight size={16} />
            </a>
          ) : (
            <Link href={`/comecar/${trilha}`} className="btn btn-primary mt-6">
              Responder o questionário
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
