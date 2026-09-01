"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/** muda a key quando trocar a promoção — evita esconder um anúncio novo por
 *  causa de um "fechar" antigo salvo no navegador do visitante. */
const KEY = "patrinu_promo_anual60_dismissed";

export function AnnouncementBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hideOn = pathname.startsWith("/master");

  useEffect(() => {
    if (hideOn) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {}
    if (!dismissed) setOpen(true);
  }, [hideOn]);

  if (!open || hideOn) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div className="band relative flex items-center justify-center gap-2 px-10 py-2.5 text-center text-[13px] font-semibold text-white sm:text-sm">
      <Link href="/pro" className="hover:underline">
        Assine anual e aproveite <span className="accent font-medium text-accent">até 60% OFF</span>{" "}
        no primeiro ano — planos Empresa e Profissional.
      </Link>
      <button
        type="button"
        onClick={close}
        aria-label="Fechar aviso"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill p-1 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X size={15} />
      </button>
    </div>
  );
}
