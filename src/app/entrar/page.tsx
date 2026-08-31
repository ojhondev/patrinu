import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";
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
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-16 text-center">
      <Logo className="h-8" />
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Entrar</h1>
      <p className="mt-1 text-sm text-ink-soft">Acesse sua conta Patrinu.</p>

      <AuthForm mode="login" next={next} />

      <p className="mt-6 text-sm text-ink-soft">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-green-ink hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
