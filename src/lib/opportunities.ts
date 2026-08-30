import type { Opportunity, OpportunityFilters } from "./types";
import { MOCK_OPPORTUNITIES } from "./mock/opportunities";

/**
 * Camada de acesso a dados do Radar.
 *
 * Hoje lê o dataset mockado (formato idêntico à saída de ingestão + IA).
 * Quando o banco estiver provisionado, trocar o corpo destas funções por
 * consultas Drizzle (src/db) — a assinatura não muda. Ver PRD §04.
 */

function matches(op: Opportunity, f: OpportunityFilters): boolean {
  if (f.q) {
    const hay =
      `${op.title} ${op.summary} ${op.object} ${op.organ} ${op.city ?? ""} ${op.techniques.join(" ")}`.toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  if (f.specialty && !op.specialties.includes(f.specialty)) return false;
  if (f.uf && op.uf !== f.uf) return false;
  if (f.kind && op.kind !== f.kind) return false;
  if (f.scope && op.organScope !== f.scope) return false;
  if (f.status && op.status !== f.status) return false;
  if (f.minValue != null && (op.estimatedValue ?? 0) < f.minValue) return false;
  return true;
}

const SORTERS: Record<string, (a: Opportunity, b: Opportunity) => number> = {
  prazo: (a, b) => {
    const openBias = (o: Opportunity) => (o.status === "aberta" ? 0 : 1e15);
    const dl = (o: Opportunity) =>
      o.deadlineAt ? new Date(o.deadlineAt).getTime() : 8.64e15;
    return openBias(a) - openBias(b) || dl(a) - dl(b);
  },
  valor: (a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0),
  aderencia: (a, b) => b.relevanceScore - a.relevanceScore,
  recentes: (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
};

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  const sorter = SORTERS[filters.sort ?? "prazo"] ?? SORTERS.prazo;
  return MOCK_OPPORTUNITIES.filter((op) => matches(op, filters)).sort(sorter);
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  return MOCK_OPPORTUNITIES.find((op) => op.id === id) ?? null;
}

export async function relatedOpportunities(
  op: Opportunity,
  limit = 4,
): Promise<Opportunity[]> {
  return MOCK_OPPORTUNITIES.filter(
    (o) =>
      o.id !== op.id &&
      (o.specialties.some((s) => op.specialties.includes(s)) || o.uf === op.uf),
  )
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

export async function radarStats(): Promise<{
  abertas: number;
  fontes: number;
  ufs: number;
  valorAberto: number;
}> {
  const abertas = MOCK_OPPORTUNITIES.filter((o) => o.status === "aberta");
  return {
    abertas: abertas.length,
    fontes: new Set(MOCK_OPPORTUNITIES.map((o) => o.source.slug)).size,
    ufs: new Set(MOCK_OPPORTUNITIES.map((o) => o.uf).filter(Boolean)).size,
    valorAberto: abertas.reduce((sum, o) => sum + (o.estimatedValue ?? 0), 0),
  };
}

export async function featuredOpportunities(limit = 8): Promise<Opportunity[]> {
  return [...MOCK_OPPORTUNITIES]
    .filter((o) => o.status === "aberta")
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
