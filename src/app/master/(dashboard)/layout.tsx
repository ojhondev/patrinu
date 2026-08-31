import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { isMasterSession } from "@/lib/auth";
import { masterOverview } from "@/lib/master";
import { logoutMaster } from "../actions";
import { MasterNav } from "@/components/master-nav";

export const metadata: Metadata = { title: "Master", robots: { index: false } };
export const maxDuration = 60;

export default async function MasterLayout({ children }: { children: ReactNode }) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const ov = await masterOverview();

  const badges = {
    moderacao: ov.queue.projetos + ov.queue.editais + ov.queue.noticias,
    contas: ov.banned,
    financiamento: ov.queue.financiamento,
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/12 bg-sunk lg:flex">
        <div className="flex items-center gap-2 border-b border-ink/12 px-5 py-5">
          <ShieldCheck size={20} className="text-green-ink" />
          <span className="font-display text-lg font-bold tracking-tight">Master</span>
        </div>
        <MasterNav badges={badges} />
        <form action={logoutMaster} className="border-t border-ink/12 p-3">
          <button
            type="submit"
            className="w-full border border-ink/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:border-ink hover:text-ink"
          >
            Sair
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        {/* nav mobile */}
        <div className="border-b border-ink/12 lg:hidden">
          <MasterNav badges={badges} horizontal />
        </div>
        <div className="px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
