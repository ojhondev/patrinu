"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  addMessage,
  getProposal,
  getUserContact,
  setProposalStatus,
  type ProposalStatusValue,
} from "@/lib/interactions";

const DECISIONS: ProposalStatusValue[] = ["aceita", "recusada", "em_conversa"];

export async function decideProposal(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const id = String(formData.get("proposalId") ?? "");
  const decision = String(formData.get("decision") ?? "") as ProposalStatusValue;
  if (!id || !DECISIONS.includes(decision)) return;

  const proposal = await getProposal(id);
  if (!proposal || proposal.projectOwnerId !== user.id) return; // só o dono decide

  await setProposalStatus(id, decision);

  if (decision === "aceita" || decision === "recusada") {
    await sendEmail({
      to: proposal.userEmail,
      subject:
        decision === "aceita"
          ? `Sua proposta foi aceita — ${proposal.projectTitle}`
          : `Atualização da sua proposta — ${proposal.projectTitle}`,
      text:
        decision === "aceita"
          ? `Boa notícia: ${user.name} aceitou a sua proposta para "${proposal.projectTitle}". Combinem os próximos passos pelo painel.`
          : `${user.name} optou por não seguir com a sua proposta para "${proposal.projectTitle}" desta vez.`,
    });
  }

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

  // avisa a outra parte
  const otherId = isOwner ? proposal.userId : proposal.projectOwnerId;
  const other = otherId ? await getUserContact(otherId) : null;
  if (other) {
    await sendEmail({
      to: other.email,
      subject: `Nova mensagem sobre "${proposal.projectTitle}"`,
      text: `${user.name} escreveu:\n\n${body}\n\nResponda pelo painel.`,
    });
  }

  revalidatePath("/painel");
}
