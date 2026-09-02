import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { creditLedger } from "@/db/schema";

/** conta grátis: 3 ações Pro por mês (publicar projeto/vaga, candidatar-se). */
export const FREE_MONTHLY = 3;

export type CreditAction = "publicar_projeto" | "publicar_vaga" | "candidatura";

function startOfMonth(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export async function creditsUsedThisMonth(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(creditLedger)
    .where(and(eq(creditLedger.userId, userId), gte(creditLedger.createdAt, startOfMonth())));
  return row?.n ?? 0;
}

export type CreditStatus = {
  pro: boolean;
  used: number;
  limit: number;
  remaining: number;
};

export async function creditStatus(userId: string, isPro: boolean): Promise<CreditStatus> {
  if (isPro) return { pro: true, used: 0, limit: Infinity, remaining: Infinity };
  const used = await creditsUsedThisMonth(userId);
  return { pro: false, used, limit: FREE_MONTHLY, remaining: Math.max(0, FREE_MONTHLY - used) };
}

/**
 * Consome 1 crédito de uma ação Pro. Pro = sempre ok (não registra).
 * Free = registra no ledger se ainda tiver crédito.
 */
export async function spendCredit(
  userId: string,
  isPro: boolean,
  action: CreditAction,
  refId?: string,
): Promise<{ ok: true; ledgerId?: string } | { ok: false; used: number }> {
  if (isPro) return { ok: true };
  const used = await creditsUsedThisMonth(userId);
  if (used >= FREE_MONTHLY) return { ok: false, used };
  const [row] = await db
    .insert(creditLedger)
    .values({ userId, action, refId: refId ?? null })
    .returning({ id: creditLedger.id });
  return { ok: true, ledgerId: row?.id };
}

/** Vincula um lançamento do ledger ao id do recurso criado (p/ estorno depois). */
export async function setCreditRef(ledgerId: string, refId: string): Promise<void> {
  await db.update(creditLedger).set({ refId }).where(eq(creditLedger.id, ledgerId));
}

/** Devolve o crédito gasto numa ação (ex.: o usuário excluiu a publicação). */
export async function refundCredit(userId: string, refId: string): Promise<void> {
  await db
    .delete(creditLedger)
    .where(and(eq(creditLedger.userId, userId), eq(creditLedger.refId, refId)));
}

export const NO_CREDITS_MSG =
  `Você usou os ${FREE_MONTHLY} créditos grátis do mês. ` +
  `Assine o Patrinu Pro para publicar e se candidatar sem limite.`;
