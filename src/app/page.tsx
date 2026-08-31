import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { radarStats, featuredOpportunities } from "@/lib/opportunities";
import { listProjects } from "@/lib/projects";
import { featuredProfessionals, latestArticles, featuredCourses } from "@/lib/directory";
import { HeaderSearch } from "@/components/header-search";
import { PopularSearches } from "@/components/popular-searches";
import { CategoryRail } from "@/components/category-rail";
import { ProjectCard } from "@/components/project-card";
import { ProjectTile } from "@/components/project-tile";
import { ProfessionalCard } from "@/components/professional-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { ArticleCard } from "@/components/article-card";
import { CourseCard } from "@/components/course-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { FacadeMotif } from "@/components/facade-motif";
import { AmbassadorsRail } from "@/components/ambassadors-rail";
import { LockedPanel } from "@/components/locked";
import { has } from "@/lib/membership";

function SectionHead({
  n,
  title,
  href,
  cta,
  children,
}: {
  n: string;
  title: React.ReactNode;
  href: string;
  cta: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink/15 pb-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="kicker text-muted">
            {n} <span className="mx-1 text-ink/25">/</span>
          </p>
          <h2 className="display mt-2 text-3xl text-ink sm:text-[34px]">{title}</h2>
        </div>
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-green-ink hover:text-ink sm:inline-flex"
        >
          {cta}
          <ArrowRight size={14} />
        </Link>
      </div>
      {children ? <p className="mt-2 max-w-2xl text-ink-soft">{children}</p> : null}
    </div>
  );
}

export default async function HomePage() {
  const [stats, oportunidades, showcase, pros, editais, articles, courses, isPro] =
    await Promise.all([
      radarStats(),
      listProjects({ mode: "abertos" }),
      listProjects({ mode: "vitrine" }),
      featuredProfessionals(4),
      featuredOpportunities(4),
      latestArticles(3),
      featuredCourses(3),
      has("pro"),
    ]);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="band relative overflow-hidden text-white">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* véu: escurece só o suficiente para a copy — o vídeo aparece bem */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.40) 45%, rgba(0,0,0,0.24) 100%)",
          }}
        />
        <FacadeMotif className="pointer-events-none absolute -right-12 top-1/2 hidden h-[420px] -translate-y-1/2 text-white/10 lg:block" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-11 lg:py-28">
          <div className="max-w-3xl">
            <p className="kicker text-accent">O radar do patrimônio brasileiro</p>
            <h1 className="display mt-4 text-4xl text-white sm:text-6xl lg:text-[68px]">
              Tudo sobre patrimônio e restauro do Brasil,{" "}
              <span className="accent text-accent">num só lugar</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Projetos, profissionais, notícias, cursos, editais e financiamento. A rede
              profissional e o marketplace do restauro brasileiro.
            </p>

            <div className="mt-8 max-w-xl">
              <HeaderSearch />
            </div>
            <div className="mt-4">
              <PopularSearches dark />
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 border-t border-white/15 pt-7 sm:grid-cols-4">
            {[
              ["Projetos na vitrine", "100+"],
              ["Profissionais", `${pros.length * 40}+`],
              ["Editais abertos", String(stats.abertas)],
              ["Cursos no diretório", `${courses.length * 8}+`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="kicker text-white/50">{label}</dt>
                <dd className="mt-1.5 font-display text-3xl font-extrabold tabular-nums text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- category rail ---------------- */}
      <section className="border-b border-ink/12">
        <div className="mx-auto max-w-[1400px] px-2 py-5 sm:px-6 lg:px-11">
          <CategoryRail />
        </div>
      </section>

      {/* ---------------- embaixadores ---------------- */}
      <AmbassadorsRail />

      {/* ---------------- oportunidades ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <SectionHead
          n="01"
          title="Oportunidades"
          href="/oportunidades"
          cta="Ver todas as oportunidades"
        >
          Restauros abertos para propostas de profissionais ou buscando patrocínio.
        </SectionHead>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {oportunidades.slice(0, 4).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* ---------------- projetos (vitrine) ---------------- */}
      <section className="border-y border-ink/12 bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
          <SectionHead n="02" title="Projetos" href="/projetos" cta="Ver o acervo">
            Obras já restauradas, publicadas por quem as executou.
          </SectionHead>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.slice(0, 3).map((p) => (
              <ProjectTile key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- profissionais ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <SectionHead
          n="03"
          title="Profissionais"
          href="/profissionais"
          cta="Ver o diretório"
        >
          Restauradores, ateliês e escritórios verificados.
        </SectionHead>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pros.map((pro) => (
            <ProfessionalCard key={pro.slug} pro={pro} />
          ))}
        </div>
      </section>

      {/* ---------------- editais ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <SectionHead
          n="04"
          title="Editais abertos"
          href="/editais"
          cta="Abrir o Radar de editais"
        >
          Licitações e chamamentos de patrimônio, com checklist de habilitação.
        </SectionHead>
        {isPro ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {editais.map((op) => (
              <OpportunityCard key={op.id} op={op} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <LockedPanel
              title="O Radar de Editais é para membros"
              body="Feed completo, alertas por perfil e checklist de habilitação. Membros veem tudo."
              cta="Conhecer os planos de membro"
              href="/pro"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {editais.map((op) => (
                  <OpportunityCard key={op.id} op={op} />
                ))}
              </div>
            </LockedPanel>
          </div>
        )}
      </section>

      {/* ---------------- notícias + cursos ---------------- */}
      <section className="border-y border-ink/12 bg-sunk">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-11">
          <div>
            <SectionHead n="05" title="Notícias" href="/noticias" cta="Todas as notícias" />
            <div className="mt-6 space-y-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} compact />
              ))}
            </div>
          </div>
          <div>
            <SectionHead n="06" title="Cursos" href="/cursos" cta="Ver diretório" />
            <div className="mt-6 space-y-3">
              {courses.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- newsletter ---------------- */}
      <section className="band">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker text-accent">Newsletter semanal</p>
              <h2 className="display mt-3 max-w-2xl text-3xl text-white sm:text-5xl">
                O que aconteceu no setor <span className="accent text-accent">esta semana</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/70">
                Obras em destaque, editais que abriram e a matéria da semana. Uma edição por
                semana, direto no seu e-mail.
              </p>
            </div>
            <div className="lg:pb-1">
              <NewsletterSignup dark />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
