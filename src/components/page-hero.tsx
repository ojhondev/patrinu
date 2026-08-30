import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-sunk">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11 lg:py-16">
        {eyebrow ? (
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-ink">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {children ? (
          <div className="mt-3 max-w-2xl text-ink-soft">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
