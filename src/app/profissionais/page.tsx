import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck, Sparkles, MapPin, SlidersHorizontal } from "lucide-react";

import { listProfessionals } from "@/lib/directory";
import { ProRow } from "@/components/pro-row";
import { SpecialtyIcon } from "@/components/specialty-visual";
import { HeaderSearch } from "@/components/header-search";
import { CATEGORY_GROUPS, groupLabel, specialtyLabel } from "@/lib/categories";
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
  const grupo = one(sp.grupo);
  const specialty = one(sp.specialty);
  const uf = one(sp.uf);
  const verifiedOnly = one(sp.verified) === "1";
  const proOnly = one(sp.pro) === "1";

  let pros = await listProfessionals({ q, grupo, specialty, uf, verifiedOnly });
  if (proOnly) pros = pros.filter((p) => p.pro);

  const noFilters = !q && !grupo && !specialty && !uf && !verifiedOnly && !proOnly;
  const featured = noFilters ? pros.filter((p) => p.pro).slice(0, 3) : [];
  const activeCount =
    [grupo, specialty, uf].filter(Boolean).length + (verifiedOnly ? 1 : 0) + (proOnly ? 1 : 0);

  const activeGroup = CATEGORY_GROUPS.find((g) => g.key === grupo);

  const qs = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({
      q,
      grupo,
      specialty,
      uf,
      verified: verifiedOnly ? "1" : undefined,
      pro: proOnly ? "1" : undefined,
      ...next,
    }))
      if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/profissionais?${s}` : "/profissionais";
  };

  return (
    <div>
      <header className="border-b border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11 lg:py-14">
          <p className="kicker text-muted">Diretório curado</p>
          <h1 className="display mt-2 max-w-3xl text-3xl text-ink sm:text-5xl">
            {q ? (
              <>
                Profissionais <span className="accent font-medium text-green-ink">“{q}”</span>
              </>
            ) : activeGroup ? (
              <>
                <span className="accent font-medium text-green-ink">{activeGroup.label}</span>
              </>
            ) : (
              <>
                Quem restaura o <span className="accent font-medium text-green-ink">patrimônio</span>{" "}
                do Brasil
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Restauradores, conservadores, ateliês e escritórios — perfil, portfólio e reputação
            verificável.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
        <div className="mb-6 max-w-xl lg:hidden">
          <Suspense>
            <HeaderSearch compact defaultValue={q ?? ""} />
          </Suspense>
        </div>

        {(() => {
          const filterBody = (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Selo</p>
              <div className="mt-2 flex flex-wrap gap-2 lg:block lg:space-y-1.5">
                <Link
                  href={qs({ verified: verifiedOnly ? undefined : "1" })}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-sm font-semibold lg:border-0 lg:px-0 lg:py-0",
                    verifiedOnly
                      ? "border-green-ink bg-green-weak text-green-ink lg:bg-transparent"
                      : "border-border-strong text-ink-soft hover:text-ink lg:border-0",
                  )}
                >
                  <BadgeCheck size={15} />
                  Só verificados
                </Link>
                <Link
                  href={qs({ pro: proOnly ? undefined : "1" })}
                  className={cn(
                    "inline-flex items-center rounded-pill border px-3 py-1 text-sm font-semibold lg:block lg:border-0 lg:px-0 lg:py-0",
                    proOnly
                      ? "border-green-ink bg-green-weak text-green-ink lg:bg-transparent"
                      : "border-border-strong text-ink-soft hover:text-ink lg:border-0",
                  )}
                >
                  Só Membros Pro
                </Link>
              </div>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-muted lg:mt-6">
                Categoria
              </p>
              <div className="mt-2 max-h-[42vh] space-y-0.5 overflow-y-auto pr-1 lg:max-h-[70vh]">
                <Link
                  href={qs({ grupo: undefined, specialty: undefined })}
                  className={cn(
                    "block rounded-btn px-2 py-1.5 text-sm",
                    !grupo
                      ? "bg-sunk font-bold text-ink"
                      : "text-ink-soft hover:bg-sunk hover:text-ink",
                  )}
                >
                  Todas as categorias
                </Link>
                {CATEGORY_GROUPS.map((g) => {
                  const on = grupo === g.key;
                  return (
                    <div key={g.key}>
                      <Link
                        href={qs({ grupo: on ? undefined : g.key, specialty: undefined })}
                        className={cn(
                          "block rounded-btn px-2 py-1.5 text-sm",
                          on
                            ? "bg-green-weak font-bold text-green-ink"
                            : "text-ink-soft hover:bg-sunk hover:text-ink",
                        )}
                      >
                        {g.label}
                      </Link>
                      {on && (
                        <div className="ml-2 border-l border-border pl-2">
                          {g.specialties.map((s) => (
                            <Link
                              key={s.key}
                              href={qs({ specialty: specialty === s.key ? undefined : s.key })}
                              className={cn(
                                "block rounded-btn px-2 py-1 text-[13px]",
                                specialty === s.key
                                  ? "font-bold text-green-ink"
                                  : "text-ink-soft hover:text-ink",
                              )}
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {activeCount + (q ? 1 : 0) > 0 && (
                <Link
                  href="/profissionais"
                  className="mt-5 inline-block text-sm font-semibold text-crit hover:underline lg:mt-6"
                >
                  Limpar filtros
                </Link>
              )}
            </>
          );

          return (
            <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
              {/* mobile: recolhido atrás de um "Filtros" */}
              <details className="rounded-card border border-border bg-surface lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-ink">
                  <span className="inline-flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-green-ink" />
                    Filtros
                    {activeCount > 0 && (
                      <span className="rounded-pill bg-green-weak px-2 py-0.5 text-[11px] font-bold text-green-ink">
                        {activeCount}
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-semibold text-muted">abrir / fechar</span>
                </summary>
                <div className="border-t border-border p-4">{filterBody}</div>
              </details>

              {/* desktop: sidebar fixa */}
              <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-max lg:self-start">
                {filterBody}
              </aside>

          <div>
            {featured.length > 0 && (
              <section className="mb-8">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
                  <Sparkles size={13} />
                  Em destaque · Membros Pro
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  {featured.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/profissionais/${p.slug}`}
                      className="card card-hover flex flex-col items-center gap-2 p-4 text-center"
                    >
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="h-14 w-14 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-green-weak text-green-ink">
                          <SpecialtyIcon specialty={p.specialties[0] ?? "arquitetura"} size={24} />
                        </span>
                      )}
                      <span className="font-display text-sm font-bold leading-tight text-ink">
                        {p.displayName}
                      </span>
                      <span className="line-clamp-2 text-xs text-ink-soft">{p.headline}</span>
                      <span className="mt-auto inline-flex items-center gap-1 text-[11px] text-muted">
                        <MapPin size={11} />
                        {p.city}/{p.uf}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <p className="border-b border-border pb-3 text-sm text-ink-soft">
              <strong className="font-bold text-ink tabular-nums">{pros.length}</strong>{" "}
              {pros.length === 1 ? "profissional" : "profissionais"}
              {specialty ? ` · ${specialtyLabel(specialty)}` : grupo ? ` · ${groupLabel(grupo)}` : ""}
            </p>

            {pros.length === 0 ? (
              <div className="mt-6 rounded-card border border-dashed border-border-strong px-6 py-16 text-center text-sm text-ink-soft">
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
          );
        })()}
      </div>
    </div>
  );
}
