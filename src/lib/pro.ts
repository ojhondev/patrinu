import type { ProTrack } from "./types";
import { MOCK_PROSPECTS, MOCK_COMPATIBLE, MOCK_ELIGIBILITY } from "./mock/pro";
import { getProfessional } from "./directory";

/** Trilhas do Patrinu Pro. */
export const TRACKS: Record<
  ProTrack,
  {
    slug: ProTrack;
    label: string;
    who: string;
    promise: string;
    perfil: "contratante" | "profissional" | "financiamento";
    /** preço mensal em centavos; null = trilha sem assinatura (vai por análise) */
    priceCents: number | null;
    priceLabel: string;
    /** link de checkout (Mercado Pago) — quando existe, o CTA vai direto pra ele */
    checkoutUrl?: string;
  }
> = {
  contratar: {
    slug: "contratar",
    label: "Sou empresa / contratante",
    who: "Empresas, instituições, órgãos e dioceses com patrimônio para restaurar",
    promise: "Mostre os projetos da sua empresa, contrate mão de obra especializada e acompanhe editais e licitações do Brasil.",
    perfil: "contratante",
    priceCents: 3990,
    priceLabel: "R$ 39,90/mês",
    checkoutUrl: "https://mpago.la/1sLtHDi",
  },
  oferecer: {
    slug: "oferecer",
    label: "Sou profissional",
    who: "Restauradores, conservadores, ateliês e escritórios",
    promise: "Arranje trabalho e publique seus projetos pra todo mundo ver.",
    perfil: "profissional",
    priceCents: 2990,
    priceLabel: "R$ 29,90/mês",
    checkoutUrl: "https://mpago.la/211MW6s",
  },
  financiamento: {
    slug: "financiamento",
    label: "Quero financiamento de obra",
    who: "Detentores do bem com projeto aprovado ou em elaboração",
    promise: "Conecte o projeto ao recurso. Dossiê pronto, elegibilidade sinalizada.",
    perfil: "financiamento",
    priceCents: null,
    priceLabel: "Sob análise",
  },
};

export const PERFIL_TO_TRACK: Record<string, ProTrack> = {
  contratante: "contratar",
  profissional: "oferecer",
  financiamento: "financiamento",
};

/* ---------------- painel — dados por perfil ---------------- */

export async function prospectsForContratante() {
  const withPro = await Promise.all(
    MOCK_PROSPECTS.map(async (p) => ({
      ...p,
      professional: await getProfessional(p.professionalSlug),
    })),
  );
  return withPro.sort((a, b) => b.fit - a.fit);
}

export async function compatibleForProfissional() {
  return [...MOCK_COMPATIBLE].sort((a, b) => b.fit - a.fit);
}

export async function eligibilityForFinanciamento() {
  const order = { elegivel: 0, aderencia_parcial: 1, em_analise: 2 } as const;
  return [...MOCK_ELIGIBILITY].sort((a, b) => order[a.status] - order[b.status]);
}
