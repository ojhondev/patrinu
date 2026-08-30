import type { Article, Course, FundingSource, Professional } from "./types";
import { MOCK_PROFESSIONALS } from "./mock/professionals";
import { MOCK_ARTICLES } from "./mock/articles";
import { MOCK_COURSES } from "./mock/courses";
import { MOCK_FUNDING } from "./mock/funding";

/* ---------------- Profissionais ---------------- */

export async function listProfessionals(
  opts: { q?: string; specialty?: string; uf?: string; verifiedOnly?: boolean } = {},
): Promise<Professional[]> {
  const { q, specialty, uf, verifiedOnly } = opts;
  return MOCK_PROFESSIONALS.filter((p) => {
    if (verifiedOnly && !p.verified) return false;
    if (uf && p.uf !== uf) return false;
    if (specialty && !p.specialties.includes(specialty as Professional["specialties"][number]))
      return false;
    if (q) {
      const hay = `${p.displayName} ${p.headline} ${p.bio} ${p.city} ${p.techniques.join(" ")}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export async function getProfessional(slug: string): Promise<Professional | null> {
  return MOCK_PROFESSIONALS.find((p) => p.slug === slug) ?? null;
}

export async function featuredProfessionals(limit = 4): Promise<Professional[]> {
  return [...MOCK_PROFESSIONALS]
    .filter((p) => p.verified)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
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
