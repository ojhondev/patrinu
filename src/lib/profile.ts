import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { professionals } from "@/db/schema";

export type ProfileRow = typeof professionals.$inferSelect;

export async function getMyProfile(userId: string): Promise<ProfileRow | null> {
  const [row] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.userId, userId))
    .limit(1);
  return row ?? null;
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

async function uniqueSlug(base: string, exceptUserId: string): Promise<string> {
  const root = base || "profissional";
  let slug = root;
  for (let i = 2; ; i++) {
    const [clash] = await db
      .select({ id: professionals.id })
      .from(professionals)
      .where(and(eq(professionals.slug, slug), ne(professionals.userId, exceptUserId)))
      .limit(1);
    if (!clash) return slug;
    slug = `${root}-${i}`;
  }
}

export type ProfileInput = {
  displayName: string;
  headline?: string;
  bio?: string;
  uf?: string;
  city?: string;
  specialties: string[];
  techniques: string[];
  registros: string[];
  whatsapp?: string;
  website?: string;
  instagram?: string;
  linkedin?: string;
  avatarUrl?: string;
};

export async function upsertProfile(
  userId: string,
  input: ProfileInput,
): Promise<{ slug: string; created: boolean }> {
  const existing = await getMyProfile(userId);
  const slug = existing?.slug ?? (await uniqueSlug(slugify(input.displayName), userId));

  const values = {
    displayName: input.displayName,
    headline: input.headline || null,
    bio: input.bio || null,
    uf: input.uf || null,
    city: input.city || null,
    specialties: input.specialties,
    techniques: input.techniques,
    registros: input.registros,
    whatsapp: input.whatsapp || null,
    website: input.website || null,
    instagram: input.instagram || null,
    linkedin: input.linkedin || null,
    avatarUrl: input.avatarUrl || null,
  };

  if (existing) {
    await db.update(professionals).set(values).where(eq(professionals.userId, userId));
    return { slug: existing.slug, created: false };
  }

  await db.insert(professionals).values({
    userId,
    slug,
    ...values,
    verified: false,
    verificationLevel: "nao_verificado",
    plan: "free",
    score: 0,
  });
  return { slug, created: true };
}
