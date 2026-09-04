import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Lock } from "lucide-react";

import { getProject, getProjectRaw, listProjects, redactContratante } from "@/lib/projects";
import {
  formatDate,
  projectStatusLabel,
  specialtyLabel,
  contractTypeLabel,
  seniorityLabel,
  workModeLabel,
  formatSalary,
} from "@/lib/taxonomy";
import { SpecialtyThumb } from "@/components/specialty-visual";
import { ProjectCard } from "@/components/project-card";
import { VagaCard } from "@/components/vaga-card";
import { ProjectActions } from "@/components/project-actions";
import { ProjectGallery } from "@/components/project-gallery";
import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { hasInterest } from "@/lib/interactions";
import { creditStatus } from "@/lib/credits";

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

  const isVaga = p.entryKind === "vaga";
  const salary = formatSalary(p.salaryMin, p.salaryMax, p.salaryConfidential);
  const realOrg = p.credits[0]?.name ?? "—";

  const user = await getCurrentUser();
  const raw = isVaga ? await getProjectRaw(slug) : null;
  const isOwner = Boolean(user && raw?.ownerId === user.id);
  const alreadyApplied =
    user && raw ? await hasInterest(raw.id, user.id) : false;
  const isPro = (await getPlan()) === "pro";
  const isPaidPro = user?.plan === "pro";
  const credits = user ? await creditStatus(user.id, isPaidPro) : null;
  const canApply = isVaga
    ? isPaidPro || (credits ? credits.remaining > 0 : false)
    : true;
  // membros Pro (ou o dono) veem o nome e o contato do contratante
  const revealContratante = isPro || isOwner;
  const org = revealContratante ? realOrg : "Contratante reservado";
  const hasContato = Boolean(p.contactWhatsapp || p.contactEmail || p.locationNote);

  const all = await listProjects(
    isVaga ? { mode: "abertos", entryKind: "vaga" } : { mode: "vitrine", entryKind: "projeto" },
  );
  const related = all
    .filter((x) => x.slug !== p.slug && x.specialties.some((s) => p.specialties.includes(s)))
    .slice(0, 4)
    .map((x) => (isVaga && !isPro ? redactContratante(x) : x));

  const images = p.images ?? [];

  const meta = [
    p.contractType && contractTypeLabel(p.contractType),
    p.workMode && workModeLabel(p.workMode),
    p.seniority && seniorityLabel(p.seniority),
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-11">
      <Link
        href={isVaga ? "/vagas" : "/projetos"}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} />
        {isVaga ? "Vagas" : "Projetos"}
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0">
          {isVaga ? (
            <>
              <p className="text-sm font-medium text-muted">
                {org}
                {!revealContratante && (
                  <span className="ml-2 align-middle text-xs">
                    · nome visível para membros Pro
                  </span>
                )}
              </p>
              <h1 className="display mt-1 text-3xl text-ink sm:text-[42px]">{p.vagaRole ?? p.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {p.city}/{p.uf}
                </span>
                {meta.map((m) => (
                  <span key={m}>· {m}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-green-ink">
                {projectStatusLabel(p.status)}
                {" · "}
                {p.specialties.map((s) => specialtyLabel(s)).join(" · ")}
              </p>
              <h1 className="display mt-3 text-3xl text-ink sm:text-5xl">{p.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border py-3 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {p.city}/{p.uf}
                </span>
                {p.year ? <span>Concluído em {p.year}</span> : null}
                <span className="font-semibold text-ink">{p.assetName}</span>
              </div>
            </>
          )}

          {/* mídia (só vitrine) */}
          {!isVaga &&
            (images.length > 0 ? (
              <ProjectGallery images={images} title={p.title} />
            ) : (
              <SpecialtyThumb
                specialty={p.specialties[0] ?? "arquitetura"}
                className="mt-6 aspect-[16/8] w-full rounded-card"
              />
            ))}

          {!isVaga && p.videoUrl && (
            <video
              src={p.videoUrl}
              controls
              playsInline
              className="mt-3 aspect-video w-full rounded-card border border-border bg-black"
            />
          )}

          <section className="mt-8">
            <h2 className="kicker text-muted">{isVaga ? "Sobre a vaga" : "Sobre o projeto"}</h2>
            <p className="mt-2 whitespace-pre-line text-[1.05rem] leading-relaxed text-ink-soft">
              {p.summary}
            </p>
          </section>

          {p.specialties.length > 0 && (
            <section className="mt-8">
              <h2 className="kicker text-muted">
                {isVaga ? "Áreas de atuação desejadas" : "Especialidades"}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-pill border border-border bg-sunk px-3 py-1 text-sm text-ink-soft"
                  >
                    {specialtyLabel(s)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {!isVaga && p.techniques.length > 0 && (
            <section className="mt-8">
              <h2 className="kicker text-muted">Técnicas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-pill border border-border-strong px-3 py-1 text-sm text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* side */}
        <aside className="lg:sticky lg:top-[84px] lg:h-max">
          <div className="card p-5">
            {isVaga ? (
              <>
                <h2 className="kicker text-muted">Faixa salarial</h2>
                {salary ? (
                  <p className="mt-2 text-lg font-extrabold text-green-ink">{salary}</p>
                ) : (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-base font-bold text-ink-soft">
                    <Lock size={15} /> A combinar
                  </p>
                )}
                {!salary && (
                  <p className="mt-1 text-xs text-muted">
                    O contratante negocia o valor direto com o candidato.
                  </p>
                )}
                <div className="mt-4 border-t border-border pt-4">
                  <ProjectActions
                    slug={p.slug}
                    kind="vaga"
                    loggedIn={Boolean(user)}
                    isOwner={isOwner}
                    alreadyInterested={alreadyApplied}
                    canApply={canApply}
                    defaultName={user?.name ?? ""}
                    defaultEmail={user?.email ?? ""}
                  />
                </div>
              </>
            ) : (
              <>
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
                        <span className="font-semibold text-ink">{c.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 text-sm text-ink-soft">
                  Projeto publicado como referência. {formatDate(p.publishedAt)}.
                </p>
              </>
            )}
          </div>

          {isVaga && hasContato && (
            <div className="card mt-4 p-5">
              <h2 className="kicker text-muted">Contato do contratante</h2>
              {revealContratante ? (
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {p.contactWhatsapp && (
                    <li>
                      <span className="text-muted">WhatsApp:</span>{" "}
                      <a
                        href={`https://wa.me/55${p.contactWhatsapp.replace(/\D/g, "")}`}
                        className="font-semibold text-green-ink hover:underline"
                      >
                        {p.contactWhatsapp}
                      </a>
                    </li>
                  )}
                  {p.contactEmail && (
                    <li>
                      <span className="text-muted">E-mail:</span>{" "}
                      <a
                        href={`mailto:${p.contactEmail}`}
                        className="font-semibold text-green-ink hover:underline"
                      >
                        {p.contactEmail}
                      </a>
                    </li>
                  )}
                  {p.locationNote && (
                    <li>
                      <span className="text-muted">Localização desejada:</span>{" "}
                      {p.locationNote}
                    </li>
                  )}
                </ul>
              ) : (
                <div className="mt-3">
                  <p className="select-none space-y-1 blur-[5px]" aria-hidden>
                    WhatsApp: (00) 00000-0000
                    <br />
                    E-mail: contato@empresa.com
                  </p>
                  <Link href="/pro/oferecer" className="btn btn-primary btn-sm mt-3">
                    <Lock size={14} />
                    Ver contato com o Patrinu Pro
                  </Link>
                </div>
              )}
            </div>
          )}

          {isVaga && (
            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <Briefcase size={14} className="mt-0.5 shrink-0" />
              Sua candidatura vai direto para o contratante. Ele vê seu perfil e entra em contato.
            </p>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="kicker text-muted">
            {isVaga ? "Vagas relacionadas" : "Projetos relacionados"}
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) =>
              isVaga ? <VagaCard key={r.id} vaga={r} /> : <ProjectCard key={r.id} project={r} />,
            )}
          </div>
        </section>
      )}
    </div>
  );
}
