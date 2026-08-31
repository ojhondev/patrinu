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
import { setSetting } from "@/lib/settings";
import {
  projectApprovedEmail,
  projectRejectedEmail,
  sendEmail,
} from "@/lib/email";

const BANNER_SLOTS = ["news", "projects"] as const;

export async function saveBanner(formData: FormData) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const slot = String(formData.get("slot") ?? "");
  if (!(BANNER_SLOTS as readonly string[]).includes(slot)) return;
  const image = String(formData.get("image") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  await setSetting(`${slot}_banner_image`, /^https?:\/\//.test(image) ? image : null);
  await setSetting(`${slot}_banner_link`, /^https?:\/\//.test(link) ? link : null);
  revalidatePath(slot === "news" ? "/noticias" : "/projetos");
  revalidatePath("/master");
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
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://patrinu.vercel.app";

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
