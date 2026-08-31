import { cn } from "@/lib/cn";

/** Logo Patrinu (lockup). Arquivos em /public/logo-patrinu*.png.
 *  PNG estático leve — `<img>` puro é adequado, sem otimização do next/image.
 *  `variant="pro"` mostra o lockup "patrinupro." (usado na área de profissionais). */
export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "pro";
}) {
  const pro = variant === "pro";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pro ? "/logo-patrinupro.png" : "/logo-patrinu.png"}
      alt={pro ? "Patrinu Pro" : "Patrinu"}
      width={pro ? 1262 : 881}
      height={pro ? 227 : 222}
      className={cn("w-auto", className)}
    />
  );
}
