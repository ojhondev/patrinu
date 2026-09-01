import { and, desc, eq, sql } from "drizzle-orm";

import type { Article, Course, FundingSource, Professional } from "./types";
import type { SpecialtyKey } from "./taxonomy";
import { specialtiesInGroup } from "./categories";
import { db } from "@/db";
import { articles, professionals, users } from "@/db/schema";
import { MOCK_COURSES } from "./mock/courses";
import { MOCK_FUNDING } from "./mock/funding";

/** condição SQL: a coluna text[] contém `specialty` OU qualquer especialidade do `grupo`. */
function specialtyWhere(col: unknown, specialty?: string, grupo?: string) {
  const keys = specialty ? [specialty] : grupo ? specialtiesInGroup(grupo) : [];
  if (!keys.length) return undefined;
  const arr = sql`ARRAY[${sql.join(
    keys.map((k) => sql`${k}`),
    sql`, `,
  )}]::text[]`;
  return sql`${col} && ${arr}`;
}

/* ---------------- Profissionais (banco) ---------------- */

type ProRow = typeof professionals.$inferSelect;

const VERIF_TO_TYPE: Record<string, Professional["verificationLevel"]> = {
  email: "email",
  registro_profissional: "registro",
  projeto_documentado: "projeto_documentado",
  completo: "completo",
  nao_verificado: "email",
};

function rowToProfessional(r: ProRow): Professional {
  return {
    slug: r.slug,
    displayName: r.displayName,
    headline: r.headline ?? "",
    bio: r.bio ?? "",
    uf: r.uf ?? "",
    city: r.city ?? "",
    specialties: (r.specialties ?? []) as SpecialtyKey[],
    techniques: r.techniques ?? [],
    verified: r.verified,
    verificationLevel: VERIF_TO_TYPE[r.verificationLevel] ?? "email",
    plan: (r.plan === "pro" ? "pro" : "free") as Professional["plan"],
    memberSince: r.createdAt.toISOString(),
    registros: (r.registros ?? []) as string[],
    projectSlugs: [],
    responseHours: r.responseHours ?? undefined,
    score: r.score ?? undefined,
  };
}

export async function listProfessionals(
  opts: { q?: string; specialty?: string; grupo?: string; uf?: string; verifiedOnly?: boolean } = {},
): Promise<Professional[]> {
  const { q, specialty, grupo, uf, verifiedOnly } = opts;
  const rows = await db
    .select()
    .from(professionals)
    .innerJoin(users, eq(users.id, professionals.userId))
    .where(
      and(
        sql`${users.bannedAt} is null`,
        verifiedOnly ? eq(professionals.verified, true) : undefined,
        uf ? eq(professionals.uf, uf) : undefined,
        specialtyWhere(professionals.specialties, specialty, grupo),
        q
          ? sql`(${professionals.displayName} || ' ' || coalesce(${professionals.headline},'') || ' ' || coalesce(${professionals.bio},'') || ' ' || coalesce(${professionals.city},'')) ILIKE ${"%" + q + "%"}`
          : undefined,
      ),
    )
    .orderBy(desc(professionals.score));
  return rows.map((r) => rowToProfessional(r.professionals));
}

export async function getProfessional(slug: string): Promise<Professional | null> {
  const [row] = await db
    .select()
    .from(professionals)
    .innerJoin(users, eq(users.id, professionals.userId))
    .where(and(eq(professionals.slug, slug), sql`${users.bannedAt} is null`))
    .limit(1);
  return row ? rowToProfessional(row.professionals) : null;
}

export async function featuredProfessionals(limit = 4): Promise<Professional[]> {
  const rows = await db
    .select()
    .from(professionals)
    .innerJoin(users, eq(users.id, professionals.userId))
    .where(and(eq(professionals.verified, true), sql`${users.bannedAt} is null`))
    .orderBy(desc(professionals.score))
    .limit(limit);
  return rows.map((r) => rowToProfessional(r.professionals));
}

/* ---------------- Notícias (banco) ---------------- */

type ArticleRow = typeof articles.$inferSelect;

function rowToArticle(r: ArticleRow): Article {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body?.length ? r.body : [r.excerpt],
    category: r.category as Article["category"],
    author: r.author,
    publishedAt: r.publishedAt.toISOString(),
    readingMinutes: r.readingMinutes,
    source: r.sourceUrl
      ? { name: r.sourceName ?? "Fonte", url: r.sourceUrl }
      : undefined,
    featured: r.featured,
  };
}

export async function listArticles(category?: string, q?: string): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.reviewStatus, "publicado"),
        category ? eq(articles.category, category) : undefined,
        q
          ? sql`(${articles.title} || ' ' || ${articles.excerpt}) ILIKE ${"%" + q + "%"}`
          : undefined,
      ),
    )
    .orderBy(desc(articles.publishedAt));
  return rows.map(rowToArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const [row] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.reviewStatus, "publicado")))
    .limit(1);
  return row ? rowToArticle(row) : null;
}

export async function latestArticles(limit = 3): Promise<Article[]> {
  return (await listArticles()).slice(0, limit);
}

/* ---------------- fila de moderação de notícias (Master) ---------------- */

export async function pendingArticles() {
  return db
    .select()
    .from(articles)
    .where(eq(articles.reviewStatus, "pendente"))
    .orderBy(desc(articles.publishedAt));
}

export async function reviewArticle(
  id: string,
  decision: "publicado" | "recusado",
  patch?: { title?: string; excerpt?: string; category?: string; body?: string[] },
) {
  const words = (patch?.body ?? []).join(" ").split(/\s+/).filter(Boolean).length;
  await db
    .update(articles)
    .set({
      reviewStatus: decision,
      ...(patch?.title ? { title: patch.title } : {}),
      ...(patch?.excerpt ? { excerpt: patch.excerpt } : {}),
      ...(patch?.category ? { category: patch.category } : {}),
      ...(patch?.body ? { body: patch.body, readingMinutes: Math.max(1, Math.round(words / 200)) } : {}),
    })
    .where(eq(articles.id, id));
}

/* ---------------- Cursos ---------------- */

export async function listCourses(
  opts: { q?: string; specialty?: string; format?: string; level?: string } = {},
): Promise<Course[]> {
  const { q, specialty, format, level } = opts;
  return MOCK_COURSES.filter((c) => {
    if (format && c.format !== format) return false;
    if (level && c.level !== level) return false;
    if (specialty && !c.specialties.includes(specialty as Course["specialties"][number]))
      return false;
    if (q) {
      const hay = `${c.title} ${c.provider} ${c.summary}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
}

export async function featuredCourses(limit = 3): Promise<Course[]> {
  return MOCK_COURSES.slice(0, limit);
}

/* ---------------- Financiamento ---------------- */

export async function listFunding(scope?: string): Promise<FundingSource[]> {
  return MOCK_FUNDING.filter((f) => !scope || f.scope === scope);
}

export async function getFunding(slug: string): Promise<FundingSource | null> {
  return MOCK_FUNDING.find((f) => f.slug === slug) ?? null;
}
