import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.mercadopago.com";

export function mpConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

/** Chamada autenticada à API do Mercado Pago. */
export async function mpGet<T = unknown>(path: string): Promise<T | null> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    console.error(`[mp] GET ${path} → ${res.status}`);
    return null;
  }
  return (await res.json()) as T;
}

/**
 * Valida a assinatura da notificação (header `x-signature`).
 * Algoritmo oficial: manifesto `id:<dataId>;request-id:<x-request-id>;ts:<ts>;`
 * assinado com HMAC-SHA256 e a chave secreta do webhook.
 * Sem `MERCADOPAGO_WEBHOOK_SECRET` configurado, retorna false (recusa tudo).
 */
export function verifyWebhookSignature(
  headers: Headers,
  dataId: string | null,
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return false;

  const sigHeader = headers.get("x-signature") ?? "";
  const requestId = headers.get("x-request-id") ?? "";
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => {
      const [k, ...v] = p.split("=");
      return [k.trim(), v.join("=").trim()];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const id = dataId ? (/^\d+$/.test(dataId) ? dataId : dataId.toLowerCase()) : "";
  const manifest = `id:${id};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ---- formas dos objetos que consumimos ---- */

export type MpPayment = {
  id: number;
  status: string; // approved | pending | rejected | refunded | cancelled | ...
  transaction_amount: number;
  external_reference?: string | null;
  payer?: { email?: string | null };
  metadata?: Record<string, unknown>;
};

export type MpPreapproval = {
  id: string;
  status: string; // authorized | paused | cancelled | pending
  payer_email?: string | null;
  external_reference?: string | null;
  auto_recurring?: { transaction_amount?: number };
  reason?: string;
};
