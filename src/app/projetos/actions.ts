"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner, submitProject } from "@/lib/projects";
import { projectSubmittedEmail, sendEmail } from "@/lib/email";
import { SPECIALTIES, UFS } from "@/lib/taxonomy";

type State = { error?: string } | null;

const VALID_SPECIALTIES = Object.keys(SPECIALTIES);

export async function createProject(_prev: State, form: FormData): Promise<State> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/projetos/novo");

  const title = String(form.get("title") ?? "").trim();
  const summary = String(form.get("summary") ?? "").trim();
  const assetName = String(form.get("assetName") ?? "").trim();
  const uf = String(form.get("uf") ?? "").trim().toUpperCase();
  const city = String(form.get("city") ?? "").trim();
  const mode = String(form.get("mode") ?? "aberto") === "vitrine" ? "vitrine" : "aberto";
  const yearRaw = String(form.get("year") ?? "").trim();
  const budgetRange = String(form.get("budgetRange") ?? "").trim() || undefined;
  const specialties = form
    .getAll("specialties")
    .map((s) => String(s))
    .filter((s) => VALID_SPECIALTIES.includes(s));
  const images = String(form.get("images") ?? "")
    .split(/[\n,]/)
    .map((u) => u.trim())
    .filter((u) => /^https?:\/\//.test(u));

  if (title.length < 6) return { error: "Dê um título com pelo menos 6 caracteres." };
  if (summary.length < 40)
    return { error: "Descreva o projeto em pelo menos 40 caracteres." };
  if (!assetName) return { error: "Informe o bem / imóvel." };
  if (!(UFS as readonly string[]).includes(uf)) return { error: "Selecione a UF." };
  if (!city) return { error: "Informe a cidade." };
  if (specialties.length === 0)
    return { error: "Escolha ao menos uma especialidade." };

  const year = yearRaw ? Number(yearRaw) : undefined;
  if (year !== undefined && (Number.isNaN(year) || year < 1500 || year > 2100))
    return { error: "Ano inválido." };

  // cota gratuita: 1 projeto por mês para quem não é Pro
  const plan = await getPlan();
  if (plan !== "pro") {
    const mine = await projectsByOwner(user.id);
    const now = new Date();
    const thisMonth = mine.filter((p) => {
      const d = new Date(p.publishedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    if (thisMonth.length >= 1) {
      return {
        error:
          "O plano gratuito permite 1 projeto por mês. Assine o Patrinu Pro para publicar sem limite.",
      };
    }
  }

  await submitProject({
    ownerId: user.id,
    ownerName: user.name,
    title,
    summary,
    assetName,
    uf,
    city,
    mode,
    year,
    specialties,
    budgetRange,
    images,
  });

  await sendEmail({ to: user.email, ...projectSubmittedEmail(user.name, title) });

  redirect("/painel?enviado=1");
}
