import type { ReactNode } from "react";

/** Prosa jurídica padrão (política/termos) — sem plugin de typography. */
export function LegalArticle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-11">
      <div className="space-y-10 text-[15px] leading-relaxed text-ink-soft [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-3 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-semibold [&_a]:text-green-ink [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}

export function LegalUpdated({ date }: { date: string }) {
  return <p className="text-xs text-muted">Última atualização: {date}.</p>;
}
