import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export function generateStaticParams() {
  return (["contratar", "oferecer", "financiamento"] as ProTrack[]).map((trilha) => ({ trilha }));
}

/** Destino real de cada trilha (o onboarding-protótipo foi aposentado). */
const DEST: Record<ProTrack, string> = {
  oferecer: "/painel/perfil", // formulário real de perfil profissional
  contratar: "/projetos/novo", // publicar uma vaga
  financiamento: "/comecar/financiamento", // questionário real de captação
};

export default async function ComecarPage({
  params,
}: {
  params: Promise<{ trilha: string }>;
}) {
  const { trilha } = await params;
  if (!TRACKS[trilha as ProTrack]) notFound();

  if (!(await getCurrentUser())) {
    redirect(`/cadastro?trilha=${trilha}&next=/comecar/${trilha}`);
  }
  redirect(DEST[trilha as ProTrack]);
}
