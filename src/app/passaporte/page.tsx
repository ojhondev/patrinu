import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Passaporte do Patrimônio" };

export default function PassaportePage() {
  return (
    <>
      <PageHero
        eyebrow="O dado mais defensável do negócio"
        title={<>O histórico completo de cada <span className="accent">bem</span></>}
      >
        Registro canônico e longitudinal: intervenções, técnicas e materiais usados,
        profissionais responsáveis, laudos e evolução de estado ao longo do tempo.
      </PageHero>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center">
          <p className="font-semibold text-ink">Em construção</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
            No MVP, uma página por bem, gerada a partir dos projetos documentados na
            plataforma. Fase 1–2 — ver PRD §6.4.
          </p>
        </div>
      </div>
    </>
  );
}
