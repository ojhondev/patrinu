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
import { setSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import {
  projectApprovedEmail,
  projectRejectedEmail,
  sendEmail,
} from "@/lib/email";

const BANNER_SLOTS = ["news", "projects"] as const;

/** aceita caminho interno (/algo.jpg) ou URL http(s) que aponte para uma imagem. */
function normalizeImage(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.startsWith("/")) return v;
  // ibb.co/CODE é a PÁGINA, não a imagem — converte para o link direto
  const ibb = v.match(/^https?:\/\/ibb\.co\/([A-Za-z0-9]+)/);
  if (ibb) return null; // não dá pra resolver aqui — melhor recusar do que salvar quebrado
  if (/^https?:\/\/.+\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(v)) return v;
  if (/^https?:\/\/[^ ]*(i\.ibb\.co|blob\.vercel-storage\.com|imgur\.com|cloudinary\.com)/i.test(v))
    return v;
  return null;
}

export async function saveBanner(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const slot = String(formData.get("slot") ?? "");
  if (!(BANNER_SLOTS as readonly string[]).includes(slot)) return;
  const link = String(formData.get("link") ?? "").trim();
  await setSetting(`${slot}_banner_image`, normalizeImage(String(formData.get("image") ?? "")));
  await setSetting(`${slot}_banner_link`, /^https?:\/\//.test(link) ? link : null);
  revalidatePath(slot === "news" ? "/noticias" : "/projetos");
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
    if (owner) {
      await sendEmail({
        to: owner.email,
        ...projectRejectedEmail(owner.name, proj.title, reason),
      });
    }
  }
  revalidatePath("/master");
  revalidatePath("/projetos");
}
