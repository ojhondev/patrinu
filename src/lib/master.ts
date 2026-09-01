import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  articles,
  financingRequests,
  opportunities,
  professionals,
  projects,
  users,
} from "@/db/schema";
import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

/* ---------------- visão geral ---------------- */

async function count(q: Promise<{ n: number }[]>): Promise<number> {
  return (await q)[0]?.n ?? 0;
}

const N = sql<number>`count(*)::int`;
/** contas de demonstração não contam em métricas reais */
const REAL = sql`${users.email} not like '%@seed.patrinu.local'`;
const MEMBER = and(eq(users.plan, "pro"), REAL);

export async function masterOverview() {
  const [
    totalUsers,
    members,
    prosTotal,
    prosVerified,
    projPublished,
    projPending,
    edPending,
    noPending,
    finNew,
    banned,
  ] = await Promise.all([
    count(db.select({ n: N }).from(users).where(REAL)),
    count(db.select({ n: N }).from(users).where(MEMBER)),
    count(db.select({ n: N }).from(professionals)),
    count(db.select({ n: N }).from(professionals).where(eq(professionals.verified, true))),
    count(
      db
        .select({ n: N })
        .from(projects)
        .where(sql`${projects.status} in ('vitrine','aberto','em_captacao','em_execucao','concluido')`),
    ),
    count(db.select({ n: N }).from(projects).where(eq(projects.status, "em_analise"))),
    count(db.select({ n: N }).from(opportunities).where(eq(opportunities.reviewStatus, "pendente"))),
    count(db.select({ n: N }).from(articles).where(eq(articles.reviewStatus, "pendente"))),
    count(db.select({ n: N }).from(financingRequests).where(eq(financingRequests.status, "novo"))),
    count(db.select({ n: N }).from(users).where(sql`${users.bannedAt} is not null`)),
  ]);

  const { mrrCents, breakdown } = await mrr();

  return {
    totalUsers,
    members,
    prosTotal,
    prosVerified,
    projPublished,
    banned,
    mrrCents,
    breakdown,
    queue: {
      projetos: projPending,
      editais: edPending,
      noticias: noPending,
      financiamento: finNew,
      total: projPending + edPending + noPending + finNew,
    },
  };
}

/* ---------------- financeiro (estimado — sem gateway ainda) ---------------- */

function priceCentsFor(track: string | null): number {
  const t = TRACKS[track as ProTrack];
  return t?.priceCents ?? 3990; // fallback: plano base
}

export async function mrr() {
  const rows = await db
    .select({ track: users.track, n: N })
    .from(users)
    .where(MEMBER)
    .groupBy(users.track);

  let mrrCents = 0;
  const breakdown = rows.map((r) => {
    const unit = priceCentsFor(r.track);
    mrrCents += unit * r.n;
    return {
      track: r.track ?? "—",
      label: TRACKS[r.track as ProTrack]?.label ?? "Sem trilha",
      members: r.n,
      unitCents: unit,
      totalCents: unit * r.n,
    };
  });
  return { mrrCents, breakdown };
}

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  track: string | null;
  priceCents: number;
  since: Date;
};

export async function listMembers(): Promise<MemberRow[]> {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      track: users.track,
      since: users.createdAt,
    })
    .from(users)
    .where(MEMBER)
    .orderBy(desc(users.createdAt));
  return rows.map((r) => ({ ...r, priceCents: priceCentsFor(r.track) }));
}

/* ---------------- contas ---------------- */

export type AccountRow = {
  id: string;
  name: string;
  email: string;
  plan: "visitante" | "cadastrado" | "pro";
  track: string | null;
  proSlug: string | null;
  bannedAt: Date | null;
  createdAt: Date;
};

export async function listAccounts(q?: string): Promise<AccountRow[]> {
  const term = q?.trim();
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.plan,
      track: users.track,
      proSlug: professionals.slug,
      bannedAt: users.bannedAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(professionals, eq(professionals.userId, users.id))
    .where(
      and(
        sql`${users.email} not like '%@seed.patrinu.local'`,
        term ? or(ilike(users.name, `%${term}%`), ilike(users.email, `%${term}%`)) : undefined,
      ),
    )
    .orderBy(desc(users.createdAt))
    .limit(200);
  return rows as AccountRow[];
}

/* ---------------- profissionais (moderação) ---------------- */

export type ProModRow = {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  headline: string | null;
  city: string | null;
  uf: string | null;
  email: string;
  verified: boolean;
  verificationLevel: string;
  score: number | null;
  bannedAt: Date | null;
  createdAt: Date;
};

export async function listProsForMod(q?: string): Promise<ProModRow[]> {
  const term = q?.trim();
  const rows = await db
    .select({
      id: professionals.id,
      userId: professionals.userId,
      slug: professionals.slug,
      displayName: professionals.displayName,
      headline: professionals.headline,
      city: professionals.city,
      uf: professionals.uf,
      email: users.email,
      verified: professionals.verified,
      verificationLevel: professionals.verificationLevel,
      score: professionals.score,
      bannedAt: users.bannedAt,
      createdAt: professionals.createdAt,
    })
    .from(professionals)
    .innerJoin(users, eq(users.id, professionals.userId))
    .where(
      term
        ? or(
            ilike(professionals.displayName, `%${term}%`),
            ilike(users.email, `%${term}%`),
            ilike(professionals.city, `%${term}%`),
          )
        : undefined,
    )
    .orderBy(desc(professionals.verified), desc(professionals.createdAt))
    .limit(200);
  return rows as ProModRow[];
}

/* ---------------- ações de moderação ---------------- */

export const VERIF_LEVELS = [
  "nao_verificado",
  "email",
  "registro_profissional",
  "projeto_documentado",
  "completo",
] as const;
export type VerifLevel = (typeof VERIF_LEVELS)[number];

export async function setVerification(proId: string, level: VerifLevel) {
  await db
    .update(professionals)
    .set({ verificationLevel: level, verified: level === "completo" || level === "registro_profissional" || level === "projeto_documentado" })
    .where(eq(professionals.id, proId));
}

export async function deleteProfessional(proId: string) {
  await db.delete(professionals).where(eq(professionals.id, proId));
}

export async function banUser(userId: string, reason: string) {
  await db
    .update(users)
    .set({ bannedAt: new Date(), bannedReason: reason || "Violação dos termos." })
    .where(eq(users.id, userId));
}

export async function unbanUser(userId: string) {
  await db.update(users).set({ bannedAt: null, bannedReason: null }).where(eq(users.id, userId));
}

export async function deleteUser(userId: string) {
  // projects.ownerId é ON DELETE SET NULL; professionals/sessions são CASCADE
  await db.delete(users).where(eq(users.id, userId));
}

export async function setUserPlan(userId: string, plan: "cadastrado" | "pro") {
  await db.update(users).set({ plan }).where(eq(users.id, userId));
}
