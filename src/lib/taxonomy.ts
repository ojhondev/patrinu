/** Taxonomia interna do Radar. Usada na classificação e no match perfil ↔ oportunidade. */

export const SPECIALTIES = {
  bens_moveis: "Bens móveis",
  bens_integrados: "Bens integrados",
  arquitetura: "Arquitetura e restauro de edificações",
  arqueologia: "Arqueologia",
  acervo: "Acervos e conservação preventiva",
  paisagismo: "Jardins e paisagismo histórico",
  urbanismo: "Sítios urbanos e paisagem urbana",
  imaterial: "Patrimônio imaterial",
  documental: "Acervo documental e bibliográfico",
} as const;

export type SpecialtyKey = keyof typeof SPECIALTIES;

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

/** Polos de patrimônio priorizados para a curadoria de oferta — ver PRD §04. */
export const HERITAGE_HUBS: UF[] = ["MG", "BA", "PE", "RJ", "SP", "RS"];

export function specialtyLabel(key: string): string {
  return SPECIALTIES[key as SpecialtyKey] ?? key;
}

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
