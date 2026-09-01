import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Pílula de filtro. Renderiza <button>. */
export function Chip({
  children,
  active,
  className,
  ...rest
}: { children: ReactNode; active?: boolean; className?: string } & Omit<
  ComponentProps<"button">,
  "className" | "children"
>) {
  return (
    <button
      type="button"
      className={cn("chip", active && "is-active", className)}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Pílula de categoria, como link. */
export function ChipLink({
  children,
  active,
  className,
  ...rest
}: { children: ReactNode; active?: boolean; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "className" | "children"
>) {
  return (
    <Link className={cn("chip", active && "is-active", className)} {...rest}>
      {children}
    </Link>
  );
}
