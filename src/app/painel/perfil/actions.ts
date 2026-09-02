"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { upsertProfile } from "@/lib/profile";
import { isBlobUrl } from "@/lib/blob";
import { SPECIALTIES, UFS } from "@/lib/taxonomy";

type State = { error?: string; ok?: string } | null;

const VALID_SPECIALTIES = Object.keys(SPECIALTIES);
const list = (raw: string, max = 25) =>
  raw
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);

/** aceita "@handle", "handle", "site.com/x" ou URL completa → normaliza. */
function socialUrl(raw: string, base: string): string {
  const v = raw.trim().slice(0, 200);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  // já parece um domínio com caminho (ex.: "linkedin.com/in/você")
  if (/^(www\.)?[a-z0-9-]+\.[a-z]{2,}\//i.test(v)) return `https://${v.replace(/^www\./i, "")}`;
  const handle = v.replace(/^@/, "").replace(/\s+/g, "");
  return handle ? `${base}${handle}` : "";
}

export async function saveProfile(_prev: State, form: FormData): Promise<State> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel/perfil");

  const displayName = String(form.get("displayName") ?? "").trim();
  const headline = String(form.get("headline") ?? "").trim().slice(0, 140);
  const bio = String(form.get("bio") ?? "").trim().slice(0, 2000);
  const uf = String(form.get("uf") ?? "").trim().toUpperCase();
  const city = String(form.get("city") ?? "").trim().slice(0, 80);
  const specialties = form
    .getAll("specialties")
    .map((s) => String(s))
    .filter((s) => VALID_SPECIALTIES.includes(s));
  const techniques = list(String(form.get("techniques") ?? ""));
  const registros = list(String(form.get("registros") ?? ""), 10);
  const whatsapp = String(form.get("whatsapp") ?? "").replace(/[^\d+]/g, "").slice(0, 20);
  const website = String(form.get("website") ?? "").trim().slice(0, 200);
  const instagram = socialUrl(String(form.get("instagram") ?? ""), "https://instagram.com/");
  const linkedin = socialUrl(String(form.get("linkedin") ?? ""), "https://linkedin.com/in/");
  const avatarRaw = String(form.get("avatarUrl") ?? "").trim();
  const avatarUrl = isBlobUrl(avatarRaw) ? avatarRaw : "";

  if (displayName.length < 3) return { error: "Informe seu nome ou o nome do ateliê." };
  if (headline.length < 8) return { error: "Escreva um resumo curto do que você faz." };
  if (bio.length < 40) return { error: "Descreva sua atuação em pelo menos 40 caracteres." };
  if (uf && !(UFS as readonly string[]).includes(uf)) return { error: "UF inválida." };
  if (specialties.length === 0) return { error: "Escolha ao menos uma especialidade." };
  if (website && !/^https?:\/\//i.test(website))
    return { error: "O site precisa começar com http:// ou https://." };

  await upsertProfile(user.id, {
    displayName,
    headline,
    bio,
    uf,
    city,
    specialties,
    techniques,
    registros,
    whatsapp,
    website,
    instagram,
    linkedin,
    avatarUrl,
  });

  // a mesma foto vale para o avatar da conta (cabeçalho / painel)
  if (avatarUrl) {
    await db.update(users).set({ avatarUrl }).where(eq(users.id, user.id));
  }

  revalidatePath("/painel", "layout");
  revalidatePath("/profissionais");
  revalidatePath("/", "layout");
  return { ok: "Perfil salvo. Ele já aparece no diretório de profissionais." };
}
