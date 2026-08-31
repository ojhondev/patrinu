import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { sql } from "drizzle-orm";

import { db } from "./index";
import { users, professionals, projects, sources, opportunities, articles } from "./schema";
import { MOCK_PROFESSIONALS } from "@/lib/mock/professionals";
import { MOCK_PROJECTS } from "@/lib/mock/projects";
import { MOCK_OPPORTUNITIES } from "@/lib/mock/opportunities";
import { MOCK_ARTICLES } from "@/lib/mock/articles";

const VERIF_MAP: Record<string, "email" | "registro_profissional" | "projeto_documentado" | "completo"> = {
  email: "email",
  registro: "registro_profissional",
  projeto_documentado: "projeto_documentado",
  completo: "completo",
};

async function main() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projects);
  const skipCore = count > 0 && !process.argv.includes("--force");
  if (count > 0 && process.argv.includes("--force")) await db.delete(projects);

  // 1. profissionais (+ um user sintético cada)
  const slugToProId = new Map<string, string>();
  for (const p of skipCore ? [] : MOCK_PROFESSIONALS) {
    const [u] = await db
      .insert(users)
      .values({
        email: `${p.slug}@seed.patrinu.local`,
        name: p.displayName,
        passwordHash: "seed:disabled",
        plan: p.plan === "pro" ? "pro" : "cadastrado",
        emailVerifiedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    const userId =
      u?.id ??
      (
        await db
          .select({ id: users.id })
          .from(users)
          .where(sql`${users.email} = ${`${p.slug}@seed.patrinu.local`}`)
      )[0]?.id;
    if (!userId) continue;

    const [pro] = await db
      .insert(professionals)
      .values({
        userId,
        slug: p.slug,
        displayName: p.displayName,
        headline: p.headline,
        bio: p.bio,
        uf: p.uf,
        city: p.city,
        specialties: p.specialties,
        techniques: p.techniques,
        registros: p.registros,
        verified: p.verified,
        verificationLevel: VERIF_MAP[p.verificationLevel] ?? "nao_verificado",
        plan: p.plan,
        responseHours: p.responseHours ?? null,
        score: p.score ?? null,
        createdAt: new Date(p.memberSince),
      })
      .onConflictDoNothing()
      .returning();
    if (pro) slugToProId.set(p.slug, pro.id);
  }

  // 2. projetos (fichas de referência — ownerId null, já aprovadas)
  for (const p of skipCore ? [] : MOCK_PROJECTS) {
    await db
      .insert(projects)
      .values({
        slug: p.slug,
        ownerId: null,
        title: p.title,
        summary: p.summary,
        status: p.status,
        assetName: p.assetName,
        uf: p.uf,
        city: p.city,
        year: p.year ?? null,
        specialties: p.specialties,
        techniques: p.techniques,
        materials: p.materials ?? [],
        images: [],
        credits: p.credits,
        budgetRange: p.budgetRange ?? null,
        deadlineAt: p.deadlineAt ? new Date(p.deadlineAt) : null,
        requirements: p.requirements ?? [],
        featured: p.featured ?? false,
        publishedAt: new Date(p.publishedAt),
        createdAt: new Date(p.publishedAt),
      })
      .onConflictDoNothing();
  }

  // 3. Radar — fontes + oportunidades de referência (já aprovadas)
  const [oppCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(opportunities);
  if (oppCount.count === 0) {
    const srcId = new Map<string, string>();
    for (const op of MOCK_OPPORTUNITIES) {
      const s = op.source;
      if (!srcId.has(s.slug)) {
        const [row] = await db
          .insert(sources)
          .values({
            slug: s.slug,
            name: s.name,
            tier: s.tier,
            access: s.access,
            kind: "edital",
            active: true,
          })
          .onConflictDoNothing()
          .returning();
        const id =
          row?.id ??
          (
            await db
              .select({ id: sources.id })
              .from(sources)
              .where(sql`${sources.slug} = ${s.slug}`)
          )[0]?.id;
        if (id) srcId.set(s.slug, id);
      }
      const sid = srcId.get(s.slug);
      if (!sid) continue;
      await db
        .insert(opportunities)
        .values({
          sourceId: sid,
          externalId: op.externalId,
          url: op.url,
          kind: op.kind,
          status: op.status,
          title: op.title,
          summary: op.summary,
          object: op.object,
          organ: op.organ,
          organScope: op.organScope,
          uf: op.uf,
          city: op.city,
          estimatedValue: op.estimatedValue != null ? String(op.estimatedValue) : null,
          specialties: op.specialties,
          techniques: op.techniques,
          habilitacao: op.habilitacao,
          publishedAt: new Date(op.publishedAt),
          deadlineAt: op.deadlineAt ? new Date(op.deadlineAt) : null,
          relevanceScore: op.relevanceScore,
          reviewStatus: "aprovado",
        })
        .onConflictDoNothing();
    }
  }

  // 4. Notícias de referência (já publicadas)
  const [artCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articles);
  if (artCount.count === 0) {
    for (const a of MOCK_ARTICLES) {
      await db
        .insert(articles)
        .values({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          body: a.body,
          category: a.category,
          author: a.author,
          sourceName: a.source?.name ?? null,
          sourceUrl: a.source?.url ?? null,
          readingMinutes: a.readingMinutes,
          featured: a.featured ?? false,
          reviewStatus: "publicado",
          publishedAt: new Date(a.publishedAt),
        })
        .onConflictDoNothing();
    }
  }

  console.log(
    `Seed ok: ${MOCK_PROFESSIONALS.length} profissionais, ${MOCK_PROJECTS.length} projetos, ${MOCK_OPPORTUNITIES.length} editais, ${MOCK_ARTICLES.length} notícias.`,
  );
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
