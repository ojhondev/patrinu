import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { users, pendingProGrants } from "@/db/schema";
import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

/** valor mensal (R$) → trilha, para casar o pagamento avulso à trilha certa. */
export function trackFromAmount(amount: number | null | undefined): ProTrack | null {
  if (amount == null) return null;
  const cents = Math.round(amount * 100);
  for (const key of Object.keys(TRACKS) as ProTrack[]) {
    if (TRACKS[key].priceCents === cents) return key;
  }
  // tolera pequenas variações (juros, arredondamento)
  for (const key of Object.keys(TRACKS) as ProTrack[]) {
    const p = TRACKS[key].priceCents;
    if (p != null && Math.abs(p - cents) <= 200) return key;
  }
  return null;
}

const norm = (e: string) => e.trim().toLowerCase();

/**
 * Libera o Pro para o e-mail. Se já existe conta, atualiza; se não, deixa
 * pendente para aplicar no primeiro login/cadastro com esse e-mail.
 * Retorna o id do usuário liberado, ou null (ficou pendente).
 */
export async function grantProByEmail(input: {
  email: string;
  track?: ProTrack | null;
  mpRef?: string | null;
}): Promise<string | null> {
  const email = norm(input.email);
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (user) {
    await db
      .update(users)
      .set({
        plan: "pro",
        planSource: "paid",
        proGrantedAt: new Date(),
        proNote: null,
        mpRef: input.mpRef ?? null,
        ...(input.track ? { track: input.track } : {}),
      })
      .where(eq(users.id, user.id));
    return user.id;
  }

  await db
    .insert(pendingProGrants)
    .values({ email, track: input.track ?? null, mpRef: input.mpRef ?? null })
    .onConflictDoUpdate({
      target: pendingProGrants.email,
      set: { track: input.track ?? null, mpRef: input.mpRef ?? null, createdAt: new Date() },
    });
  return null;
}

/** Assinatura cancelada/estornada no MP → volta o usuário liberado por esse ref para "cadastrado". */
export async function revokeProByMpRef(mpRef: string): Promise<void> {
  await db
    .update(users)
    .set({ plan: "cadastrado", planSource: "paid", proGrantedAt: null, mpRef: null })
    .where(sql`${users.mpRef} = ${mpRef} and ${users.plan} = 'pro' and ${users.planSource} = 'paid'`);
  await db.delete(pendingProGrants).where(eq(pendingProGrants.mpRef, mpRef));
}

/**
 * Aplica um "Pro pendente" quando o usuário aparece (login ou cadastro).
 * Chamar logo depois de autenticar.
 */
export async function applyPendingGrant(userId: string, email: string): Promise<void> {
  const e = norm(email);
  const [pending] = await db
    .select()
    .from(pendingProGrants)
    .where(eq(pendingProGrants.email, e))
    .limit(1);
  if (!pending) return;

  await db
    .update(users)
    .set({
      plan: "pro",
      planSource: "paid",
      proGrantedAt: new Date(),
      mpRef: pending.mpRef ?? null,
      ...(pending.track ? { track: pending.track } : {}),
    })
    .where(eq(users.id, userId));
  await db.delete(pendingProGrants).where(eq(pendingProGrants.email, e));
}
