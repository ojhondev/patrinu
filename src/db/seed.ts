import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { sql } from "drizzle-orm";

import { db } from "./index";
import { users, professionals, projects } from "./schema";
import { MOCK_PROFESSIONALS } from "@/lib/mock/professionals";
import { MOCK_PROJECTS } from "@/lib/mock/projects";

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
  if (count > 0) {
    console.log(`Já existem ${count} projetos — pulando seed. Use --force para recriar.`);
    if (!process.argv.includes("--force")) return;
    await db.delete(projects);
  }

  // 1. profissionais (+ um user sintético cada)
  const slugToProId = new Map<string, string>();
  for (const p of MOCK_PROFESSIONALS) {
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
  for (const p of MOCK_PROJECTS) {
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

  console.log(
    `Seed ok: ${MOCK_PROFESSIONALS.length} profissionais, ${MOCK_PROJECTS.length} projetos.`,
  );
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
