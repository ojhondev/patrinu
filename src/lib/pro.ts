import type { ProTrack } from "./types";
import { MOCK_PROSPECTS, MOCK_COMPATIBLE, MOCK_ELIGIBILITY } from "./mock/pro";
import { getProfessional } from "./directory";

/** Trilhas do Patrinu Pro — ver PRD v5 §08. */
export const TRACKS: Record<
  ProTrack,
  {
    slug: ProTrack;
    label: string;
    who: string;
    promise: string;
    perfil: "contratante" | "profissional" | "financiamento";
  }
> = {
  contratar: {
    slug: "contratar",
    label: "Quero contratar",
    who: "Instituições, empresas, órgãos e dioceses com patrimônio para restaurar",
    promise: "Encontre quem executa. Publique seu projeto.",
    perfil: "contratante",
  },
  oferecer: {
    slug: "oferecer",
    label: "Quero oferecer serviços",
    who: "Restauradores, conservadores, ateliês e escritórios",
    promise: "Seu portfólio, sua reputação e o trabalho do setor num lugar.",
    perfil: "profissional",
  },
  financiamento: {
    slug: "financiamento",
    label: "Quero financiamento de obra",
    who: "Detentores do bem com projeto aprovado ou em elaboração",
    promise: "Conecte o projeto ao recurso. Dossiê pronto, elegibilidade sinalizada.",
    perfil: "financiamento",
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
