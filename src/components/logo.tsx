import { cn } from "@/lib/cn";

/** Logo Patrinu (wordmark). Arquivo em /public/logo-patrinu.png (881×222).
 *  PNG estático leve — `<img>` puro é adequado, sem otimização do next/image. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-patrinu.png"
      alt="Patrinu"
      width={881}
      height={222}
      className={cn("w-auto", className)}
    />
  );
}
