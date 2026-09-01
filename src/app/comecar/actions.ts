"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { db } from "@/db";
import { financingRequests } from "@/db/schema";

type State = { error?: string } | null;

export async function submitFinancingRequest(
  _prev: State,
  form: FormData,
): Promise<State> {
  const user = await getCurrentUser();

  const get = (k: string) => String(form.get(k) ?? "").trim();
  const contactName = get("contactName") || user?.name || "";
  const contactEmail = (get("contactEmail") || user?.email || "").toLowerCase();
  const organization = get("organization");
  const assetName = get("assetName");

  if (contactName.length < 2) return { error: "Informe o nome do responsável." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
    return { error: "Informe um e-mail válido para contato." };
  if (organization.length < 2) return { error: "Informe a organização proponente." };
  if (assetName.length < 2) return { error: "Informe o bem / imóvel." };

  await db.insert(financingRequests).values({
    userId: user?.id ?? null,
    contactName,
    contactEmail,
    organization,
    assetName,
    uf: get("uf") || null,
    city: get("city") || null,
    projectStage: get("projectStage") || null,
    fundingGoal: get("fundingGoal") || null,
    mechanism: get("mechanism") || null,
    summary: get("summary") || null,
  });

  await sendEmail({
    to: process.env.MASTER_EMAIL ?? "contato@patrinu.com",
    subject: `Novo pedido de financiamento — ${organization}`,
    text: `${contactName} (${contactEmail}) enviou um pedido de financiamento para "${assetName}", ${organization}.\n\nEstágio: ${get("projectStage") || "—"}\nMeta: ${get("fundingGoal") || "—"}\nMecanismo: ${get("mechanism") || "—"}\n\n${get("summary") || ""}\n\nVeja na fila do Master.`,
  });

  redirect("/comecar/financiamento/enviado");
}
