import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Profissionais" };

export default function ProfissionaisPage() {
  return (
    <>
      <PageHero eyebrow="Reputação com evidência" title="Diretório de profissionais">
        Perfil e portfólio com imagens de antes, durante e depois; ficha por projeto
        (bem, técnica, materiais, ano, papel); selo de perfil verificado.
      </PageHero>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center">
          <p className="font-semibold text-ink">Em construção</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
            O diretório é a matéria-prima do <em>match</em> do Radar e a reputação exibida
            no Marketplace. Próximo no MVP — ver PRD §6.3.
          </p>
        </div>
      </div>
    </>
  );
}
