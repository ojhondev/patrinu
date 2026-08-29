import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Patrinu — o ecossistema digital do patrimônio",
    template: "%s · Patrinu",
  },
  description:
    "Radar de oportunidades e marketplace para o mercado de restauro e conservação de patrimônio no Brasil.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border mt-16">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted flex flex-wrap gap-x-8 gap-y-2 justify-between">
            <span>Patrinu · o ecossistema digital do patrimônio</span>
            <span className="font-mono text-xs">
              MVP · Radar + Marketplace · dados de demonstração
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
