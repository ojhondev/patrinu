import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { featuredOpportunities } from "@/lib/opportunities";
import { listProjects, featuredVagas, redactContratante } from "@/lib/projects";
import { featuredProfessionals, latestArticles, featuredCourses } from "@/lib/directory";
import { HeaderSearch } from "@/components/header-search";
import { PopularSearches } from "@/components/popular-searches";
import { CategoryRail } from "@/components/category-rail";
import { VagaCard } from "@/components/vaga-card";
import { ProjectTile } from "@/components/project-tile";
import { ProfessionalCard } from "@/components/professional-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { ArticleCard } from "@/components/article-card";
import { CourseCard } from "@/components/course-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { FacadeMotif } from "@/components/facade-motif";
import { ProBrandsRail } from "@/components/pro-brands-rail";
import { LockedPanel } from "@/components/locked";
import { has } from "@/lib/membership";
import { CATEGORY_GROUPS } from "@/lib/categories";

function SectionHead({
  eyebrow,
  title,
  href,
  cta,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
  cta: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="kicker text-muted">{eyebrow}</p>
          <h2 className="display mt-2 text-2xl text-ink sm:text-[32px]">{title}</h2>
        </div>
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-green-ink hover:text-ink sm:inline-flex"
        >
          {cta}
          <ArrowRight size={15} />
        </Link>
      </div>
      {children ? <p className="mt-2 max-w-2xl text-ink-soft">{children}</p> : null}
    </div>
  );
}

export default async function HomePage() {
  const [vagasRaw, showcase, pros, editais, articles, courses, isPro] = await Promise.all([
    featuredVagas(4),
    listProjects({ mode: "vitrine", entryKind: "projeto" }),
    featuredProfessionals(4),
    featuredOpportunities(4),
    latestArticles(3),
    featuredCourses(3),
    has("pro"),
  ]);
  const vagas = isPro ? vagasRaw : vagasRaw.map(redactContratante);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-[#2b1712] text-white">
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
        {/* véu leve — o vídeo aparece bem, a copy fica legível no canto */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(20,10,8,0.82) 0%, rgba(20,10,8,0.42) 50%, rgba(20,10,8,0.15) 100%)",
          }}
        />
        <FacadeMotif className="pointer-events-none absolute -right-12 top-1/2 hidden h-[420px] -translate-y-1/2 text-white/10 lg:block" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-11 lg:py-24">
          <div className="max-w-3xl">
            <p className="accent text-lg text-[#ffb59e]">Patrimônio e restauro do Brasil</p>
            <h1 className="display mt-3 text-4xl text-white sm:text-6xl lg:text-[64px]">
              Encontre profissionais, vagas e editais de restauro{" "}
              <span className="accent font-medium text-white">sem sair de uma aba</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              A rede profissional do patrimônio: especialistas verificados, oportunidades de
              trabalho e o que move o setor.
            </p>

            <div className="mt-8 max-w-2xl">
              <HeaderSearch />
            </div>
            <div className="mt-4">
              <PopularSearches dark />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- escritórios pro ---------------- */}
      <ProBrandsRail />

      {/* ---------------- explore por categoria ---------------- */}
      <section className="bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
          <p className="kicker text-muted">Explore por categoria</p>
          <h2 className="display mt-2 text-2xl text-ink sm:text-[30px]">
            As áreas da conservação e do restauro
          </h2>
          <p className="mt-2 max-w-xl text-ink-soft">
            Dos bens móveis à arquitetura, da arqueologia aos acervos — navegue pelos grupos de
            especialidade.
          </p>
          <div className="mt-8">
            <CategoryRail base="/profissionais" />
          </div>
          <Link
            href="/profissionais"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-green-ink hover:text-ink"
          >
            Ver todos os {CATEGORY_GROUPS.length} grupos
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ---------------- vagas ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <SectionHead
          eyebrow="Contratação"
          title="Vagas em escritórios de restauro"
          href="/vagas"
          cta="Ver todas as vagas"
        >
          Escritórios, ateliês, museus e órgãos publicam vagas com a função, as áreas de atuação e
          a faixa salarial.
        </SectionHead>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vagas.map((v) => (
            <VagaCard key={v.id} vaga={v} />
          ))}
        </div>
      </section>

      {/* ---------------- projetos (vitrine) ---------------- */}
      <section className="border-y border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
          <SectionHead
            eyebrow="Vitrine"
            title="Projetos publicados"
            href="/projetos"
            cta="Ver a vitrine"
          >
            Obras já restauradas, contadas por quem as executou.
          </SectionHead>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.slice(0, 3).map((p) => (
              <ProjectTile key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- profissionais ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <SectionHead
          eyebrow="Diretório"
          title="Profissionais verificados"
          href="/profissionais"
          cta="Ver o diretório"
        >
          Restauradores, ateliês e escritórios com reputação verificada.
        </SectionHead>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pros.map((pro) => (
            <ProfessionalCard key={pro.slug} pro={pro} />
          ))}
        </div>
      </section>

      {/* ---------------- editais ---------------- */}
      <section className="border-t border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
          <SectionHead
            eyebrow="Radar"
            title="Editais abertos"
            href="/editais"
            cta="Abrir o Radar de editais"
          >
            Licitações e chamamentos de patrimônio, com checklist de habilitação.
          </SectionHead>
          {isPro ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {editais.map((op) => (
                    <OpportunityCard key={op.id} op={op} />
                  ))}
                </div>
              </LockedPanel>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- notícias + cursos ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div
          className={
            articles.length > 0
              ? "grid gap-12 lg:grid-cols-2"
              : "grid gap-12"
          }
        >
          {articles.length > 0 && (
            <div>
              <SectionHead
                eyebrow="Editorial"
                title="Notícias"
                href="/noticias"
                cta="Todas as notícias"
              />
              <div className="mt-6 space-y-3">
                {articles.map((a) => (
                  <ArticleCard key={a.slug} article={a} compact />
                ))}
              </div>
            </div>
          )}
          <div>
            <SectionHead eyebrow="Formação" title="Cursos" href="/cursos" cta="Ver diretório" />
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
