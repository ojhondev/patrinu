import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { listProjects } from "@/lib/projects";
import { listProfessionals, listArticles } from "@/lib/directory";
import { listOpportunities } from "@/lib/opportunities";

const STATIC = [
  "",
  "/vagas",
  "/projetos",
  "/profissionais",
  "/editais",
  "/noticias",
  "/cursos",
  "/financiamento",
  "/empresas",
  "/pro",
  "/pro/contratar",
  "/pro/oferecer",
  "/pro/financiamento",
  "/fontes",
  "/entrar",
  "/cadastro",
  "/privacidade",
  "/termos",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
  }));

  try {
    const [projetos, pros, editais, noticias] = await Promise.all([
      listProjects({ mode: "todos" }),
      listProfessionals({}),
      listOpportunities({}),
      listArticles(),
    ]);

    for (const p of projetos)
      base.push({ url: `${SITE_URL}/projetos/${p.slug}`, lastModified: new Date(p.publishedAt) });
    for (const pr of pros) base.push({ url: `${SITE_URL}/profissionais/${pr.slug}` });
    for (const e of editais)
      base.push({ url: `${SITE_URL}/editais/${e.id}`, lastModified: new Date(e.publishedAt) });
    for (const a of noticias)
      base.push({ url: `${SITE_URL}/noticias/${a.slug}`, lastModified: new Date(a.publishedAt) });
  } catch {
    /* se o banco falhar, ao menos as rotas estáticas vão no sitemap */
  }

  return base;
}
