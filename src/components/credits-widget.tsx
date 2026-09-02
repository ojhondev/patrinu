"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, X, Sparkles } from "lucide-react";

const KEY = "patrinu_credits_widget_closed";

export function CreditsWidget({ used, limit }: { used: number; limit: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(true);

  const hideOn = pathname.startsWith("/master") || pathname.startsWith("/painel");

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    setClosed(dismissed);
  }, []);

  if (hideOn || closed) return null;

  const remaining = Math.max(0, limit - used);

  return (
    <div className="fixed bottom-16 right-4 z-[80] print:hidden">
      {open ? (
        <div className="w-72 rounded-card border border-border bg-surface p-4 shadow-[var(--shadow-pop)]">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
              <Coins size={16} className="text-brand" />
              Créditos do mês
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-ink"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-3 text-2xl font-extrabold text-ink">
            {remaining}
            <span className="text-base font-semibold text-muted"> / {limit}</span>
          </p>
          <p className="text-xs text-muted">
            créditos grátis restantes. Publicar um projeto ou se candidatar a uma vaga custa 1
            crédito. Renova todo mês.
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-sunk">
            <span
              className="block h-full rounded-pill bg-brand"
              style={{ width: `${(remaining / limit) * 100}%` }}
            />
          </div>

          <Link href="/pro" className="btn btn-primary btn-sm mt-4 w-full">
            <Sparkles size={14} />
            Seja Pro — sem limites
          </Link>
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.setItem(KEY, "1");
              } catch {}
              setClosed(true);
            }}
            className="mt-2 w-full text-center text-xs text-muted hover:underline"
          >
            Não mostrar agora
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-bold text-ink shadow-[var(--shadow-pop)] hover:border-brand"
        >
          <Coins size={16} className="text-brand" />
          {remaining}/{limit} créditos
        </button>
      )}
    </div>
  );
}
