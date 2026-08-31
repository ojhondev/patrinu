import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardCheck,
  BadgeCheck,
  Users,
  Wallet,
  Landmark,
  Settings,
} from "lucide-react";

import { isMasterSession } from "@/lib/auth";
import { masterOverview } from "@/lib/master";
import { logoutMaster } from "../actions";
import { MasterNav } from "@/components/master-nav";

export const metadata: Metadata = { title: "Master", robots: { index: false } };
export const maxDuration = 60;

export default async function MasterLayout({ children }: { children: ReactNode }) {
  if (!(await isMasterSession())) redirect("/master/entrar");
  const ov = await masterOverview();

  const nav = [
    { href: "/master", label: "Visão geral", icon: LayoutDashboard, badge: 0 },
    { href: "/master/moderacao", label: "Moderação", icon: ClipboardCheck, badge: ov.queue.projetos + ov.queue.editais + ov.queue.noticias },
    { href: "/master/profissionais", label: "Profissionais", icon: BadgeCheck, badge: 0 },
    { href: "/master/contas", label: "Contas", icon: Users, badge: ov.banned },
    { href: "/master/financeiro", label: "Financeiro", icon: Wallet, badge: 0 },
    { href: "/master/financiamento", label: "Financiamento", icon: Landmark, badge: ov.queue.financiamento },
    { href: "/master/config", label: "Configurações", icon: Settings, badge: 0 },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/12 bg-sunk lg:flex">
        <div className="flex items-center gap-2 border-b border-ink/12 px-5 py-5">
          <ShieldCheck size={20} className="text-green-ink" />
          <span className="font-display text-lg font-bold tracking-tight">Master</span>
        </div>
        <MasterNav items={nav} />
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
          <MasterNav items={nav} horizontal />
        </div>
        <div className="px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
