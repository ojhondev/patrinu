import Link from "next/link";
import { ArrowRight, Radar, Handshake, ScrollText } from "lucide-react";

import { radarStats } from "@/lib/opportunities";
import { formatBRL } from "@/lib/taxonomy";

export default async function HomePage() {
  const stats = await radarStats();

  return (
    <main className="mx-auto max-w-6xl px-5">
      {/* hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
          O ecossistema digital do patrimônio
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-balance">
          Todo edital de restauro do Brasil, e as ferramentas para ganhar.
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          A Patrinu é a infraestrutura do mercado de restauro e conservação de patrimônio.
          Um <strong className="text-ink font-medium">Radar</strong> que rastreia licitações,
          editais e chamamentos em centenas de fontes — e um{" "}
          <strong className="text-ink font-medium">Marketplace</strong> onde você monta a
          habilitação, forma consórcio e disputa.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover transition-colors"
          >
            Abrir o Radar
            <ArrowRight size={16} />
          </Link>
          <a
            href="/docs/PRD-v3.html"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:border-border-strong transition-colors"
          >
            Ler o PRD
          </a>
        </div>

        <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border">
          {[
            ["Oportunidades abertas", String(stats.abertas)],
            ["Fontes no Radar", String(stats.fontes)],
            ["Estados", String(stats.ufs)],
            ["Em disputa", formatBRL(stats.valorAberto)],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface px-4 py-3">
              <dt className="font-mono text-[0.62rem] uppercase tracking-wide text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* two engines */}
      <section className="grid gap-4 md:grid-cols-2 pb-6">
        <article className="rounded-lg border border-border bg-surface p-6">
          <Radar className="text-accent" size={22} />
          <h2 className="mt-3 text-lg font-semibold">Motor 1 — Radar de Oportunidades</h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            Ingestão e estruturação com IA de toda licitação, edital, chamamento e programa
            relevante a patrimônio. Feed personalizado por especialidade, região e valor.
            Alertas antes do concorrente.
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            Recorrência · hábito diário · dado de mercado
          </p>
        </article>
        <article className="rounded-lg border border-border bg-surface p-6">
          <Handshake className="text-accent" size={22} />
          <h2 className="mt-3 text-lg font-semibold">Motor 2 — Marketplace</h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            Onde a atenção do Radar vira trabalho: checklist de habilitação gerado do edital,
            cofre de documentos reutilizável, formação de consórcio e — em breve — projetos
            privados nativos.
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            Transação · reputação verificável · efeito de rede
          </p>
        </article>
      </section>

      <section className="pb-16">
        <div className="rounded-lg border border-border bg-accent-weak/40 p-6 flex items-start gap-4">
          <ScrollText className="text-accent shrink-0" size={22} />
          <div>
            <h2 className="font-semibold">Passaporte do Patrimônio</h2>
            <p className="mt-1.5 text-sm text-ink-soft leading-relaxed max-w-2xl">
              Cada projeto documentado na plataforma vira uma entrada no histórico do bem —
              intervenções, técnicas, materiais e quem executou. O dado que nenhum concorrente
              tem.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
