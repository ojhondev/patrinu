/** Taxonomia interna. Categorias (grupo → especialidade) em `./categories`. */

export {
  SPECIALTIES,
  CATEGORY_GROUPS,
  CATEGORY_GROUP_KEYS,
  specialtyLabel,
  groupOf,
  groupLabel,
  specialtiesInGroup,
  type SpecialtyKey,
  type CategoryGroup,
} from "./categories";

export const KINDS = {
  licitacao: "Licitação",
  edital: "Edital",
  chamamento: "Chamamento",
  credenciamento: "Credenciamento",
  bolsa: "Bolsa",
  residencia: "Residência",
  vaga: "Vaga",
  parceria: "Parceria",
  patrocinio: "Patrocínio",
} as const;

export type KindKey = keyof typeof KINDS;

/* ---------------- vagas ---------------- */

export const CONTRACT_TYPES = {
  clt: "CLT",
  pj: "PJ / autônomo",
  obra: "Por obra / projeto",
  temporario: "Temporário",
  estagio: "Estágio",
} as const;
export type ContractTypeKey = keyof typeof CONTRACT_TYPES;
export const contractTypeLabel = (k: string) =>
  CONTRACT_TYPES[k as ContractTypeKey] ?? k;

export const SENIORITY = {
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
} as const;
export type SeniorityKey = keyof typeof SENIORITY;
export const seniorityLabel = (k: string) => SENIORITY[k as SeniorityKey] ?? k;

export const WORK_MODES = {
  presencial: "Presencial",
  hibrido: "Híbrido",
  remoto: "Remoto",
} as const;
export type WorkModeKey = keyof typeof WORK_MODES;
export const workModeLabel = (k: string) => WORK_MODES[k as WorkModeKey] ?? k;

const BRL_COMPACT = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** "R$ 4.500 – R$ 6.000" · "A partir de R$ 4.500" · null quando confidencial ou vazio. */
export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  confidential?: boolean,
): string | null {
  if (confidential) return null;
  const lo = min && min > 0 ? min : null;
  const hi = max && max > 0 ? max : null;
  if (lo && hi) return lo === hi
    ? BRL_COMPACT.format(lo)
    : `${BRL_COMPACT.format(lo)} – ${BRL_COMPACT.format(hi)}`;
  if (lo) return `A partir de ${BRL_COMPACT.format(lo)}`;
  if (hi) return `Até ${BRL_COMPACT.format(hi)}`;
  return null;
}

export const ORGAN_SCOPES = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
  privado: "Privado",
  internacional: "Internacional",
} as const;

export type OrganScopeKey = keyof typeof ORGAN_SCOPES;

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type UF = (typeof UFS)[number];

/** Polos de patrimônio priorizados para a curadoria de oferta. */
export const HERITAGE_HUBS: UF[] = ["MG", "BA", "PE", "RJ", "SP", "RS"];

export function kindLabel(key: string): string {
  return KINDS[key as KindKey] ?? key;
}

export function scopeLabel(key: string): string {
  return ORGAN_SCOPES[key as OrganScopeKey] ?? key;
}

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatBRL(value: number | null | undefined): string {
  if (value == null) return "Valor não informado";
  return BRL.format(value);
}

const DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return DATE.format(typeof value === "string" ? new Date(value) : value);
}

/** Dias até o prazo. Negativo = encerrado. */
export function daysUntil(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const target = typeof value === "string" ? new Date(value) : value;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

/* ---------------- rótulos dos pilares novos ---------------- */

const PROJECT_STATUS: Record<string, string> = {
  vitrine: "Vitrine",
  concluido: "Concluído",
  em_execucao: "Em execução",
  aberto: "Projeto aberto",
  em_captacao: "Em captação",
};
export const projectStatusLabel = (k: string) => PROJECT_STATUS[k] ?? k;

const ARTICLE_CATEGORY: Record<string, string> = {
  obra: "Obra",
  tecnica: "Técnica",
  politica: "Política",
  mercado: "Mercado",
  curso: "Formação",
  edital: "Edital",
};
export const articleCategoryLabel = (k: string) => ARTICLE_CATEGORY[k] ?? k;

const COURSE_FORMAT: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
};
export const courseFormatLabel = (k: string) => COURSE_FORMAT[k] ?? k;

const COURSE_LEVEL: Record<string, string> = {
  introducao: "Introdução",
  tecnico: "Técnico",
  especializacao: "Especialização",
  pos_graduacao: "Graduação / Pós",
};
export const courseLevelLabel = (k: string) => COURSE_LEVEL[k] ?? k;

const FUNDING_KIND: Record<string, string> = {
  lei_incentivo: "Lei de incentivo",
  edital_banco: "Edital de banco/estatal",
  fundo_internacional: "Fundo internacional",
  fundo_estadual: "Fundo estadual",
};
export const fundingKindLabel = (k: string) => FUNDING_KIND[k] ?? k;
