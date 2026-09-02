"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  endMasterSession,
  isMasterSession,
  startMasterSession,
  verifyMasterCredentials,
} from "@/lib/auth";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { approveProject, rejectProject } from "@/lib/projects";
import { reviewOpportunity } from "@/lib/opportunities";
import { reviewArticle } from "@/lib/directory";
import { runIngest } from "@/lib/ingest/run";
import { isBlobUrl } from "@/lib/blob";
import { setSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import { projectApprovedEmail, sendEmail } from "@/lib/email";

const BANNER_SLOTS = ["news", "projects"] as const;

/** só aceita upload do próprio site (Vercel Blob) ou arquivo de /public. */
function validBannerImage(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.startsWith("/")) return v; // /ad-restaura.jpg etc.
  return isBlobUrl(v) ? v : null;
}

export async function saveBanner(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const slot = String(formData.get("slot") ?? "");
  if (!(BANNER_SLOTS as readonly string[]).includes(slot)) return;

  const raw = String(formData.get("image") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();

  if (raw === "") {
    // campo limpo = remover o banner
    await setSetting(`${slot}_banner_image`, null);
  } else {
    const img = validBannerImage(raw);
    // imagem inválida: NÃO sobrescreve a atual (evita "o banner sumiu")
    if (img) await setSetting(`${slot}_banner_image`, img);
  }
  await setSetting(`${slot}_banner_link`, /^https?:\/\//.test(link) ? link : null);

  revalidatePath(slot === "news" ? "/noticias" : "/projetos");
  revalidatePath("/", "layout");
  revalidatePath("/master");
}

export async function moderateOpportunity(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!id || (decision !== "aprovado" && decision !== "recusado")) return;
  const title = String(formData.get("title") ?? "").trim() || undefined;
  const summary = String(formData.get("summary") ?? "").trim() || undefined;
  await reviewOpportunity(id, decision, { title, summary });
  revalidatePath("/master");
  revalidatePath("/editais");
  revalidatePath("/");
}

export async function moderateArticle(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!id || (decision !== "publicado" && decision !== "recusado")) return;
  const title = String(formData.get("title") ?? "").trim() || undefined;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || undefined;
  const category = String(formData.get("category") ?? "").trim() || undefined;
  const bodyRaw = String(formData.get("body") ?? "").trim();
  const body = bodyRaw
    ? bodyRaw.split(/\n{2,}|\r\n{2,}/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean)
    : undefined;
  if (decision === "publicado" && (!excerpt || excerpt.startsWith("(rascunho"))) {
    return; // não publica sem um resumo escrito
  }
  await reviewArticle(id, decision, { title, excerpt, category, body });
  revalidatePath("/master");
  revalidatePath("/noticias");
  revalidatePath("/");
}

export async function triggerIngest() {
  if (!(await isMasterSession())) redirect("/master/entrar");
  await runIngest().catch((e) => console.error("[master] ingest:", e));
  revalidatePath("/master", "layout");
  revalidatePath("/noticias");
  revalidatePath("/editais");
  revalidatePath("/");
}

/** Envia um e-mail de teste para o MASTER_EMAIL e mostra o resultado. */
export async function sendTestEmail() {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const to = process.env.MASTER_EMAIL;
  let result: string;
  if (!process.env.RESEND_API_KEY) {
    result = "RESEND_API_KEY não configurada — nenhum e-mail sai ainda.";
  } else if (!to) {
    result = "MASTER_EMAIL não configurada.";
  } else {
    const r = await sendEmail({
      to,
      subject: "Teste de envio — Patrinu",
      text: `Se você recebeu isto, o Resend está funcionando.\n\nEnviado em ${new Date().toLocaleString("pt-BR")}.`,
    });
    result = r.ok
      ? `Enviado para ${to}. Confira a caixa de entrada (e o spam).`
      : "O Resend recusou o envio — veja os logs da Vercel para o motivo.";
  }
  await setSetting("email_test_result", `${result} [${new Date().toISOString()}]`);
  revalidatePath("/master/config");
}

export async function loginMaster(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyMasterCredentials(email, password)) {
    return { error: "E-mail ou senha incorretos." };
  }
  await startMasterSession();
  redirect("/master");
}

export async function logoutMaster() {
  await endMasterSession();
  redirect("/master/entrar");
}

export async function moderateProject(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!id) return;

  const [proj] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!proj) return;
  const owner = proj.ownerId
    ? (await db.select().from(users).where(eq(users.id, proj.ownerId)).limit(1))[0]
    : null;
  const base = SITE_URL;

  if (decision === "approve") {
    await approveProject(id);
    if (owner) {
      await sendEmail({
        to: owner.email,
        ...projectApprovedEmail(owner.name, proj.title, `${base}/projetos/${proj.slug}`),
      });
    }
  } else if (decision === "reject") {
    const reason = String(formData.get("reason") ?? "") || "Não atende aos critérios de publicação.";
    await rejectProject(id, reason);
    // sem e-mail na recusa — o motivo aparece no painel do usuário.
  }
  revalidatePath("/master");
  revalidatePath("/projetos");
}
