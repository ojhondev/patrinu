import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};
const SIZE: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

export function buttonClass(opts: {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
} = {}) {
  return cn(
    "btn",
    VARIANT[opts.variant ?? "primary"],
    SIZE[opts.size ?? "md"],
    opts.full && "w-full",
    opts.className,
  );
}

type BaseProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant,
  size,
  full,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClass({ variant, size, full, className })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClass({ variant, size, full, className })} {...rest}>
      {children}
    </Link>
  );
}
