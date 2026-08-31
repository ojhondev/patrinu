import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, Clock, Award } from "lucide-react";

import { getProfessional } from "@/lib/directory";
import { projectsByProfessional } from "@/lib/projects";
import { specialtyLabel } from "@/lib/taxonomy";
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
        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={13} />
        Profissionais
      </Link>

      <header className="rule mt-4 flex flex-col gap-4 pb-6 sm:flex-row sm:items-start">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-green-weak text-green-ink">
          <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={34} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-3xl text-ink sm:text-4xl">{pro.displayName}</h1>
            {pro.verified && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-ink">
                <BadgeCheck size={16} />
                Verificado
              </span>
            )}
            {pro.plan === "pro" && (
              <span className="bg-band px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                Membro
              </span>
            )}
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
          className="btn-museum shrink-0"
        >
          Entrar em contato
        </button>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <section>
            <h2 className="kicker text-muted">Sobre</h2>
            <p className="mt-2 text-ink-soft">{pro.bio}</p>
          </section>

          <section className="mt-8">
            <h2 className="kicker text-muted">
              Portfólio {projects.length > 0 && `(${projects.length})`}
            </h2>
            {projects.length > 0 ? (
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
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
          <div className="border border-ink/12 bg-surface p-4">
            <h3 className="kicker text-muted">
              Especialidades
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pro.specialties.map((s) => (
                <span
                  key={s}
                  className="border border-ink/15 px-2 py-0.5 text-xs text-ink-soft"
                >
                  {specialtyLabel(s)}
                </span>
              ))}
            </div>
          </div>
          <div className="border border-ink/12 bg-surface p-4">
            <h3 className="kicker text-muted">
              Técnicas
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{pro.techniques.join(" · ")}</p>
          </div>
          {pro.registros.length > 0 && (
            <div className="border border-ink/12 bg-surface p-4">
              <h3 className="kicker text-muted">
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
