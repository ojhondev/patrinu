import { cn } from "@/lib/cn";

export function Wordmark({
  className,
  dotClassName,
}: {
  className?: string;
  dotClassName?: string;
}) {
  return (
    <span className={cn("font-display font-extrabold tracking-tight lowercase", className)}>
      patrinu
      <span className={cn("text-green", dotClassName)}>.</span>
    </span>
  );
}
