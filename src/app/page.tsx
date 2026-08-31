import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { radarStats, featuredOpportunities } from "@/lib/opportunities";
import { featuredProjects } from "@/lib/projects";
import { featuredProfessionals, latestArticles, featuredCourses } from "@/lib/directory";
import { HeaderSearch } from "@/components/header-search";
import { PopularSearches } from "@/components/popular-searches";
import { CategoryRail } from "@/components/category-rail";
import { ProjectCard } from "@/components/project-card";
import { ProfessionalCard } from "@/components/professional-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { ArticleCard } from "@/components/article-card";
import { CourseCard } from "@/components/course-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { FacadeMotif } from "@/components/facade-motif";
import { LockedPanel } from "@/components/locked";
import { has } from "@/lib/membership";

function SectionHead({
  title,
  href,
  cta,
  children,
}: {
  title: React.ReactNode;
  href: string;
  cta: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[26px]">
          {title}
        </h2>
        {children ? <p className="mt-1 text-ink-soft">{children}</p> : null}
      </div>
      <Link
        href={href}
        className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border-strong px-4 py-2 text-sm font-bold text-ink hover:border-green-ink sm:inline-flex"
      >
        {cta}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [stats, projects, pros, editais, articles, courses, isPro] = await Promise.all([
    radarStats(),
    featuredProjects(4),
    featuredProfessionals(4),
    featuredOpportunities(4),
    latestArticles(3),
    featuredCourses(3),
    has("pro"),
  ]);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-band text-white">
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
        {/* véu verde: deixa o vídeo aparecer, mantém a copy legível */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, color-mix(in oklab, var(--band) 90%, transparent) 0%, color-mix(in oklab, var(--band) 74%, transparent) 48%, color-mix(in oklab, var(--band) 60%, transparent) 100%)",
          }}
        />
        <FacadeMotif className="pointer-events-none absolute -right-12 top-1/2 hidden h-[420px] -translate-y-1/2 text-white/10 lg:block" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-18 lg:px-11 lg:py-22">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[54px]">
              Tudo sobre patrimônio e restauro do Brasil,{" "}
              <span className="accent text-accent">num só lugar</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Projetos, profissionais, notícias, cursos, editais e financiamento. A rede
              profissional e o marketplace do restauro brasileiro.
            </p>

            <div className="mt-7 max-w-xl">
              <HeaderSearch />
            </div>
            <div className="mt-4">
              <PopularSearches dark />
            </div>
          </div>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            {[
              ["Projetos na vitrine", "100+"],
              ["Profissionais", `${pros.length * 40}+`],
              ["Editais abertos", String(stats.abertas)],
              ["Cursos no diretório", `${courses.length * 8}+`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-extrabold tabular-nums text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- category rail ---------------- */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-2 py-5 sm:px-6 lg:px-11">
          <CategoryRail />
        </div>
      </section>

      {/* ---------------- projetos ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
        <SectionHead title="Projetos" href="/projetos" cta="Ver todos os projetos">
          Obras concluídas como referência e projetos abertos para disputar.
        </SectionHead>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* ---------------- profissionais ---------------- */}
      <section className="border-y border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
          <SectionHead
            title="Profissionais em destaque"
            href="/profissionais"
            cta="Ver o diretório"
          >
            Restauradores, ateliês e escritórios verificados.
          </SectionHead>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pros.map((pro) => (
              <ProfessionalCard key={pro.slug} pro={pro} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- editais ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">
        <SectionHead title="Editais abertos" href="/editais" cta="Abrir o Radar de editais">
          Licitações e chamamentos de patrimônio, com checklist de habilitação.
        </SectionHead>
        {isPro ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {editais.map((op) => (
              <OpportunityCard key={op.id} op={op} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <LockedPanel
              title="O Radar de Editais é do Patrinu Pro"
              body="Feed completo, alertas por perfil e checklist de habilitação. Assinantes Pro veem tudo."
              cta="Conhecer o Patrinu Pro"
              href="/pro"
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {editais.map((op) => (
                  <OpportunityCard key={op.id} op={op} />
                ))}
              </div>
            </LockedPanel>
          </div>
        )}
      </section>

      {/* ---------------- notícias + cursos ---------------- */}
      <section className="border-y border-border bg-sunk">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-11">
          <div>
            <SectionHead title="Notícias" href="/noticias" cta="Todas as notícias" />
            <div className="mt-5 space-y-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} compact />
              ))}
            </div>
          </div>
          <div>
            <SectionHead title="Cursos" href="/cursos" cta="Ver diretório" />
            <div className="mt-5 space-y-3">
              {courses.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- para empresas (a única faixa verde) ---------------- */}
      <section className="bg-band text-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-11 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green">
              Patrinu para empresas e instituições
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance">
              Assinatura, nunca comissão.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Publique projetos e vagas e encontre especialistas do setor",
                "Radar de editais de todo o país, filtrado pelo que você executa",
                "Gestão de fornecedores, acervos e relatórios (Institucional)",
                "Deal flow de projetos financiáveis (Patrocinador / Vitrine)",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-white/85">
                  <Check size={18} className="mt-0.5 shrink-0 text-green" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/empresas"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-3 text-sm font-bold text-white hover:bg-green-hover"
            >
              Conhecer os planos
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <p className="text-sm text-white/60">A partir de</p>
            <p className="mt-1 font-display text-4xl font-extrabold">
              R$ 300
              <span className="text-lg font-semibold text-white/60"> /assento/mês</span>
            </p>
            <div className="mt-6 space-y-4 border-t border-white/15 pt-6 text-sm">
              {[
                ["Restauradores e estudantes", "Free / Pro"],
                ["Ateliês e escritórios", "Empresa"],
                ["Museus, órgãos e dioceses", "Institucional"],
                ["Bancos e institutos", "Patrocinador"],
              ].map(([who, plan]) => (
                <div key={plan} className="flex items-center justify-between gap-4">
                  <span className="text-white/70">{who}</span>
                  <span className="font-bold">{plan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- newsletter ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11">
        <div className="rounded-2xl border border-border bg-green-weak p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            O que aconteceu no setor esta semana
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-ink-soft">
            Obras em destaque, editais que abriram e a matéria da semana. Uma edição por
            semana, direto no seu e-mail.
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </>
  );
}
