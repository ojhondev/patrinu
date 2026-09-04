"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const pathname = usePathname();
  // sempre aparece a cada visita — o "Entendi" só fecha nesta navegação.
  const [open, setOpen] = useState(true);

  if (!open || pathname.startsWith("/master")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-surface/98 px-4 py-4 shadow-[var(--shadow-pop)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between lg:px-5">
        <p className="flex items-start gap-2.5 text-sm text-ink-soft">
          <Cookie size={18} className="mt-0.5 shrink-0 text-green-ink" />
          <span>
            Usamos cookies essenciais para o Patrinu funcionar (login, sessão e preferências).
            Não usamos cookies de publicidade ou rastreamento de terceiros. Saiba mais na nossa{" "}
            <Link href="/cookies" className="font-semibold text-green-ink hover:underline">
              Política de Cookies
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="font-semibold text-green-ink hover:underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-primary btn-sm w-full shrink-0 sm:w-auto"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
