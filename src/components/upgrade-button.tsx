"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

/** Demo: "assina" o Pro setando o cookie de plano. Sem cobrança real —
 *  a cobrança entra com a autenticação e o checkout. */
export function UpgradeButton({
  label = "Assinar o Patrinu Pro",
  className,
  variant = "solid",
}: {
  label?: string;
  className?: string;
  variant?: "solid" | "outline";
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = "patrinu_plan=pro; path=/; max-age=31536000";
        router.refresh();
      }}
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
    </button>
  );
}
