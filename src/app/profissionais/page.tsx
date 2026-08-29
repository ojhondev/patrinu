import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profissionais" };

export default function ProfissionaisPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Diretório de profissionais</h1>
      <p className="mt-3 text-ink-soft leading-relaxed">
        Perfil e portfólio com imagens de antes, durante e depois; ficha por projeto (bem,
        técnica, materiais, ano, papel); selo de perfil verificado. É a matéria-prima do{" "}
        <em>match</em> do Radar e a reputação exibida no Marketplace.
      </p>
      <p className="mt-4 font-mono text-xs text-muted">
        Próximo no MVP — ver PRD §6.3.
      </p>
    </main>
  );
}
