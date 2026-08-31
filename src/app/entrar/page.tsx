import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/painel");
  const { next } = await searchParams;

  return (
    <AuthShell
      heading="Entrar"
      sub={
        <>
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-green-ink hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <AuthForm mode="login" next={next} />
    </AuthShell>
  );
}
