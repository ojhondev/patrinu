import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, mpEvents } from "@/db/schema";
import {
  mpConfigured,
  mpGet,
  verifyWebhookSignature,
  type MpPayment,
  type MpPreapproval,
} from "@/lib/mercadopago";
import {
  grantProByEmail,
  revokeProByMpRef,
  trackFromAmount,
  applyPendingGrant,
} from "@/lib/billing";
import type { ProTrack } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIVE = new Set(["approved", "authorized", "accredited"]);
const DEAD = new Set(["cancelled", "refunded", "charged_back", "paused", "rejected"]);

/** MP às vezes valida a URL com um GET. Serve também de diagnóstico. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: mpConfigured(),
    hasAccessToken: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
    hasWebhookSecret: Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET),
  });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    /* algumas notificações vêm sem corpo, só query */
  }

  // tipo/tópico e id do recurso — nos dois formatos que o MP usa
  const type =
    (body.type as string) ||
    (body.topic as string) ||
    url.searchParams.get("type") ||
    url.searchParams.get("topic") ||
    "";
  const data = (body.data as { id?: string } | undefined) ?? {};
  const dataId =
    data.id ||
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    (body.id != null ? String(body.id) : null);
  const action = (body.action as string) ?? null;

  if (!verifyWebhookSignature(req.headers, dataId)) {
    const reason = !process.env.MERCADOPAGO_WEBHOOK_SECRET
      ? "MERCADOPAGO_WEBHOOK_SECRET não configurado nas variáveis de ambiente"
      : !req.headers.get("x-signature")
        ? "requisição sem header x-signature"
        : "assinatura x-signature não confere com a chave secreta";
    console.warn("[mp webhook] 401:", reason);
    return NextResponse.json({ error: "assinatura inválida", reason }, { status: 401 });
  }

  const log = async (extra: {
    status?: string | null;
    payerEmail?: string | null;
    amount?: number | null;
    grantedUserId?: string | null;
  }) => {
    await db
      .insert(mpEvents)
      .values({
        mpId: dataId ?? "—",
        topic: type || "—",
        action,
        status: extra.status ?? null,
        payerEmail: extra.payerEmail ?? null,
        amount: extra.amount != null ? String(extra.amount) : null,
        grantedUserId: extra.grantedUserId ?? null,
        payload: body,
      })
      .catch((e) => console.error("[mp webhook] log:", e));
  };

  try {
    if (!dataId) {
      await log({});
      return NextResponse.json({ ok: true, note: "sem id" });
    }

    // ---- pagamento avulso (Link de Pagamento) ----
    if (type === "payment") {
      const p = await mpGet<MpPayment>(`/v1/payments/${dataId}`);
      if (!p) {
        await log({ status: "lookup_failed" });
        return NextResponse.json({ ok: true });
      }
      const email = p.payer?.email ?? null;
      const amount = p.transaction_amount ?? null;
      const ref = String(p.id);

      if (ACTIVE.has(p.status)) {
        const uid = await resolveAndGrant(p.external_reference, email, trackFromAmount(amount), ref);
        await log({ status: p.status, payerEmail: email, amount, grantedUserId: uid });
      } else if (DEAD.has(p.status)) {
        await revokeProByMpRef(ref);
        await log({ status: p.status, payerEmail: email, amount });
      } else {
        await log({ status: p.status, payerEmail: email, amount });
      }
      return NextResponse.json({ ok: true });
    }

    // ---- assinatura (preapproval) ----
    if (type === "subscription_preapproval" || type === "preapproval") {
      const s = await mpGet<MpPreapproval>(`/preapproval/${dataId}`);
      if (!s) {
        await log({ status: "lookup_failed" });
        return NextResponse.json({ ok: true });
      }
      const email = s.payer_email ?? null;
      const amount = s.auto_recurring?.transaction_amount ?? null;
      const ref = String(s.id);

      if (ACTIVE.has(s.status)) {
        const uid = await resolveAndGrant(s.external_reference, email, trackFromAmount(amount), ref);
        await log({ status: s.status, payerEmail: email, amount, grantedUserId: uid });
      } else if (DEAD.has(s.status)) {
        await revokeProByMpRef(ref);
        await log({ status: s.status, payerEmail: email, amount });
      } else {
        await log({ status: s.status, payerEmail: email, amount });
      }
      return NextResponse.json({ ok: true });
    }

    // ---- cobrança recorrente da assinatura ----
    if (type === "subscription_authorized_payment") {
      const ap = await mpGet<{
        id: number;
        status: string;
        preapproval_id?: string;
        transaction_amount?: number;
      }>(`/authorized_payments/${dataId}`);
      if (!ap) {
        await log({ status: "lookup_failed" });
        return NextResponse.json({ ok: true });
      }
      let email: string | null = null;
      let amount = ap.transaction_amount ?? null;
      const ref = ap.preapproval_id ? String(ap.preapproval_id) : String(ap.id);
      if (ap.preapproval_id) {
        const s = await mpGet<MpPreapproval>(`/preapproval/${ap.preapproval_id}`);
        email = s?.payer_email ?? null;
        amount = amount ?? s?.auto_recurring?.transaction_amount ?? null;
      }
      if (ACTIVE.has(ap.status) && email) {
        const uid = await resolveAndGrant(null, email, trackFromAmount(amount), ref);
        await log({ status: ap.status, payerEmail: email, amount, grantedUserId: uid });
      } else {
        await log({ status: ap.status, payerEmail: email, amount });
      }
      return NextResponse.json({ ok: true });
    }

    await log({});
    return NextResponse.json({ ok: true, note: `tipo não tratado: ${type}` });
  } catch (err) {
    console.error("[mp webhook]", err);
    // 200 mesmo em erro interno: evita o MP re-tentar em loop; o log fica salvo.
    await log({ status: "erro" });
    return NextResponse.json({ ok: false });
  }
}

async function resolveAndGrant(
  externalRef: string | null | undefined,
  email: string | null,
  track: ProTrack | null,
  mpRef: string,
): Promise<string | null> {
  // 1) external_reference = id de usuário (checkout dinâmico no futuro)
  if (externalRef && UUID.test(externalRef)) {
    const [u] = await db.select().from(users).where(eq(users.id, externalRef)).limit(1);
    if (u) {
      await db
        .update(users)
        .set({
          plan: "pro",
          planSource: "paid",
          proGrantedAt: new Date(),
          proNote: null,
          mpRef,
          ...(track ? { track } : {}),
        })
        .where(eq(users.id, u.id));
      await applyPendingGrant(u.id, u.email); // limpa eventual pendência duplicada
      return u.id;
    }
  }
  // 2) casa pelo e-mail do pagador
  if (email) return grantProByEmail({ email, track, mpRef });
  return null;
}
