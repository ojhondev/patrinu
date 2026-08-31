import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { listFunding } from "@/lib/directory";
import { listProjects } from "@/lib/projects";
import { FundingCard } from "@/components/funding-card";
import { ProjectCard } from "@/components/project-card";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Financiamento",
  description:
    "Match entre projeto de restauro e leis de incentivo, editais de banco e patrocinadores.",
};

export default async function FinanciamentoPage() {
  const [sources, emCaptacao] = await Promise.all([
    listFunding(),
    listProjects({ mode: "abertos" }),
  ]);
  const captacao = emCaptacao.filter((p) => p.status === "em_captacao");

  return (
    <>
      <PageHero
        tone="band"
        eyebrow="O lado do dinheiro"
        title={<>Conecte o projeto ao <span className="accent text-accent">recurso</span></>}
      >
        Match entre o seu projeto e as leis de incentivo, editais de banco e fundos com
        maior aderência.
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
        <div className="mb-12 flex flex-col items-start gap-4 border-l-4 border-brand bg-surface py-2 pl-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="kicker text-green-ink">Para detentores do bem</p>
            <h2 className="display mt-1 text-xl text-ink sm:text-2xl">
              Tem um projeto para captar?
            </h2>
            <p className="mt-1 max-w-xl text-ink-soft">
              Cadastre o bem, o objetivo e a meta. Geramos o dossiê e apontamos as fontes
              com aderência — e ele entra na Vitrine para patrocinadores.
            </p>
          </div>
          <Link
            href="/comecar/financiamento"
            className="inline-flex shrink-0 items-center gap-2 bg-green px-5 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-white hover:bg-green-hover"
          >
            Cadastrar projeto
            <ArrowRight size={16} />
          </Link>
        </div>

        <h2 className="rule display pb-3 text-2xl text-ink">Fontes de recurso</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {sources.map((s) => (
            <FundingCard key={s.slug} source={s} />
          ))}
        </div>

        {captacao.length > 0 && (
          <section className="mt-16 border-t-4 border-brand pt-10">
            <p className="kicker text-green-ink">Deal flow</p>
            <h2 className="display mt-2 text-2xl text-ink sm:text-3xl">
              Projetos buscando patrocínio
            </h2>
            <p className="mt-2 text-ink-soft">
              Para bancos e institutos. Dossiê e enquadramento fiscal prontos.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {captacao.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
