"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createUser,
  endMasterSession,
  endUserSession,
  getUserByEmail,
  startUserSession,
  verifyPassword,
} from "@/lib/auth";
import { applyPendingGrant } from "@/lib/billing";
import { sendEmail, welcomeEmail } from "@/lib/email";

type State = { error?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** só caminho interno — barra `//evil.com`, `/\evil.com` e URLs absolutas. */
function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/painel";
}

export async function signIn(_prev: State, form: FormData): Promise<State> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/painel");

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha incorretos." };
  }
  if (user.bannedAt) {
    return { error: "Esta conta foi suspensa. Fale com contato@patrinu.com." };
  }
  await applyPendingGrant(user.id, user.email).catch(() => {});
  await startUserSession(user.id);
  redirect(safeNext(next));
}

export async function signUp(_prev: State, form: FormData): Promise<State> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const track = String(form.get("track") ?? "") || undefined;
  const next = String(form.get("next") ?? "/painel");

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };
  if (password.length < 8) return { error: "A senha precisa de ao menos 8 caracteres." };

  if (await getUserByEmail(email)) {
    return { error: "Já existe uma conta com esse e-mail. Tente entrar." };
  }

  const user = await createUser({ name, email, password, track });
  await applyPendingGrant(user.id, user.email).catch(() => {});
  await sendEmail({ to: user.email, ...welcomeEmail(user.name) }).catch(() => {});
  await startUserSession(user.id);
  redirect(safeNext(next));
}

export async function signOut(): Promise<void> {
  // limpa as duas sessões — "Sair" no header deve deslogar de tudo
  await endUserSession();
  await endMasterSession();
  revalidatePath("/", "layout");
  redirect("/");
}
