import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Autenticação mínima da conta MASTER. Enquanto não há sistema de contas de
 * usuário, o master é uma conta única, configurada por variáveis de ambiente:
 *
 *   MASTER_EMAIL          — e-mail do master
 *   MASTER_PASSWORD_HASH  — "salt:hash" (scrypt) da senha; NUNCA a senha em claro
 *   SESSION_SECRET        — segredo para assinar o cookie de sessão
 *
 * A senha em claro nunca entra no repositório.
 */

const COOKIE = "patrinu_master";

function secret() {
  return process.env.SESSION_SECRET ?? "dev-only-insecure-secret";
}

/** Gera o valor assinado do cookie de sessão do master. */
function sessionToken(): string {
  return createHmac("sha256", secret()).update("master-session-v1").digest("base64url");
}

export function verifyMasterCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.MASTER_EMAIL;
  const stored = process.env.MASTER_PASSWORD_HASH;
  if (!expectedEmail || !stored) return false;
  if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) return false;

  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function startMasterSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function endMasterSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isMasterSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (!value) return false;
  const expected = sessionToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
