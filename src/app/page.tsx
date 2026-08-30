import Link from "next/link";
import {
  ArrowRight,
  Radar,
  ClipboardCheck,
  Users,
  Trophy,
  Check,
} from "lucide-react";

import { featuredOpportunities, radarStats } from "@/lib/opportunities";
import { formatBRL } from "@/lib/taxonomy";
import { HeaderSearch } from "@/components/header-search";
import { PopularSearches } from "@/components/popular-searches";
import { CategoryRail } from "@/components/category-rail";
import { OpportunityCard } from "@/components/opportunity-card";
import { FacadeMotif } from "@/components/facade-motif";

const STEPS = [
  {
    icon: Radar,
    title: "Descubra",
    body: "O Radar rastreia licitações, editais e chamamentos de patrimônio em centenas de fontes e mostra o que combina com o seu perfil.",
  },
  {
    icon: ClipboardCheck,
    title: "Monte a habilitação",
    body: "A partir do edital, geramos o checklist de documentos e cruzamos com o seu cofre — você vê na hora o que já tem e o que falta.",
  },
  {
    icon: Users,
    title: "Forme consórcio",
    body: "Encontre parceiros complementares em técnica, região e acervo técnico para disputar oportunidades maiores em conjunto.",
  },
  {
    icon: Trophy,
    title: "Dispute e comprove",
    body: "Manifeste interesse, acompanhe o resultado e transforme cada obra concluída em portfólio e no Passaporte do bem.",
  },
];

export default async function HomePage() {
  const [stats, featured] = await Promise.all([
    radarStats(),
    featuredOpportunities(8),
  ]);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-green-deep text-white">
        <FacadeMotif className="pointer-events-none absolute -right-16 top-1/2 hidden h-[440px] -translate-y-1/2 text-white/10 lg:block" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 15% 0%, rgba(29,191,115,0.25), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-11 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[56px]">
              Todo edital de restauro do Brasil, e as ferramentas para{" "}
              <span className="accent text-[1.05em]">ganhar</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              O marketplace do patrimônio. Encontre a oportunidade certa, monte a
              habilitação e forme consórcio — tudo em um lugar.
            </p>

            <div className="mt-7 max-w-xl">
              <HeaderSearch />
            </div>
            <div className="mt-4">
              <PopularSearches dark />
            </div>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            {[
              ["Oportunidades abertas", String(stats.abertas)],
              ["Fontes monitoradas", `${stats.fontes}`],
              ["Estados", String(stats.ufs)],
              ["Em disputa agora", formatBRL(stats.valorAberto)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-extrabold tabular-nums">{value}</dd>
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

      {/* ---------------- featured ---------------- */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Oportunidades em destaque
            </h2>
            <p className="mt-1 text-ink-soft">
              As de maior aderência ao perfil de conservação-restauro agora.
            </p>
          </div>
          <Link
            href="/radar"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border-strong px-4 py-2 text-sm font-bold text-ink hover:border-ink sm:inline-flex"
          >
            Ver o Radar
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((op) => (
            <OpportunityCard key={op.id} op={op} />
          ))}
        </div>

        <Link
          href="/radar"
          className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-strong px-4 py-3 text-sm font-bold text-ink hover:border-ink sm:hidden"
        >
          Ver o Radar completo
          <ArrowRight size={15} />
        </Link>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section id="como-funciona" className="border-y border-border bg-sunk">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Da descoberta à obra <span className="accent">no papel</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-weak text-green-ink">
                    <step.icon size={20} />
                  </span>
                  <span className="font-mono text-sm font-bold text-muted">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- for companies ---------------- */}
      <section className="bg-green-deep text-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-11 lg:py-20">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-green">
              Patrinu para empresas e ateliês
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance">
              Uma equipe inteira monitorando editais. Por assento.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Radar de licitações de todo o país, filtrado pelo que a sua empresa executa",
                "Busca de especialistas e banco de talentos para montar equipe",
                "Cofre de documentos compartilhado e gestão de consórcio",
                "Publicação de projetos e vagas",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-white/85">
                  <Check size={18} className="mt-0.5 shrink-0 text-green" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/empresas"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-3 text-sm font-bold text-green-deep hover:bg-green-hover"
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
                ["Ateliês e escritórios", "Business"],
                ["Museus, órgãos e dioceses", "Institucional"],
                ["Bancos e institutos", "Patrocinador / Vitrine"],
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

      {/* ---------------- passport / closing ---------------- */}
      <section className="bg-burgundy text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-11">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance">
              O patrimônio do Brasil precisa de quem sabe{" "}
              <span className="accent">fazer</span>.
            </h2>
            <p className="mt-2 max-w-xl text-white/75">
              Construa sua reputação com evidência: cada projeto documentado alimenta o
              Passaporte do bem e o seu portfólio.
            </p>
          </div>
          <Link
            href="/cadastro"
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-bold text-burgundy hover:bg-white/90"
          >
            Criar meu perfil
          </Link>
        </div>
      </section>
    </>
  );
}
