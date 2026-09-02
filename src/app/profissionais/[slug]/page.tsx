import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Sparkles,
  MessageCircle,
  Mail,
  Globe,
  AtSign,
  ExternalLink,
  Lock,
} from "lucide-react";

import { getProfessional } from "@/lib/directory";
import { projectsByProfessional, projectsByOwner } from "@/lib/projects";
import { specialtyLabel, formatDate } from "@/lib/taxonomy";
import { SpecialtyIcon } from "@/components/specialty-visual";
import { ProjectCard } from "@/components/project-card";
import { VagaCard } from "@/components/vaga-card";
import { ShareProfileButton } from "@/components/share-profile-button";
import { getCurrentUser } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pro = await getProfessional(slug);
  if (!pro) return { title: "Perfil" };
  return {
    title: pro.displayName,
    description: pro.headline || `${pro.displayName} no diretório do Patrinu.`,
    alternates: { canonical: `/profissionais/${slug}` },
    openGraph: {
      title: `${pro.displayName} · Patrinu`,
      description: pro.headline,
      url: `${SITE_URL}/profissionais/${slug}`,
      images: pro.avatarUrl ? [pro.avatarUrl] : undefined,
    },
  };
}

const digits = (s: string) => s.replace(/\D/g, "");

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pro = await getProfessional(slug);
  if (!pro) notFound();

  const viewer = await getCurrentUser();
  const isOwner = Boolean(viewer && pro.ownerId && viewer.id === pro.ownerId);
  const showLinks = pro.pro; // links e vitrine só no perfil de Membro Pro

  const [credited, owned] = await Promise.all([
    projectsByProfessional(slug),
    pro.ownerId ? projectsByOwner(pro.ownerId) : Promise.resolve([]),
  ]);
  const seen = new Set(credited.map((p) => p.id));
  const publicOwned = owned.filter(
    (p) =>
      !seen.has(p.id) &&
      p.entryKind !== "vaga" &&
      ["vitrine", "concluido", "em_execucao"].includes(p.status),
  );
  const projects = pro.pro ? [...credited, ...publicOwned] : [];
  const openVagas = pro.pro
    ? owned.filter(
        (p) => p.entryKind === "vaga" && ["aberto", "em_captacao"].includes(p.status),
      )
    : [];

  const links = [
    pro.whatsapp && {
      href: `https://wa.me/55${digits(pro.whatsapp)}`,
      label: "WhatsApp",
      icon: MessageCircle,
    },
    pro.email && { href: `mailto:${pro.email}`, label: "E-mail", icon: Mail },
    pro.website && { href: pro.website, label: "Site / portfólio", icon: Globe },
    pro.instagram && { href: pro.instagram, label: "Instagram", icon: AtSign },
    pro.linkedin && { href: pro.linkedin, label: "LinkedIn", icon: ExternalLink },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail }[];

  return (
    <div className="mx-auto max-w-[620px] px-4 py-6 sm:px-6">
      <Link
        href="/profissionais"
        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={13} />
        Profissionais
      </Link>

      {/* topo estilo cartão */}
      <header className="mt-5 flex flex-col items-center text-center">
        {pro.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pro.avatarUrl}
            alt={pro.displayName}
            className="h-28 w-28 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="grid h-28 w-28 place-items-center rounded-full bg-green-weak text-green-ink">
            <SpecialtyIcon specialty={pro.specialties[0] ?? "arquitetura"} size={44} />
          </span>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <h1 className="display text-2xl text-ink sm:text-3xl">{pro.displayName}</h1>
          {pro.verified && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-ink">
              <BadgeCheck size={16} />
              Verificado
            </span>
          )}
        </div>

        {pro.pro && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-brand px-3 py-1 text-xs font-bold text-white">
            <Sparkles size={13} />
            Membro Pro
          </span>
        )}

        <p className="mt-2 max-w-md text-ink-soft">{pro.headline}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} />
          {pro.city && pro.uf ? `${pro.city}/${pro.uf}` : "Brasil"} · no Patrinu desde{" "}
          {formatDate(pro.memberSince)}
        </p>

        <div className="mt-4">
          <ShareProfileButton slug={pro.slug} name={pro.displayName} />
        </div>
      </header>

      {/* botões de link — Linktree (só Membro Pro) */}
      <section className="mt-8">
        {showLinks ? (
          links.length > 0 ? (
            <div className="space-y-2.5">
              {links.map((l) => {
                const Icon = l.icon;
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-green-weak/40"
                  >
                    <Icon size={17} className="text-brand" />
                    {l.label}
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-border px-4 py-4 text-center text-sm text-muted">
              {isOwner
                ? "Adicione WhatsApp, site e redes no seu perfil para os botões aparecerem aqui."
                : "Este profissional ainda não adicionou canais de contato."}
            </p>
          )
        ) : (
          <div className="rounded-card border border-brand/25 bg-green-weak/50 p-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
              <Lock size={14} className="text-brand" />
              Contato direto no Patrinu Pro
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {isOwner
                ? "Torne-se Membro Pro para exibir WhatsApp, e-mail, site e redes na sua página — e aparecer em destaque no diretório."
                : "WhatsApp, e-mail e redes deste profissional ficam visíveis quando ele é Membro Pro. Publique uma vaga e receba a candidatura dele."}
            </p>
            <Link href="/pro" className="btn btn-primary btn-sm mt-3">
              {isOwner ? "Quero ser Pro" : "Conheça o Patrinu Pro"}
            </Link>
          </div>
        )}
      </section>

      {/* sobre */}
      {pro.bio && (
        <section className="mt-8">
          <h2 className="kicker text-muted">Sobre</h2>
          <p className="mt-2 whitespace-pre-line text-ink-soft">{pro.bio}</p>
        </section>
      )}

      {/* especialidades / técnicas / registros */}
      <section className="mt-8 space-y-5">
        <div>
          <h2 className="kicker text-muted">Especialidades</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pro.specialties.map((s) => (
              <span
                key={s}
                className="rounded-pill border border-border bg-sunk px-2.5 py-0.5 text-xs text-ink-soft"
              >
                {specialtyLabel(s)}
              </span>
            ))}
          </div>
        </div>
        {pro.techniques.length > 0 && (
          <div>
            <h2 className="kicker text-muted">Técnicas</h2>
            <p className="mt-2 text-sm text-ink-soft">{pro.techniques.join(" · ")}</p>
          </div>
        )}
        {pro.registros.length > 0 && (
          <div>
            <h2 className="kicker text-muted">Registros e associações</h2>
            <p className="mt-2 text-sm text-ink-soft">{pro.registros.join(" · ")}</p>
          </div>
        )}
      </section>

      {/* vitrine — só Membro Pro */}
      {projects.length > 0 && (
        <section className="mt-10">
          <h2 className="kicker text-muted">Projetos publicados ({projects.length})</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* vagas abertas do escritório — só Membro Pro */}
      {openVagas.length > 0 && (
        <section className="mt-10">
          <h2 className="kicker text-muted">Vagas abertas ({openVagas.length})</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {openVagas.map((v) => (
              <VagaCard key={v.id} vaga={v} />
            ))}
          </div>
        </section>
      )}

      {isOwner && !pro.pro && (
        <section className="mt-10 rounded-card border border-border bg-sunk p-4 text-sm text-ink-soft">
          <strong className="text-ink">Sua página está no modo gratuito.</strong> Ela aparece no
          diretório, mas <strong className="text-ink">abaixo</strong> dos Membros Pro e sem os
          botões de contato. Com o Patrinu Pro você ganha prioridade na listagem, o selo em
          destaque, os links de contato e a vitrine dos seus projetos.{" "}
          <Link href="/pro" className="font-semibold text-green-ink hover:underline">
            Ver planos
          </Link>
        </section>
      )}
    </div>
  );
}
