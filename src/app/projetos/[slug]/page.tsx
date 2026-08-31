import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CalendarClock } from "lucide-react";

import { getProject, getProjectRaw, listProjects } from "@/lib/projects";
import { daysUntil, formatDate, projectStatusLabel, specialtyLabel } from "@/lib/taxonomy";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { ProjectCard } from "@/components/project-card";
import { Locked } from "@/components/locked";
import { ProjectActions } from "@/components/project-actions";
import { getPlan } from "@/lib/membership";
import { getCurrentUser } from "@/lib/auth";
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
  const canSeeValue = plan !== "visitante"; // valor: precisa de conta
  const isMember = plan === "pro"; // contratante: precisa ser membro
  const canPropose = plan === "pro";

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

  const images = p.images ?? [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <Link
        href={open ? "/oportunidades" : "/projetos"}
        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={13} />
        {open ? "Oportunidades" : "Projetos"}
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0">
          <p className="kicker text-green-ink">
            {projectStatusLabel(p.status)}
            {" · "}
            {p.specialties.map((s) => specialtyLabel(s)).join(" · ")}
          </p>
          <h1 className="display mt-3 text-3xl text-ink sm:text-5xl">{p.title}</h1>

          <div className="rule mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {p.city}/{p.uf}
            </span>
            {p.year ? <span>Concluído em {p.year}</span> : null}
            <span className="font-semibold text-ink">{p.assetName}</span>
          </div>

          {/* mídia */}
          {images.length > 0 ? (
            <div className="mt-6 space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0]}
                alt={p.title}
                className="aspect-[16/10] w-full border border-ink/12 object-cover"
              />
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {images.slice(1).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="aspect-square w-full border border-ink/12 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SpecialtyThumb
              specialty={p.specialties[0] ?? "arquitetura"}
              className="mt-6 aspect-[16/8] w-full"
            />
          )}

          {p.videoUrl && (
            <video
              src={p.videoUrl}
              controls
              playsInline
              className="mt-3 aspect-video w-full border border-ink/12 bg-black"
            />
          )}

          <section className="mt-8">
            <h2 className="kicker text-muted">Sobre o projeto</h2>
            <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-soft">{p.summary}</p>
          </section>

          {p.techniques.length > 0 && (
            <section className="mt-8">
              <h2 className="kicker text-muted">Técnicas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.techniques.map((t) => (
                  <span
                    key={t}
                    className="border border-ink/20 px-3 py-1 text-sm text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {p.materials && p.materials.length > 0 && (
            <section className="mt-8">
              <h2 className="kicker text-muted">Materiais</h2>
              <p className="mt-2 text-sm text-ink-soft">{p.materials.join(" · ")}</p>
            </section>
          )}

          {open && p.requirements && (
            <section className="mt-8 border border-ink/12 bg-surface p-5">
              <h2 className="kicker text-muted">Requisitos para propor</h2>
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
          <div className="border border-ink/12 bg-surface p-5">
            <h2 className="kicker text-muted">Créditos</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {p.credits.map((c) => (
                <li key={c.role}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
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
                      locked={open && !isMember}
                      cta="Seja membro para ver"
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
                  <p className="mt-5 border-t border-ink/12 pt-4 text-sm">
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
              <p className="mt-5 border-t border-ink/12 pt-4 text-sm text-ink-soft">
                Projeto publicado como referência. {formatDate(p.publishedAt)}.
              </p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t-4 border-brand pt-10">
          <h2 className="kicker text-muted">Projetos relacionados</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProjectCard key={r.id} project={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
