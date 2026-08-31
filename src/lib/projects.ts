import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { projects, projectInterests } from "@/db/schema";
import type { Project, ProjectStatus } from "./types";

export type ProjectMode = "vitrine" | "abertos" | "todos";

const PUBLIC_STATUS: ProjectStatus[] = [
  "vitrine",
  "concluido",
  "em_execucao",
  "aberto",
  "em_captacao",
];
const VITRINE: ProjectStatus[] = ["vitrine", "concluido", "em_execucao"];
const ABERTO: ProjectStatus[] = ["aberto", "em_captacao"];

type Row = typeof projects.$inferSelect;

function rowToProject(r: Row): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    status: r.status as ProjectStatus,
    assetName: r.assetName,
    uf: r.uf,
    city: r.city,
    year: r.year ?? undefined,
    specialties: r.specialties as Project["specialties"],
    techniques: r.techniques,
    materials: r.materials.length ? r.materials : undefined,
    images: r.images?.length ? r.images : undefined,
    videoUrl: r.videoUrl ?? undefined,
    credits: (r.credits ?? []) as Project["credits"],
    fromOpportunityId: r.fromOpportunityId ?? undefined,
    budgetRange: r.budgetRange ?? undefined,
    deadlineAt: r.deadlineAt ? r.deadlineAt.toISOString() : null,
    requirements: r.requirements.length ? r.requirements : undefined,
    publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
    featured: r.featured,
  };
}

export async function listProjects(
  opts: { mode?: ProjectMode; q?: string; specialty?: string; uf?: string } = {},
): Promise<Project[]> {
  const { mode = "todos", q, specialty, uf } = opts;
  const statuses =
    mode === "vitrine" ? VITRINE : mode === "abertos" ? ABERTO : PUBLIC_STATUS;

  const rows = await db
    .select()
    .from(projects)
    .where(
      and(
        inArray(projects.status, statuses),
        uf ? eq(projects.uf, uf) : undefined,
        specialty ? sql`${projects.specialties} @> ARRAY[${specialty}]::text[]` : undefined,
        q
          ? sql`(${projects.title} || ' ' || ${projects.summary} || ' ' || ${projects.assetName} || ' ' || ${projects.city}) ILIKE ${"%" + q + "%"}`
          : undefined,
      ),
    )
    .orderBy(desc(projects.publishedAt), desc(projects.createdAt));

  return rows.map(rowToProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row ? rowToProject(row) : null;
}

/** Projeto de qualquer status — para o dono e para o master. */
export async function getProjectRaw(slug: string): Promise<Row | null> {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row ?? null;
}

export async function featuredProjects(limit = 6): Promise<Project[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.featured, true), inArray(projects.status, PUBLIC_STATUS)))
    .orderBy(desc(projects.publishedAt))
    .limit(limit);
  return rows.map(rowToProject);
}

export async function projectsByProfessional(slug: string): Promise<Project[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(
      and(
        inArray(projects.status, PUBLIC_STATUS),
        sql`${projects.credits} @> ${JSON.stringify([{ slug }])}::jsonb`,
      ),
    )
    .orderBy(desc(projects.publishedAt));
  return rows.map(rowToProject);
}

export async function pendingProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.status, "em_analise"))
    .orderBy(desc(projects.submittedAt));
}

export async function pendingProjectsCount(): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(projects)
    .where(eq(projects.status, "em_analise"));
  return row?.n ?? 0;
}

/** Todos os projetos do usuário logado — qualquer status. */
export async function projectsByOwner(ownerId: string): Promise<Project[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.createdAt));
  return rows.map(rowToProject);
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export type NewProjectInput = {
  ownerId: string;
  ownerName: string;
  title: string;
  summary: string;
  assetName: string;
  uf: string;
  city: string;
  mode: "vitrine" | "aberto";
  year?: number;
  specialties: string[];
  budgetRange?: string;
  images?: string[];
  videoUrl?: string | null;
};

/** Cria um projeto do usuário em status `em_analise` (fila do Master). */
export async function submitProject(input: NewProjectInput): Promise<Project> {
  const base = slugify(input.title) || "projeto";
  let slug = base;
  for (let i = 2; ; i++) {
    const [clash] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    if (!clash) break;
    slug = `${base}-${i}`;
  }

  const [row] = await db
    .insert(projects)
    .values({
      slug,
      ownerId: input.ownerId,
      title: input.title,
      summary: input.summary,
      status: "em_analise",
      assetName: input.assetName,
      uf: input.uf,
      city: input.city,
      year: input.year ?? null,
      specialties: input.specialties,
      images: input.images ?? [],
      videoUrl: input.videoUrl ?? null,
      credits: [{ role: "Proponente", name: input.ownerName }],
      budgetRange: input.budgetRange ?? null,
      // guarda o modo pretendido para o Master aplicar na aprovação
      requirements: [`__mode:${input.mode}`],
      submittedAt: new Date(),
    })
    .returning();
  return rowToProject(row);
}

/** Master aprova: aplica o status público pretendido e publica. */
export async function approveProject(id: string): Promise<void> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!row) return;
  const wanted = (row.requirements ?? []).find((r) => r.startsWith("__mode:"));
  const mode = wanted?.slice("__mode:".length);
  const status: ProjectStatus = mode === "vitrine" ? "vitrine" : "aberto";
  await db
    .update(projects)
    .set({
      status,
      requirements: (row.requirements ?? []).filter((r) => !r.startsWith("__mode:")),
      moderatedAt: new Date(),
      publishedAt: new Date(),
      rejectionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));
}

export async function rejectProject(id: string, reason: string): Promise<void> {
  await db
    .update(projects)
    .set({
      status: "recusado",
      rejectionReason: reason || "Não atende aos critérios de publicação.",
      moderatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));
}

export async function projectInterestsCount(projectId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(projectInterests)
    .where(eq(projectInterests.projectId, projectId));
  return row?.n ?? 0;
}
