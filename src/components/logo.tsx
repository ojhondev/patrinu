import { cn } from "@/lib/cn";

/** Logo Patrinu (lockup). Arquivo em /public/logo-patrinu.png (1219×293).
 *  PNG estático de ~12 KB — `<img>` puro é adequado, sem otimização do next/image. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-patrinu.png"
      alt="Patrinu"
      width={1219}
      height={293}
      className={cn("w-auto", className)}
    />
  );
}
