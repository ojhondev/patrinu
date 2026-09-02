import { cache } from "react";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  projectInterests,
  projects,
  proposalMessages,
  proposals,
  users,
} from "@/db/schema";

/* ------------------------------------------------------------------ */
/* "Quero participar" — projectInterests                               */
/* ------------------------------------------------------------------ */

export async function hasInterest(projectId: string, userId: string): Promise<boolean> {
  const [row] = await db
    .select({ x: sql<number>`1` })
    .from(projectInterests)
    .where(
      and(eq(projectInterests.projectId, projectId), eq(projectInterests.userId, userId)),
    )
    .limit(1);
  return Boolean(row);
}

export type InterestInput = {
  message?: string;
  applicantName?: string | null;
  applicantEmail?: string | null;
  applicantCity?: string | null;
  nationwide?: boolean;
  cvUrl?: string | null;
  availability?: string | null;
};

export async function addInterest(
  projectId: string,
  userId: string,
  data: string | InterestInput = {},
): Promise<void> {
  const d: InterestInput = typeof data === "string" ? { message: data } : data;
  await db
    .insert(projectInterests)
    .values({
      projectId,
      userId,
      message: d.message?.trim() || null,
      applicantName: d.applicantName?.trim() || null,
      applicantEmail: d.applicantEmail?.trim() || null,
      applicantCity: d.applicantCity?.trim() || null,
      nationwide: Boolean(d.nationwide),
      cvUrl: d.cvUrl || null,
      availability: d.availability || null,
    })
    .onConflictDoNothing();
}

export type InterestRow = {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string | null;
  applicantName: string | null;
  applicantEmail: string | null;
  applicantCity: string | null;
  nationwide: boolean;
  cvUrl: string | null;
  availability: string | null;
  createdAt: Date;
};

export type MyApplicationRow = {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  projectStatus: string;
  entryKind: string;
  message: string | null;
  cvUrl: string | null;
  availability: string | null;
  applicantCity: string | null;
  nationwide: boolean;
  createdAt: Date;
};

/** Candidaturas / interesses que O USUÁRIO enviou. */
export async function interestsByUser(userId: string): Promise<MyApplicationRow[]> {
  return db
    .select({
      projectId: projectInterests.projectId,
      projectSlug: projects.slug,
      projectTitle: projects.title,
      projectStatus: projects.status,
      entryKind: projects.entryKind,
      message: projectInterests.message,
      cvUrl: projectInterests.cvUrl,
      availability: projectInterests.availability,
      applicantCity: projectInterests.applicantCity,
      nationwide: projectInterests.nationwide,
      createdAt: projectInterests.createdAt,
    })
    .from(projectInterests)
    .innerJoin(projects, eq(projects.id, projectInterests.projectId))
    .where(eq(projectInterests.userId, userId))
    .orderBy(desc(projectInterests.createdAt)) as Promise<MyApplicationRow[]>;
}

export const interestsForOwner = cache(
  async (ownerId: string): Promise<InterestRow[]> =>
    db
      .select({
        projectId: projectInterests.projectId,
        projectSlug: projects.slug,
        projectTitle: projects.title,
        userId: projectInterests.userId,
        userName: users.name,
        userEmail: users.email,
        message: projectInterests.message,
        applicantName: projectInterests.applicantName,
        applicantEmail: projectInterests.applicantEmail,
        applicantCity: projectInterests.applicantCity,
        nationwide: projectInterests.nationwide,
        cvUrl: projectInterests.cvUrl,
        availability: projectInterests.availability,
        createdAt: projectInterests.createdAt,
      })
      .from(projectInterests)
      .innerJoin(projects, eq(projects.id, projectInterests.projectId))
      .innerJoin(users, eq(users.id, projectInterests.userId))
      .where(eq(projects.ownerId, ownerId))
      .orderBy(desc(projectInterests.createdAt)),
);

/* ------------------------------------------------------------------ */
/* "Enviar proposta" — proposals                                       */
/* ------------------------------------------------------------------ */

export type ProposalStatusValue = "enviada" | "em_conversa" | "aceita" | "recusada";

export async function hasProposal(projectId: string, userId: string): Promise<boolean> {
  const [row] = await db
    .select({ x: sql<number>`1` })
    .from(proposals)
    .where(and(eq(proposals.projectId, projectId), eq(proposals.userId, userId)))
    .limit(1);
  return Boolean(row);
}

export async function addProposal(input: {
  projectId: string;
  userId: string;
  message: string;
  priceRange?: string;
}): Promise<void> {
  await db
    .insert(proposals)
    .values({
      projectId: input.projectId,
      userId: input.userId,
      message: input.message.trim(),
      priceRange: input.priceRange?.trim() || null,
    })
    .onConflictDoNothing();
}

export type ProposalRow = {
  id: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  projectOwnerId: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  priceRange: string | null;
  status: ProposalStatusValue;
  createdAt: Date;
};

const PROPOSAL_SELECT = {
  id: proposals.id,
  projectId: proposals.projectId,
  projectSlug: projects.slug,
  projectTitle: projects.title,
  projectOwnerId: projects.ownerId,
  userId: proposals.userId,
  userName: users.name,
  userEmail: users.email,
  message: proposals.message,
  priceRange: proposals.priceRange,
  status: proposals.status,
  createdAt: proposals.createdAt,
} as const;

export async function proposalsForOwner(ownerId: string): Promise<ProposalRow[]> {
  return db
    .select(PROPOSAL_SELECT)
    .from(proposals)
    .innerJoin(projects, eq(projects.id, proposals.projectId))
    .innerJoin(users, eq(users.id, proposals.userId))
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(proposals.createdAt)) as Promise<ProposalRow[]>;
}

export async function proposalsByUser(userId: string): Promise<ProposalRow[]> {
  return db
    .select(PROPOSAL_SELECT)
    .from(proposals)
    .innerJoin(projects, eq(projects.id, proposals.projectId))
    .innerJoin(users, eq(users.id, proposals.userId))
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt)) as Promise<ProposalRow[]>;
}

export async function getProposal(id: string): Promise<ProposalRow | null> {
  const [row] = (await db
    .select(PROPOSAL_SELECT)
    .from(proposals)
    .innerJoin(projects, eq(projects.id, proposals.projectId))
    .innerJoin(users, eq(users.id, proposals.userId))
    .where(eq(proposals.id, id))
    .limit(1)) as ProposalRow[];
  return row ?? null;
}

export async function setProposalStatus(
  id: string,
  status: ProposalStatusValue,
): Promise<void> {
  await db.update(proposals).set({ status }).where(eq(proposals.id, id));
}

export async function getUserContact(
  userId: string,
): Promise<{ name: string; email: string } | null> {
  const [u] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return u ?? null;
}

/* ------------------------------------------------------------------ */
/* Mensagens da proposta                                               */
/* ------------------------------------------------------------------ */

export type MessageRow = {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: Date;
};

export async function messagesForProposal(proposalId: string): Promise<MessageRow[]> {
  return db
    .select({
      id: proposalMessages.id,
      senderId: proposalMessages.senderId,
      senderName: users.name,
      body: proposalMessages.body,
      createdAt: proposalMessages.createdAt,
    })
    .from(proposalMessages)
    .innerJoin(users, eq(users.id, proposalMessages.senderId))
    .where(eq(proposalMessages.proposalId, proposalId))
    .orderBy(asc(proposalMessages.createdAt));
}

export async function addMessage(
  proposalId: string,
  senderId: string,
  body: string,
): Promise<void> {
  await db.insert(proposalMessages).values({ proposalId, senderId, body: body.trim() });
  await db.update(proposals).set({ status: "em_conversa" }).where(
    and(eq(proposals.id, proposalId), eq(proposals.status, "enviada")),
  );
}

/* contagens para os cabeçalhos do painel */
export async function inboxCounts(ownerId: string) {
  const [i] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(projectInterests)
    .innerJoin(projects, eq(projects.id, projectInterests.projectId))
    .where(eq(projects.ownerId, ownerId));
  const [p] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(proposals)
    .innerJoin(projects, eq(projects.id, proposals.projectId))
    .where(eq(projects.ownerId, ownerId));
  return { interests: i?.n ?? 0, proposals: p?.n ?? 0 };
}

/* projetos que o dono pode receber ação (para validar posse na action) */
export async function ownsProject(projectId: string, ownerId: string): Promise<boolean> {
  const [row] = await db
    .select({ x: sql<number>`1` })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .limit(1);
  return Boolean(row);
}

/* helper usado pelas actions da página de projeto */
export async function openProjectForActions(slug: string) {
  const [row] = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      status: projects.status,
      ownerId: projects.ownerId,
      entryKind: projects.entryKind,
    })
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  if (!row) return null;
  const OPEN: string[] = ["aberto", "em_captacao"];
  return { ...row, isOpen: OPEN.includes(row.status) };
}
