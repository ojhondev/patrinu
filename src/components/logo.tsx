import { cn } from "@/lib/cn";

/** Logo Patrinu (lockup). Arquivo em /public/logo-patrinu.png (611×147). */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo-patrinu.png"
      alt="Patrinu"
      width={611}
      height={147}
      className={cn("w-auto", className)}
    />
  );
}
