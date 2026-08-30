import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, Clock, Award } from "lucide-react";

import { getProfessional } from "@/lib/directory";
import { projectsByProfessional } from "@/lib/projects";
import { specialtyLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { SpecialtyIcon } from "@/components/specialty-visual";
import { ProjectCard } from "@/components/project-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pro = await getProfessional(slug);
  return { title: pro ? pro.displayName : "Perfil" };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pro = await getProfessional(slug);
  if (!pro) notFound();

  const projects = await projectsByProfessional(slug);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-11">
      <Link
        href="/profissionais"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={14} />
        Profissionais
      </Link>

      <header className="mt-4 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-green-weak text-green-ink">
          <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={30} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {pro.displayName}
            </h1>
            {pro.verified && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-ink">
                <BadgeCheck size={16} />
                Verificado
              </span>
            )}
            {pro.plan === "pro" && <Badge tone="green">PRO</Badge>}
          </div>
          <p className="mt-1 text-ink-soft">{pro.headline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {pro.city}/{pro.uf}
            </span>
            {pro.responseHours ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                responde em ~{pro.responseHours}h
              </span>
            ) : null}
            {pro.score != null ? (
              <span className="inline-flex items-center gap-1">
                <Award size={14} />
                Patrinu Score {pro.score}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
        >
          Entrar em contato
        </button>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <section>
            <h2 className="text-lg font-bold">Sobre</h2>
            <p className="mt-2 text-ink-soft">{pro.bio}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-bold">
              Portfólio {projects.length > 0 && `(${projects.length})`}
            </h2>
            {projects.length > 0 ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Nenhum projeto documentado ainda. No MVP, o portfólio puxa dos Projetos em
                que a pessoa é creditada.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-[84px] lg:h-max space-y-5">
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Especialidades
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pro.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-sunk px-2 py-0.5 text-xs font-semibold text-ink-soft"
                >
                  {specialtyLabel(s)}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Técnicas
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{pro.techniques.join(" · ")}</p>
          </div>
          {pro.registros.length > 0 && (
            <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Registros
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{pro.registros.join(" · ")}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
