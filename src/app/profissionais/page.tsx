import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";

import { listProfessionals } from "@/lib/directory";
import { ProRow } from "@/components/pro-row";
import { HeaderSearch } from "@/components/header-search";
import { SPECIALTIES, type SpecialtyKey } from "@/lib/taxonomy";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Profissionais",
  description:
    "O diretório curado de restauradores, conservadores, ateliês e escritórios de restauro do Brasil.",
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
  const proOnly = one(sp.pro) === "1";

  let pros = await listProfessionals({ q, specialty, uf, verifiedOnly });
  if (proOnly) pros = pros.filter((p) => p.plan === "pro");

  const qs = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, specialty, uf, verified: verifiedOnly ? "1" : undefined, pro: proOnly ? "1" : undefined, ...next }))
      if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/profissionais?${s}` : "/profissionais";
  };

  return (
    <div>
      <header className="band band-hairlines">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11 lg:py-16">
          <p className="kicker text-accent">Diretório curado</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-5xl">
            {q ? (
              <>
                Profissionais <span className="accent text-accent">“{q}”</span>
              </>
            ) : (
              <>
                Quem restaura o <span className="accent text-accent">patrimônio</span> do
                Brasil
              </>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Restauradores, conservadores, ateliês e escritórios — perfil, portfólio e
            reputação verificável. Selo por registro, obra documentada ou verificação
            completa.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="mb-6 max-w-xl lg:hidden">
          <Suspense>
            <HeaderSearch compact defaultValue={q ?? ""} />
          </Suspense>
        </div>

        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          {/* sidebar de filtros */}
          <aside className="lg:sticky lg:top-24 lg:h-max">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Selo
            </p>
            <div className="mt-2 space-y-1.5">
              <Link
                href={qs({ verified: verifiedOnly ? undefined : "1" })}
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold",
                  verifiedOnly ? "text-green-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <BadgeCheck size={15} />
                Só verificados
              </Link>
              <Link
                href={qs({ pro: proOnly ? undefined : "1" })}
                className={cn(
                  "block text-sm font-semibold",
                  proOnly ? "text-green-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                Só assinantes Pro
              </Link>
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-muted">
              Especialidade
            </p>
            <div className="mt-2 space-y-1">
              <Link
                href={qs({ specialty: undefined })}
                className={cn(
                  "block text-sm",
                  !specialty ? "font-bold text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                Todas
              </Link>
              {(Object.keys(SPECIALTIES) as SpecialtyKey[]).map((key) => (
                <Link
                  key={key}
                  href={qs({ specialty: specialty === key ? undefined : key })}
                  className={cn(
                    "block text-sm",
                    specialty === key
                      ? "font-bold text-green-ink"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {SPECIALTIES[key]}
                </Link>
              ))}
            </div>

            {(specialty || uf || verifiedOnly || proOnly || q) && (
              <Link
                href="/profissionais"
                className="mt-6 inline-block text-sm font-semibold text-crit hover:underline"
              >
                Limpar filtros
              </Link>
            )}
          </aside>

          {/* lista */}
          <div>
            <p className="border-b border-ink/15 pb-3 text-sm text-ink-soft">
              <strong className="font-bold text-ink tabular-nums">{pros.length}</strong>{" "}
              {pros.length === 1 ? "profissional" : "profissionais"}
            </p>

            {pros.length === 0 ? (
              <div className="mt-6 border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
                Nenhum profissional com esses filtros.
              </div>
            ) : (
              <div className="mt-2">
                {pros.map((pro) => (
                  <ProRow key={pro.slug} pro={pro} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
