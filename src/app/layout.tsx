import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk, Fraunces } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser, isMasterSession } from "@/lib/auth";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: {
    default: "Patrinu — o Radar do Patrimônio e Restauro do Brasil",
    template: "%s · Patrinu",
  },
  description:
    "Projetos, profissionais, notícias, cursos, editais e financiamento do restauro brasileiro, num só lugar. A rede profissional e o marketplace do patrimônio.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [user, master] = await Promise.all([getCurrentUser(), isMasterSession()]);
  const account = master
    ? { name: "Master", plan: "pro" as const, master: true }
    : user
      ? { name: user.name, plan: user.plan, master: false }
      : null;

  return (
    <html
      lang="pt-BR"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <SiteHeader account={account} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
