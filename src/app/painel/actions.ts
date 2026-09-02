"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { deleteProjectOwned } from "@/lib/projects";
import { refundCredit } from "@/lib/credits";
import {
  addMessage,
  getProposal,
  setProposalStatus,
  type ProposalStatusValue,
} from "@/lib/interactions";

const DECISIONS: ProposalStatusValue[] = ["aceita", "recusada", "em_conversa"];

export async function removeProject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const id = String(formData.get("projectId") ?? "");
  if (!id) return;

  const ok = await deleteProjectOwned(id, user.id); // valida posse no WHERE
  if (ok && user.plan !== "pro") {
    // conta grátis: devolve o crédito gasto ao publicar
    await refundCredit(user.id, id);
  }

  revalidatePath("/painel");
  revalidatePath("/vagas");
  revalidatePath("/projetos");
  revalidatePath("/", "layout");
}

export async function decideProposal(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const id = String(formData.get("proposalId") ?? "");
  const decision = String(formData.get("decision") ?? "") as ProposalStatusValue;
  if (!id || !DECISIONS.includes(decision)) return;

  const proposal = await getProposal(id);
  if (!proposal || proposal.projectOwnerId !== user.id) return; // só o dono decide

  await setProposalStatus(id, decision);
  revalidatePath("/painel");
}

export async function postMessage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const id = String(formData.get("proposalId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id || body.length === 0) return;

  const proposal = await getProposal(id);
  if (!proposal) return;
  const isOwner = proposal.projectOwnerId === user.id;
  const isProponent = proposal.userId === user.id;
  if (!isOwner && !isProponent) return; // só as duas partes conversam

  await addMessage(id, user.id, body.slice(0, 4000));
  revalidatePath("/painel");
}
