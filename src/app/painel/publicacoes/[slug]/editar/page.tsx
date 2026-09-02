import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { projectForEditOwned } from "@/lib/projects";
import { NewProjectForm, type ProjectFormValues } from "@/components/new-project-form";

export const metadata: Metadata = { title: "Editar publicação · Painel" };

export default async function EditarPublicacaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel/publicacoes");

  const { slug } = await params;
  const p = await projectForEditOwned(slug, user.id);
  if (!p) notFound();

  const isVaga = p.entryKind === "vaga";
  const values: ProjectFormValues = {
    mode: isVaga ? "vaga" : "vitrine",
    title: p.title,
    vagaRole: p.vagaRole ?? p.title,
    summary: p.summary,
    assetName: p.assetName,
    uf: p.uf,
    city: p.city,
    year: p.year ? String(p.year) : "",
    specialties: p.specialties,
    contractType: p.contractType ?? "",
    seniority: p.seniority ?? "",
    workMode: p.workMode ?? "",
    salaryMin: p.salaryMin != null ? String(p.salaryMin) : "",
    salaryMax: p.salaryMax != null ? String(p.salaryMax) : "",
    salaryConfidential: Boolean(p.salaryConfidential),
    contactWhatsapp: p.contactWhatsapp ?? "",
    contactEmail: p.contactEmail ?? "",
    locationNote: p.locationNote ?? "",
    images: p.images ?? [],
    videoUrl: p.videoUrl ?? "",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/painel/publicacoes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} />
        Minhas publicações
      </Link>

      <h1 className="display mt-4 text-3xl text-ink sm:text-4xl">
        Editar {isVaga ? "vaga" : "projeto"}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">{p.title}</p>

      <NewProjectForm edit={{ projectId: p.id, values }} />
    </div>
  );
}
