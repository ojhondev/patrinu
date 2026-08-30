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

export type OpportunitySort = "prazo" | "valor" | "aderencia" | "recentes";

/* ------------------------------------------------------------------ */
/* Projetos — o objeto central (ver PRD v4 §03)                        */
/* ------------------------------------------------------------------ */

export type ProjectStatus =
  | "vitrine" // obra concluída, publicada como referência
  | "aberto" // brief buscando profissionais
  | "em_captacao" // buscando recurso
  | "em_execucao"
  | "concluido";

export type ProjectCredit = {
  role: string;
  name: string;
  slug?: string; // link para o perfil, quando houver
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;

  assetName: string; // bem
  assetSlug?: string; // Passaporte
  uf: string;
  city: string;
  year?: number;

  specialties: SpecialtyKey[];
  techniques: string[];
  materials?: string[];

  credits: ProjectCredit[];
  fromOpportunityId?: string;

  // modo brief
  budgetRange?: string;
  deadlineAt?: string | null;
  requirements?: string[];

  publishedAt: string;
  featured?: boolean;
};

/* ------------------------------------------------------------------ */
/* Profissionais                                                       */
/* ------------------------------------------------------------------ */

export type Professional = {
  slug: string;
  displayName: string;
  headline: string;
  bio: string;
  uf: string;
  city: string;
  specialties: SpecialtyKey[];
  techniques: string[];
  verified: boolean;
  verificationLevel: "email" | "registro" | "projeto_documentado" | "completo";
  plan: "free" | "pro";
  memberSince: string;
  registros: string[];
  projectSlugs: string[];
  responseHours?: number;
  score?: number;
};

/* ------------------------------------------------------------------ */
/* Notícias                                                            */
/* ------------------------------------------------------------------ */

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: "obra" | "tecnica" | "politica" | "mercado" | "curso" | "edital";
  author: string;
  publishedAt: string;
  readingMinutes: number;
  source?: { name: string; url: string }; // quando é curadoria de link externo
  featured?: boolean;
};

/* ------------------------------------------------------------------ */
/* Cursos                                                              */
/* ------------------------------------------------------------------ */

export type Course = {
  slug: string;
  title: string;
  provider: string;
  summary: string;
  format: "presencial" | "online" | "hibrido";
  level: "introducao" | "tecnico" | "especializacao" | "pos_graduacao";
  hours?: number;
  uf?: string;
  city?: string;
  nextClass?: string;
  price?: string;
  proDiscount?: boolean;
  specialties: SpecialtyKey[];
  url: string;
};

/* ------------------------------------------------------------------ */
/* Financiamento                                                       */
/* ------------------------------------------------------------------ */

export type FundingSource = {
  slug: string;
  name: string;
  kind: "lei_incentivo" | "edital_banco" | "fundo_internacional" | "fundo_estadual";
  scope: "federal" | "estadual" | "internacional";
  summary: string;
  fitFor: string[]; // tipos de projeto com aderência
  ticket?: string;
  cycle?: string; // periodicidade
  url: string;
};

export type OpportunityFilters = {
  q?: string;
  specialty?: SpecialtyKey;
  uf?: string;
  kind?: KindKey;
  scope?: OrganScopeKey;
  minValue?: number;
  status?: Opportunity["status"];
  sort?: OpportunitySort;
};
