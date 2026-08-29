import type { Metadata } from "next";

export const metadata: Metadata = { title: "Passaporte do Patrimônio" };

export default function PassaportePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Passaporte do Patrimônio</h1>
      <p className="mt-3 text-ink-soft leading-relaxed">
        Registro canônico e longitudinal de cada bem: intervenções, técnicas e materiais
        usados, profissionais responsáveis, laudos e evolução de estado ao longo do tempo.
        No MVP, uma página por bem, gerada a partir dos projetos documentados na plataforma.
      </p>
      <p className="mt-4 font-mono text-xs text-muted">
        Fase 1–2 — ver PRD §6.4. O dado mais defensável do negócio.
      </p>
    </main>
  );
}
