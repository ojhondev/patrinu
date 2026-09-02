import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk, Fraunces } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SignupPopup } from "@/components/signup-popup";
import { AnnouncementBar } from "@/components/announcement-bar";
import { CookieConsent } from "@/components/cookie-consent";
import { ShareBar } from "@/components/share-bar";
import { CreditsWidget } from "@/components/credits-widget";
import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { creditStatus } from "@/lib/credits";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Patrinu — o Radar do Patrimônio e Restauro do Brasil",
    template: "%s · Patrinu",
  },
  description:
    "Projetos, profissionais, notícias, cursos, editais e financiamento do restauro brasileiro, num só lugar. A rede profissional e o marketplace do patrimônio.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Patrinu",
    locale: "pt_BR",
    url: SITE_URL,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [user, master] = await Promise.all([getCurrentUser(), isMasterSession()]);
  const account = master
    ? { name: "Master", plan: "pro" as const, master: true, avatarUrl: null }
    : user
      ? { name: user.name, plan: user.plan, master: false, avatarUrl: user.avatarUrl }
      : null;

  const credits =
    user && !master && user.plan !== "pro"
      ? await creditStatus(user.id, false)
      : null;

  return (
    <html
      lang="pt-BR"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <AnnouncementBar />
        <SiteHeader account={account} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {!account && <SignupPopup />}
        {credits && <CreditsWidget used={credits.used} limit={credits.limit} />}
        <ShareBar />
        <CookieConsent />
      </body>
    </html>
  );
}
