import type { KindKey, OrganScopeKey, SpecialtyKey } from "./taxonomy";

export type HabilitacaoRequirement = {
  label: string;
  category: "juridica" | "tecnica" | "fiscal" | "economica" | "outra";
  detail?: string;
};

export type OpportunityOutcome = {
  winner?: string;
  winnerValue?: number;
  homologatedAt?: string;
};

export type OpportunitySource = {
  slug: string;
  name: string;
  tier: number;
  access: "api" | "scraping" | "monitorar";
};

export type Opportunity = {
  id: string;
  source: OpportunitySource;
  externalId: string;
  url: string | null;

  kind: KindKey;
  status: "aberta" | "encerrada" | "suspensa" | "homologada" | "fracassada" | "revogada";

  title: string;
  /** resumo em linguagem clara (mock imita a saída da IA) */
  summary: string;
  /** objeto original do edital */
  object: string;

  organ: string;
  organScope: OrganScopeKey;
  uf: string | null;
  city: string | null;

  estimatedValue: number | null;

  specialties: SpecialtyKey[];
  techniques: string[];

  habilitacao: HabilitacaoRequirement[];

  publishedAt: string;
  deadlineAt: string | null;

  outcome: OpportunityOutcome | null;

  /** 0..1 — classificação "isto é patrimônio?" */
  relevanceScore: number;
};

export type OpportunityFilters = {
  q?: string;
  specialty?: SpecialtyKey;
  uf?: string;
  kind?: KindKey;
  scope?: OrganScopeKey;
  minValue?: number;
  status?: Opportunity["status"];
};
