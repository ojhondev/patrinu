import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, MapPin, CalendarClock } from "lucide-react";

import { getProject, listProjects } from "@/lib/projects";
import {
  daysUntil,
  formatDate,
  projectStatusLabel,
  specialtyLabel,
} from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { ProjectCard } from "@/components/project-card";
import { Locked } from "@/components/locked";
import { ProjectActions } from "@/components/project-actions";
import { getPlan } from "@/lib/membership";
import { getCurrentUser } from "@/lib/auth";
import { getProjectRaw } from "@/lib/projects";
import { hasInterest, hasProposal } from "@/lib/interactions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return { title: p ? p.title : "Projeto" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();

  const open = p.status === "aberto" || p.status === "em_captacao";
  const d = daysUntil(p.deadlineAt);
  const plan = await getPlan();
  const canSeeValue = plan !== "visitante"; // valores só para membros cadastrados
  const canPropose = plan === "pro"; // enviar proposta exige Pro

  const user = await getCurrentUser();
  const raw = open ? await getProjectRaw(slug) : null;
  const isOwner = Boolean(user && raw?.ownerId === user.id);
  const [alreadyInterested, alreadyProposed] =
    user && raw
      ? await Promise.all([hasInterest(raw.id, user.id), hasProposal(raw.id, user.id)])
      : [false, false];

  const all = await listProjects({});
  const related = all
    .filter((x) => x.slug !== p.slug && x.specialties.some((s) => p.specialties.includes(s)))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-11">
      <nav className="flex items-center gap-1.5 text-sm text-ink-soft">
        <Link href="/projetos" className="inline-flex items-center gap-1 hover:text-ink">
          <ArrowLeft size={14} />
          Projetos
        </Link>
        <ChevronRight size={13} className="text-muted" />
        <Link
          href={`/projetos?specialty=${p.specialties[0]}`}
          className="hover:text-ink"
        >
          {specialtyLabel(p.specialties[0] ?? "arquitetura")}
        </Link>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green">{projectStatusLabel(p.status)}</Badge>
            {p.specialties.map((s) => (
              <Badge key={s} tone="neutral">
                {specialtyLabel(s)}
              </Badge>
            ))}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight text-balance sm:text-[32px]">
            {p.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {p.city}/{p.uf}
            </span>
            {p.year ? <span>Concluído em {p.year}</span> : null}
            <span className="font-semibold text-ink">{p.assetName}</span>
          </div>

          <SpecialtyThumb
            specialty={p.specialties[0] ?? "arquitetura"}
            className="mt-6 aspect-[16/8] w-full rounded-[var(--radius-card)]"
          />
          <p className="mt-2 text-xs text-muted">
            Galeria antes/durante/depois — no MVP, imagens licenciadas dos projetos curados.
          </p>

          <section className="mt-8">
            <h2 className="text-lg font-bold">Sobre o projeto</h2>
            <p className="mt-2 text-ink-soft">{p.summary}</p>
          </section>

          {p.techniques.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">Técnicas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {p.materials && p.materials.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">Materiais</h2>
              <p className="mt-2 text-sm text-ink-soft">{p.materials.join(" · ")}</p>
            </section>
          )}

          {open && p.requirements && (
            <section className="mt-6 rounded-[var(--radius-card)] border border-border bg-surface p-5">
              <h2 className="text-lg font-bold">Requisitos para propor</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
                {p.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* side */}
        <aside className="lg:sticky lg:top-[84px] lg:h-max">
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-bold">Créditos</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {p.credits.map((c) => (
                <li key={c.role}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {c.role}
                  </p>
                  {c.slug ? (
                    <Link
                      href={`/profissionais/${c.slug}`}
                      className="font-semibold text-green-ink hover:underline"
                    >
                      {c.name}
                    </Link>
                  ) : (
                    <Locked
                      locked={c.role.toLowerCase().includes("institui") && plan === "visitante"}
                      cta="Assine para ver"
                      href="/pro"
                    >
                      <span className="font-semibold text-ink">{c.name}</span>
                    </Locked>
                  )}
                </li>
              ))}
            </ul>

            {open ? (
              <>
                {p.budgetRange && (
                  <p className="mt-5 border-t border-border pt-4 text-sm">
                    <span className="text-ink-soft">Orçamento: </span>
                    <Locked locked={!canSeeValue} cta="Cadastre-se para ver" href="/pro">
                      <strong className="text-ink">{p.budgetRange}</strong>
                    </Locked>
                  </p>
                )}
                {d != null && d >= 0 && (
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-warn">
                    <CalendarClock size={14} />
                    {d} dias para propor
                  </p>
                )}
                <ProjectActions
                  slug={p.slug}
                  loggedIn={Boolean(user)}
                  canPropose={canPropose}
                  isOwner={isOwner}
                  alreadyInterested={alreadyInterested}
                  alreadyProposed={alreadyProposed}
                />
              </>
            ) : (
              <p className="mt-5 border-t border-border pt-4 text-sm text-ink-soft">
                Projeto publicado como referência. {formatDate(p.publishedAt)}.
              </p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Projetos relacionados
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProjectCard key={r.id} project={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
