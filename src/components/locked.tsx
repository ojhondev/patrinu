import Link from "next/link";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Borra o conteúdo e mostra um CTA quando o visitante não tem plano suficiente.
 *  A "informação ouro" (valores, nomes de contratante/empresa) é borrada, não
 *  removida — para forçar a assinatura. */
export function Locked({
  locked,
  children,
  cta = "Assine para ver",
  href = "/empresas",
  block = false,
  asLabel = false,
  className,
}: {
  locked: boolean;
  children: ReactNode;
  cta?: string;
  href?: string;
  block?: boolean;
  /** true = renderiza o CTA como <span> (para uso dentro de um <Link>). */
  asLabel?: boolean;
  className?: string;
}) {
  if (!locked) return <>{children}</>;

  const badge =
    "inline-flex items-center gap-1 rounded-md border border-green bg-surface px-2 py-0.5 text-[11px] font-bold text-green-ink shadow-sm";

  return (
    <span className={cn("relative", block ? "block" : "inline-block", className)}>
      <span aria-hidden className="pointer-events-none select-none blur-[5px]">
        {children}
      </span>
      <span className="absolute inset-0 z-10 grid place-items-center">
        {asLabel ? (
          <span className={badge}>
            <Lock size={11} />
            {cta}
          </span>
        ) : (
          <Link href={href} className={cn(badge, "hover:bg-green hover:text-white")}>
            <Lock size={11} />
            {cta}
          </Link>
        )}
      </span>
    </span>
  );
}

/** Camada cheia sobre um bloco inteiro (ex.: o Radar de Editais para não-Pro). */
export function LockedPanel({
  children,
  title,
  body,
  href = "/empresas",
  cta = "Assinar o Patrinu Pro",
}: {
  children: ReactNode;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none blur-[6px]">
        {children}
      </div>
      {/* overlay: no desktop fica centrado; no mobile o card gruda no topo e
          acompanha a rolagem até o fim da seção (position: sticky). */}
      <div className="absolute inset-0 z-10 flex justify-center bg-bg/40 p-4">
        <div className="sticky top-20 h-max max-w-sm self-start rounded-[var(--radius-card)] border border-green/40 bg-surface p-6 text-center shadow-[var(--shadow-pop)] lg:static lg:self-center">
          <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-green-weak text-green-ink">
            <Lock size={18} />
          </span>
          <h3 className="mt-3 font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-soft">{body}</p>
          <Link
            href={href}
            className="mt-4 inline-block rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
