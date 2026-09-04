"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

import { SITE_URL } from "@/lib/site";

export function ShareBar() {
  const pathname = usePathname();
  // sempre aparece a cada visita — o X só fecha nesta navegação.
  const [closed, setClosed] = useState(false);

  const hideOn =
    pathname.startsWith("/master") ||
    pathname.startsWith("/painel") ||
    pathname.startsWith("/noticias/"); // a página de notícia tem a sua própria

  if (hideOn || closed) return null;

  const text = `Conheça o Patrinu — o radar do patrimônio e restauro do Brasil: ${SITE_URL}`;
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-[#128C7E] text-white print:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-6 lg:px-5">
        <MessageCircle size={18} className="shrink-0" />
        <p className="flex-1 text-[13px] font-medium sm:text-sm">
          <span className="hidden sm:inline">
            Gostou do Patrinu? Compartilhe com quem trabalha com patrimônio.
          </span>
          <span className="sm:hidden">Compartilhe o Patrinu no WhatsApp</span>
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap rounded-pill bg-white px-3 py-1.5 text-[13px] font-bold text-[#128C7E] hover:bg-white/90 sm:text-sm"
        >
          <span className="hidden sm:inline">Compartilhar no WhatsApp</span>
          <span className="sm:hidden">Compartilhar</span>
        </a>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="shrink-0 text-white/80 hover:text-white"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
