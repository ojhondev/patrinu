import type { ReactNode } from "react";

/**
 * Cabeçalho editorial de página (pass de arte MASP).
 * `tone="band"`  → bloco vinho da marca, texto branco (páginas-farol)
 * `tone="paper"` → fundo claro com régua grossa em cima (páginas utilitárias)
 */
export function PageHero({
  eyebrow,
  title,
  children,
  tone = "paper",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "band" | "paper";
}) {
  if (tone === "band") {
    return (
      <section className="band band-hairlines">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-20">
          {eyebrow ? <p className="kicker text-accent">{eyebrow}</p> : null}
          <h1 className="display mt-3 max-w-4xl text-4xl text-white sm:text-6xl">
            {title}
          </h1>
          {children ? (
            <div className="mt-4 max-w-2xl text-white/70">{children}</div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-border bg-sunk">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11 lg:py-14">
        {eyebrow ? <p className="kicker text-muted">{eyebrow}</p> : null}
        <h1 className="display mt-2 max-w-4xl text-3xl text-ink sm:text-5xl">{title}</h1>
        {children ? (
          <div className="mt-3 max-w-2xl text-lg text-ink-soft">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
