"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner, submitProject } from "@/lib/projects";
import { projectSubmittedEmail, sendEmail } from "@/lib/email";
import {
  addInterest,
  addProposal,
  hasProposal,
  openProjectForActions,
} from "@/lib/interactions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  SPECIALTIES,
  UFS,
  CONTRACT_TYPES,
  SENIORITY,
  WORK_MODES,
} from "@/lib/taxonomy";

type State = { error?: string; ok?: string } | null;

const VALID_SPECIALTIES = Object.keys(SPECIALTIES);
const num = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/[^\d.,]/g, "").replace(".", "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export async function createProject(_prev: State, form: FormData): Promise<State> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/projetos/novo");

  const mode = String(form.get("mode") ?? "vaga") === "vitrine" ? "vitrine" : "vaga";
  const isVaga = mode === "vaga";

  const title = String(form.get("title") ?? "").trim();
  const summary = String(form.get("summary") ?? "").trim();
  const assetName = String(form.get("assetName") ?? "").trim();
  const uf = String(form.get("uf") ?? "").trim().toUpperCase();
  const city = String(form.get("city") ?? "").trim();
  const yearRaw = String(form.get("year") ?? "").trim();
  const specialties = form
    .getAll("specialties")
    .map((s) => String(s))
    .filter((s) => VALID_SPECIALTIES.includes(s));

  // campos de vaga
  const vagaRole = String(form.get("vagaRole") ?? "").trim();
  const contractType = String(form.get("contractType") ?? "");
  const seniority = String(form.get("seniority") ?? "");
  const workMode = String(form.get("workMode") ?? "");
  const salaryConfidential = form.get("salaryConfidential") != null;
  const salaryMin = salaryConfidential ? null : num(form.get("salaryMin"));
  const salaryMax = salaryConfidential ? null : num(form.get("salaryMax"));

  if (isVaga && vagaRole.length < 4) return { error: "Informe a função da vaga." };
  if (!isVaga && title.length < 6)
    return { error: "Dê um título com pelo menos 6 caracteres." };
  if (summary.length < 40)
    return { error: `Descreva ${isVaga ? "a vaga" : "o projeto"} em pelo menos 40 caracteres.` };
  if (!isVaga && !assetName) return { error: "Informe o bem / imóvel." };
  if (!(UFS as readonly string[]).includes(uf)) return { error: "Selecione a UF." };
  if (!city) return { error: "Informe a cidade." };
  if (specialties.length === 0)
    return { error: `Escolha ${isVaga ? "as áreas desejadas" : "ao menos uma especialidade"}.` };

  if (isVaga) {
    if (!(contractType in CONTRACT_TYPES)) return { error: "Selecione o tipo de contrato." };
    if (workMode && !(workMode in WORK_MODES)) return { error: "Modelo de trabalho inválido." };
    if (seniority && !(seniority in SENIORITY)) return { error: "Senioridade inválida." };
    if (salaryMin && salaryMax && salaryMax < salaryMin)
      return { error: "A faixa salarial máxima não pode ser menor que a mínima." };
  }

  const year = !isVaga && yearRaw ? Number(yearRaw) : undefined;
  if (year !== undefined && (Number.isNaN(year) || year < 1500 || year > 2100))
    return { error: "Ano inválido." };

  const plan = await getPlan();

  // publicar vaga exige Pro (contratante)
  if (isVaga && plan !== "pro") {
    return {
      error:
        "Publicar vagas é um recurso do Patrinu Pro para contratantes. Assine em /pro/contratar.",
    };
  }

  // projeto/vitrine: cota gratuita de 1 publicação por mês para quem não é Pro
  if (!isVaga && plan !== "pro") {
    const mine = await projectsByOwner(user.id);
    const now = new Date();
    const thisMonth = mine.filter((p) => {
      const d = new Date(p.publishedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    if (thisMonth.length >= 1) {
      return {
        error:
          "O plano gratuito permite 1 publicação por mês. Assine o Patrinu Pro para publicar sem limite.",
      };
    }
  }

  // URLs geradas pelo upload client-side (Vercel Blob) — só para vitrine
  const BLOB_HOST = ".public.blob.vercel-storage.com";
  const images = isVaga
    ? []
    : form
        .getAll("mediaImages")
        .map((u) => String(u))
        .filter((u) => u.includes(BLOB_HOST))
        .slice(0, 8);
  const videoRaw = String(form.get("mediaVideo") ?? "");
  const videoUrl = !isVaga && videoRaw.includes(BLOB_HOST) ? videoRaw : null;

  await submitProject({
    ownerId: user.id,
    ownerName: user.name,
    title: isVaga ? vagaRole : title,
    summary,
    assetName: assetName || (isVaga ? "—" : ""),
    uf,
    city,
    mode,
    year,
    specialties,
    images,
    videoUrl,
    vagaRole: isVaga ? vagaRole : undefined,
    contractType: isVaga ? contractType : undefined,
    seniority: isVaga && seniority ? seniority : undefined,
    workMode: isVaga && workMode ? workMode : undefined,
    salaryMin,
    salaryMax,
    salaryConfidential,
  });

  await sendEmail({
    to: user.email,
    ...projectSubmittedEmail(user.name, isVaga ? vagaRole : title),
  });

  redirect("/painel?enviado=1");
}

/* ------------------------------------------------------------------ */
/* Fase 2 — "Quero participar" e "Enviar proposta"                     */
/* ------------------------------------------------------------------ */

async function ownerEmail(ownerId: string | null): Promise<{ name: string; email: string } | null> {
  if (!ownerId) return null;
  const [u] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, ownerId))
    .limit(1);
  return u ?? null;
}

export async function expressInterest(_prev: State, form: FormData): Promise<State> {
  const slug = String(form.get("slug") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/entrar?next=/projetos/${slug}`);

  const project = await openProjectForActions(slug);
  if (!project || !project.isOpen) return { error: "Esta publicação não está aberta." };
  if (project.ownerId === user.id)
    return { error: "Esta publicação é sua." };

  const isVaga = project.entryKind === "vaga";
  if (isVaga && (await getPlan()) !== "pro") {
    return {
      error: "Candidatar-se às vagas é um recurso do Patrinu Pro. Assine em /pro/oferecer.",
    };
  }

  await addInterest(project.id, user.id, String(form.get("message") ?? ""));

  const owner = await ownerEmail(project.ownerId);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: isVaga
        ? `Nova candidatura para "${project.title}"`
        : `Novo interessado em "${project.title}"`,
      text: `${user.name} ${isVaga ? "se candidatou à vaga" : "quer participar do projeto"} "${project.title}". Veja no seu painel.`,
    });
  }

  revalidatePath(`/projetos/${slug}`);
  revalidatePath("/painel");
  return { ok: isVaga ? "Candidatura enviada." : "Você entrou na lista de interessados." };
}

export async function submitProposal(_prev: State, form: FormData): Promise<State> {
  const slug = String(form.get("slug") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/entrar?next=/projetos/${slug}`);

  if ((await getPlan()) !== "pro") {
    return { error: "Enviar proposta exige um plano Pro." };
  }

  const project = await openProjectForActions(slug);
  if (!project || !project.isOpen) return { error: "Este projeto não está aberto." };
  if (project.ownerId === user.id)
    return { error: "Você é o proponente deste projeto." };

  const message = String(form.get("message") ?? "").trim();
  const priceRange = String(form.get("priceRange") ?? "").trim() || undefined;
  if (message.length < 30)
    return { error: "Escreva uma proposta com pelo menos 30 caracteres." };

  if (await hasProposal(project.id, user.id))
    return { error: "Você já enviou uma proposta para este projeto." };

  await addProposal({ projectId: project.id, userId: user.id, message, priceRange });

  const owner = await ownerEmail(project.ownerId);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: `Nova proposta para "${project.title}"`,
      text: `${user.name} enviou uma proposta para "${project.title}".${
        priceRange ? ` Faixa: ${priceRange}.` : ""
      }\n\n${message}\n\nResponda pelo seu painel.`,
    });
  }

  revalidatePath(`/projetos/${slug}`);
  revalidatePath("/painel");
  return { ok: "Proposta enviada. O proponente foi avisado." };
}
