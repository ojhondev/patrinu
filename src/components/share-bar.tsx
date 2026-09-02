"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

import { SITE_URL } from "@/lib/site";

const KEY = "patrinu_sharebar_closed";

export function ShareBar() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(true);

  const hideOn =
    pathname.startsWith("/master") ||
    pathname.startsWith("/painel") ||
    pathname.startsWith("/noticias/"); // a página de notícia tem a sua própria

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {}
    setClosed(dismissed);
  }, []);

  if (hideOn || closed) return null;

  const text = `Conheça o Patrinu — o radar do patrimônio e restauro do Brasil: ${SITE_URL}`;
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-[#128C7E] text-white print:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-5">
        <MessageCircle size={18} className="shrink-0" />
        <p className="flex-1 text-sm font-medium">
          Gostou do Patrinu? Compartilhe com quem trabalha com patrimônio.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-pill bg-white px-3.5 py-1.5 text-sm font-bold text-[#128C7E] hover:bg-white/90"
        >
          Compartilhar no WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {}
            setClosed(true);
          }}
          className="shrink-0 text-white/80 hover:text-white"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
