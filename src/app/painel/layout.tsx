import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner } from "@/lib/projects";
import { interestsForOwner } from "@/lib/interactions";
import { signOut } from "@/app/conta/actions";
import { Avatar } from "@/components/avatar";
import { PainelNav } from "@/components/painel-nav";

export const metadata: Metadata = { title: "Painel" };

export default async function PainelLayout({ children }: { children: ReactNode }) {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const [plan, myProjects, received] = await Promise.all([
    getPlan(),
    projectsByOwner(user.id),
    interestsForOwner(user.id),
  ]);
  const isPro = plan === "pro";
  const counts = { publicacoes: myProjects.length, candidaturas: received.length };

  const identity = (
    <div className="flex items-center gap-3">
      <Avatar name={user.name} src={user.avatarUrl} size={40} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{user.name}</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {isPro ? "Membro Pro" : "Conta gratuita"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sunk lg:flex">
        <div className="border-b border-border px-5 py-5">{identity}</div>
        <PainelNav counts={counts} />
        <div className="space-y-2 border-t border-border p-3">
          <Link href="/projetos/novo" className="btn btn-primary btn-sm w-full">
            <Plus size={15} />
            Publicar
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost btn-sm w-full text-ink-soft">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-bg">
        <div className="border-b border-border bg-sunk lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 pt-3">
            {identity}
            <Link href="/projetos/novo" className="btn btn-primary btn-sm shrink-0">
              <Plus size={15} />
              Publicar
            </Link>
          </div>
          <PainelNav counts={counts} horizontal />
        </div>
        <div className="px-4 py-8 sm:px-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
