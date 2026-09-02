import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

/** CTA para a página de planos. A liberação do Pro é feita pelo servidor
 *  (webhook do Mercado Pago → `users.plan`), nunca por cookie do cliente. */
export function UpgradeButton({
  label = "Torne-se membro",
  className,
  variant = "solid",
  href = "/pro",
}: {
  label?: string;
  className?: string;
  variant?: "solid" | "outline";
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-colors",
        variant === "solid"
          ? "bg-green text-white hover:bg-green-hover"
          : "border border-green text-green-ink hover:bg-green hover:text-white",
        className,
      )}
    >
      <Sparkles size={16} />
      {label}
    </Link>
  );
}
