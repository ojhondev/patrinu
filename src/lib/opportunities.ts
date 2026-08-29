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
    const hay = `${op.title} ${op.summary} ${op.object} ${op.organ} ${op.city ?? ""} ${op.techniques.join(" ")}`.toLowerCase();
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

function sortKey(op: Opportunity): number {
  // Abertas primeiro, depois por prazo mais próximo; sem prazo vai ao fim.
  const openBias = op.status === "aberta" ? 0 : 1e15;
  const deadline = op.deadlineAt ? new Date(op.deadlineAt).getTime() : 8.64e15;
  return openBias + deadline;
}

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  return MOCK_OPPORTUNITIES.filter((op) => matches(op, filters)).sort(
    (a, b) => sortKey(a) - sortKey(b),
  );
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  return MOCK_OPPORTUNITIES.find((op) => op.id === id) ?? null;
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
