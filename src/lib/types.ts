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
/* Projetos — o objeto central */
/* ------------------------------------------------------------------ */

export type ProjectStatus =
  | "rascunho"
  | "em_analise" // aguardando aprovação do master
  | "recusado"
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
  uf: string;
  city: string;
  year?: number;

  specialties: SpecialtyKey[];
  techniques: string[];
  materials?: string[];
  images?: string[];
  videoUrl?: string;

  credits: ProjectCredit[];
  fromOpportunityId?: string;

  entryKind?: "projeto" | "vaga";

  // modo brief / vitrine
  budgetRange?: string;
  deadlineAt?: string | null;
  requirements?: string[];

  // modo vaga
  vagaRole?: string;
  contractType?: string;
  seniority?: string;
  workMode?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryConfidential?: boolean;
  /** contato do contratante — só exibido a membros Pro */
  contactWhatsapp?: string;
  contactEmail?: string;
  locationNote?: string;

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
  grupo?: string;
  uf?: string;
  kind?: KindKey;
  scope?: OrganScopeKey;
  minValue?: number;
  status?: Opportunity["status"];
  sort?: OpportunitySort;
};

/* ------------------------------------------------------------------ */
/* Patrinu Pro — trilhas e painel */
/* ------------------------------------------------------------------ */

export type ProTrack = "contratar" | "oferecer" | "financiamento";

/** Painel do contratante: profissional que deu match / se candidatou. */
export type Prospect = {
  professionalSlug: string;
  projectSlug: string;
  projectTitle: string;
  status: "match" | "candidatou" | "convidado" | "em_conversa";
  fit: number; // 0..1 aderência ao projeto
  reason: string;
};

/** Painel do profissional: oportunidade que casa com o perfil. */
export type CompatibleOpportunity = {
  kind: "edital" | "brief";
  id: string;
  title: string;
  organ: string;
  uf: string;
  value: string;
  deadlineAt: string | null;
  fit: number;
  reason: string;
};

/** Painel do financiamento: investidor que sinaliza elegibilidade por projeto. */
export type EligibilitySignal = {
  investor: string;
  investorKind: "banco" | "instituto" | "estatal" | "lei_incentivo" | "fundo";
  projectSlug: string;
  projectTitle: string;
  status: "elegivel" | "em_analise" | "aderencia_parcial";
  reason: string;
  nextStep: string;
};
