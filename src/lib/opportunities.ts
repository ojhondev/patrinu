import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { opportunities, sources } from "@/db/schema";
import type { Opportunity, OpportunityFilters } from "./types";
import type { KindKey, OrganScopeKey, SpecialtyKey } from "./taxonomy";
import { specialtiesInGroup } from "./categories";

/**
 * Camada de acesso ao Radar de Editais — agora do banco.
 * Só mostra oportunidades com `review_status = 'aprovado'` (aprovadas pelo Master).
 */

type Row = typeof opportunities.$inferSelect;
type Src = typeof sources.$inferSelect;

function rowToOpportunity(r: Row, s: Src | null): Opportunity {
  return {
    id: r.id,
    source: {
      slug: s?.slug ?? "manual",
      name: s?.name ?? "Cadastro manual",
      tier: s?.tier ?? 0,
      access: (s?.access ?? "api") as "api" | "scraping" | "monitorar",
    },
    externalId: r.externalId,
    url: r.url,
    kind: r.kind as KindKey,
    status: r.status as Opportunity["status"],
    title: r.title,
    summary: r.summary ?? "",
    object: r.object ?? r.summary ?? "",
    organ: r.organ,
    organScope: r.organScope as OrganScopeKey,
    uf: r.uf,
    city: r.city,
    estimatedValue: r.estimatedValue != null ? Number(r.estimatedValue) : null,
    specialties: (r.specialties ?? []) as SpecialtyKey[],
    techniques: r.techniques ?? [],
    habilitacao: r.habilitacao ?? [],
    publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
    deadlineAt: r.deadlineAt ? r.deadlineAt.toISOString() : null,
    outcome: r.outcome ?? null,
    relevanceScore: r.relevanceScore ?? 0.6,
  };
}

async function query(where: ReturnType<typeof and> | undefined) {
  const rows = await db
    .select({ o: opportunities, s: sources })
    .from(opportunities)
    .leftJoin(sources, eq(sources.id, opportunities.sourceId))
    .where(and(eq(opportunities.reviewStatus, "aprovado"), where))
    .orderBy(desc(opportunities.publishedAt), desc(opportunities.createdAt));
  return rows.map((r) => rowToOpportunity(r.o, r.s));
}

function localFilter(list: Opportunity[], f: OpportunityFilters): Opportunity[] {
  return list.filter((op) => {
    if (f.q) {
      const hay =
        `${op.title} ${op.summary} ${op.object} ${op.organ} ${op.city ?? ""}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    if (f.specialty && !op.specialties.includes(f.specialty)) return false;
    if (f.grupo) {
      const keys = specialtiesInGroup(f.grupo);
      if (!op.specialties.some((s) => keys.includes(s))) return false;
    }
    if (f.uf && op.uf !== f.uf) return false;
    if (f.kind && op.kind !== f.kind) return false;
    if (f.scope && op.organScope !== f.scope) return false;
    if (f.status && op.status !== f.status) return false;
    if (f.minValue != null && (op.estimatedValue ?? 0) < f.minValue) return false;
    return true;
  });
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
  recentes: (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
};

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  const all = await query(undefined);
  const sorter = SORTERS[filters.sort ?? "prazo"] ?? SORTERS.prazo;
  return localFilter(all, filters).sort(sorter);
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  const [row] = await db
    .select({ o: opportunities, s: sources })
    .from(opportunities)
    .leftJoin(sources, eq(sources.id, opportunities.sourceId))
    .where(eq(opportunities.id, id))
    .limit(1);
  return row ? rowToOpportunity(row.o, row.s) : null;
}

export async function relatedOpportunities(
  op: Opportunity,
  limit = 4,
): Promise<Opportunity[]> {
  const all = await query(undefined);
  return all
    .filter(
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
  const all = await query(undefined);
  const abertas = all.filter((o) => o.status === "aberta");
  return {
    abertas: abertas.length,
    fontes: new Set(all.map((o) => o.source.slug)).size,
    ufs: new Set(all.map((o) => o.uf).filter(Boolean)).size,
    valorAberto: abertas.reduce((sum, o) => sum + (o.estimatedValue ?? 0), 0),
  };
}

export async function featuredOpportunities(limit = 8): Promise<Opportunity[]> {
  const all = await query(undefined);
  return all
    .filter((o) => o.status === "aberta")
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

/* ---------------- fila de moderação (Master) ---------------- */

export async function pendingOpportunities() {
  return db
    .select({ o: opportunities, s: sources })
    .from(opportunities)
    .leftJoin(sources, eq(sources.id, opportunities.sourceId))
    .where(eq(opportunities.reviewStatus, "pendente"))
    .orderBy(desc(opportunities.relevanceScore), desc(opportunities.createdAt));
}

export async function reviewOpportunity(
  id: string,
  decision: "aprovado" | "recusado",
  patch?: { title?: string; summary?: string; specialties?: string[] },
) {
  await db
    .update(opportunities)
    .set({
      reviewStatus: decision,
      ...(patch?.title ? { title: patch.title } : {}),
      ...(patch?.summary ? { summary: patch.summary } : {}),
      ...(patch?.specialties ? { specialties: patch.specialties } : {}),
      updatedAt: new Date(),
    })
    .where(eq(opportunities.id, id));
}
