import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth-form";
import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export const metadata: Metadata = { title: "Criar conta" };

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ trilha?: string; next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/painel");
  const { trilha, next } = await searchParams;
  const track = trilha && TRACKS[trilha as ProTrack] ? (trilha as ProTrack) : undefined;

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-16 text-center">
      <Logo className="h-8" />
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Criar conta</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {track
          ? `Trilha: ${TRACKS[track].label}. Você completa o perfil depois, no painel.`
          : "Grátis. Você completa o perfil depois, no painel."}
      </p>

      <AuthForm mode="signup" track={track} next={next} />

      <p className="mt-6 text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-green-ink hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
