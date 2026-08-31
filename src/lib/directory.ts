import { and, desc, eq, sql } from "drizzle-orm";

import type { Article, Course, FundingSource, Professional } from "./types";
import type { SpecialtyKey } from "./taxonomy";
import { db } from "@/db";
import { professionals } from "@/db/schema";
import { MOCK_ARTICLES } from "./mock/articles";
import { MOCK_COURSES } from "./mock/courses";
import { MOCK_FUNDING } from "./mock/funding";

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
  opts: { q?: string; specialty?: string; uf?: string; verifiedOnly?: boolean } = {},
): Promise<Professional[]> {
  const { q, specialty, uf, verifiedOnly } = opts;
  const rows = await db
    .select()
    .from(professionals)
    .where(
      and(
        verifiedOnly ? eq(professionals.verified, true) : undefined,
        uf ? eq(professionals.uf, uf) : undefined,
        specialty
          ? sql`${professionals.specialties} @> ARRAY[${specialty}]::text[]`
          : undefined,
        q
          ? sql`(${professionals.displayName} || ' ' || coalesce(${professionals.headline},'') || ' ' || coalesce(${professionals.bio},'') || ' ' || coalesce(${professionals.city},'')) ILIKE ${"%" + q + "%"}`
          : undefined,
      ),
    )
    .orderBy(desc(professionals.score));
  return rows.map(rowToProfessional);
}

export async function getProfessional(slug: string): Promise<Professional | null> {
  const [row] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.slug, slug))
    .limit(1);
  return row ? rowToProfessional(row) : null;
}

export async function featuredProfessionals(limit = 4): Promise<Professional[]> {
  const rows = await db
    .select()
    .from(professionals)
    .where(eq(professionals.verified, true))
    .orderBy(desc(professionals.score))
    .limit(limit);
  return rows.map(rowToProfessional);
}

/* ---------------- Notícias ---------------- */

export async function listArticles(category?: string): Promise<Article[]> {
  return MOCK_ARTICLES.filter((a) => !category || a.category === category).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function latestArticles(limit = 3): Promise<Article[]> {
  return (await listArticles()).slice(0, limit);
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
