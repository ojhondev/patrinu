import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";

import { listProfessionals } from "@/lib/directory";
import { ProfessionalCard } from "@/components/professional-card";
import { CategoryRail } from "@/components/category-rail";
import { HeaderSearch } from "@/components/header-search";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Profissionais",
  description:
    "Diretório de restauradores, conservadores, ateliês e escritórios de restauro do Brasil.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = one(sp.q);
  const specialty = one(sp.specialty);
  const uf = one(sp.uf);
  const verifiedOnly = one(sp.verified) === "1";
  const pros = await listProfessionals({ q, specialty, uf, verifiedOnly });

  const qs = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, specialty, uf, ...next })) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/profissionais?${s}` : "/profissionais";
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {q ? (
            <>
              Profissionais: <span className="accent">“{q}”</span>
            </>
          ) : (
            "Profissionais"
          )}
        </h1>
        <p className="mt-1 text-ink-soft">
          Restauradores, conservadores, ateliês e escritórios. Perfil, portfólio e
          reputação verificável.
        </p>
      </header>

      <div className="mb-5 max-w-xl lg:hidden">
        <Suspense>
          <HeaderSearch compact defaultValue={q ?? ""} />
        </Suspense>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={qs({ verified: verifiedOnly ? undefined : "1" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            verifiedOnly
              ? "border-green bg-green text-white"
              : "border-border-strong text-ink hover:border-green-ink",
          )}
        >
          <BadgeCheck size={15} />
          Só verificados
        </Link>
      </div>

      <div className="mb-6 border-b border-border pb-3">
        <CategoryRail base="/profissionais" />
      </div>

      <p className="mb-3 text-sm text-ink-soft">
        <strong className="font-bold text-ink tabular-nums">{pros.length}</strong>{" "}
        {pros.length === 1 ? "profissional" : "profissionais"}
      </p>

      {pros.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
          Nenhum profissional com esses filtros.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pros.map((pro) => (
            <ProfessionalCard key={pro.slug} pro={pro} />
          ))}
        </div>
      )}
    </div>
  );
}
