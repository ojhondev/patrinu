import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profile";
import { ProfileForm, type ProfileDefaults } from "@/components/profile-form";

export const metadata: Metadata = { title: "Meu perfil profissional" };

export default async function PerfilPage() {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel/perfil");

  const p = await getMyProfile(user.id);

  const defaults: ProfileDefaults = {
    displayName: p?.displayName ?? user.name,
    headline: p?.headline ?? "",
    bio: p?.bio ?? "",
    uf: p?.uf ?? "",
    city: p?.city ?? "",
    specialties: (p?.specialties ?? []) as string[],
    techniques: (p?.techniques ?? []) as string[],
    registros: (p?.registros ?? []) as string[],
    whatsapp: p?.whatsapp ?? "",
    website: p?.website ?? "",
    avatarUrl: p?.avatarUrl ?? "",
    slug: p?.slug ?? null,
  };

  return (
    <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6">
      <Link
        href="/painel"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} />
        Painel
      </Link>

      <h1 className="display mt-4 text-3xl text-ink sm:text-4xl">Meu perfil profissional</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {p
          ? "Mantenha seus dados atualizados — é assim que contratantes te encontram no diretório."
          : "Crie seu perfil no diretório de profissionais do Patrinu. Leva 3 minutos e é gratuito."}
        {p?.slug && (
          <>
            {" "}
            <Link
              href={`/profissionais/${p.slug}`}
              className="font-semibold text-green-ink hover:underline"
            >
              Ver perfil público
            </Link>
          </>
        )}
      </p>

      <ProfileForm defaults={defaults} />
    </div>
  );
}
