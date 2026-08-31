import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

/* ================================================================== */
/*  Senhas                                                             */
/* ================================================================== */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/* ================================================================== */
/*  Sessão de usuário                                                  */
/* ================================================================== */

const USER_COOKIE = "patrinu_session";
const SESSION_DAYS = 30;

export type SessionUser = typeof users.$inferSelect;

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  track?: string;
}): Promise<SessionUser> {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
      plan: "cadastrado",
      track: input.track ?? null,
    })
    .returning();
  return user;
}

export async function getUserByEmail(email: string): Promise<SessionUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return user ?? null;
}

export async function startUserSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const [row] = await db.insert(sessions).values({ userId, expiresAt }).returning();
  const store = await cookies();
  store.set(USER_COOKIE, row.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endUserSession(): Promise<void> {
  const store = await cookies();
  const id = store.get(USER_COOKIE)?.value;
  if (id) {
    await db.delete(sessions).where(eq(sessions.id, id)).catch(() => {});
  }
  // sobrescreve com cookie expirado (mesmas opções do set) — mais confiável que delete()
  store.set(USER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  store.delete(USER_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const id = store.get(USER_COOKIE)?.value;
  if (!id) return null;
  const [row] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);
  if (!row || row.expiresAt.getTime() < Date.now()) return null;
  const [user] = await db.select().from(users).where(eq(users.id, row.userId)).limit(1);
  return user ?? null;
}

/* ================================================================== */
/*  Conta MASTER (única, por env)                                      */
/* ================================================================== */

const MASTER_COOKIE = "patrinu_master";

function secret() {
  return process.env.SESSION_SECRET ?? "dev-only-insecure-secret";
}

function masterToken(): string {
  return createHmac("sha256", secret()).update("master-session-v1").digest("base64url");
}

export function verifyMasterCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.MASTER_EMAIL;
  const stored = process.env.MASTER_PASSWORD_HASH;
  if (!expectedEmail || !stored) return false;
  if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) return false;
  return verifyPassword(password, stored);
}

export async function startMasterSession(): Promise<void> {
  const store = await cookies();
  store.set(MASTER_COOKIE, masterToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function endMasterSession(): Promise<void> {
  const store = await cookies();
  store.delete(MASTER_COOKIE);
}

export async function isMasterSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(MASTER_COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(masterToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
