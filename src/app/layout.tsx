import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk, Fraunces } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
    default: "Patrinu — o marketplace do patrimônio",
    template: "%s · Patrinu",
  },
  description:
    "Encontre e dispute todas as licitações, editais e chamamentos de restauro e conservação de patrimônio do Brasil. Monte a habilitação, forme consórcio e ganhe.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
