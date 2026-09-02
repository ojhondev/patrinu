"use client";

import { useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";

import { SITE_URL } from "@/lib/site";

export function NewsShareBar({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/noticias/${slug}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-[#128C7E] text-white print:hidden">
      <div className="mx-auto flex max-w-[760px] items-center gap-3 px-4 py-2.5 sm:px-6">
        <MessageCircle size={18} className="shrink-0" />
        <p className="flex-1 text-sm font-medium">Compartilhe essa notícia no WhatsApp</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-white/40 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? "Copiado" : "Copiar link"}
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-pill bg-white px-3.5 py-1.5 text-sm font-bold text-[#128C7E] hover:bg-white/90"
        >
          Compartilhar
        </a>
      </div>
    </div>
  );
}
