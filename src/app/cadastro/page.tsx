import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
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
    <AuthShell
      heading="Criar conta"
      sub={
        <>
          {track ? `Trilha: ${TRACKS[track].label}. ` : "Grátis. "}
          Já possui uma conta?{" "}
          <Link href="/entrar" className="font-semibold text-green-ink hover:underline">
            Entre aqui
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" track={track} next={next} />
    </AuthShell>
  );
}
