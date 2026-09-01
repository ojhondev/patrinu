import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Superfície de cartão: canto suave + sombra leve. `hover` eleva no hover. */
export function Card({
  children,
  className,
  hover,
  ...rest
}: { children: ReactNode; className?: string; hover?: boolean } & Omit<
  ComponentProps<"div">,
  "className" | "children"
>) {
  return (
    <div className={cn("card", hover && "card-hover", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardLink({
  children,
  className,
  hover = true,
  ...rest
}: { children: ReactNode; className?: string; hover?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "className" | "children"
>) {
  return (
    <Link className={cn("card", hover && "card-hover", className)} {...rest}>
      {children}
    </Link>
  );
}
