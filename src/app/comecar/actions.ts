"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
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

  // sem e-mail: o pedido já aparece na fila do Master (/master/financiamento).
  redirect("/comecar/financiamento/enviado");
}
