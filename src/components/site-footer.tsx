import Link from "next/link";

import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explorar",
    links: [
      { label: "Oportunidades", href: "/oportunidades" },
      { label: "Projetos", href: "/projetos" },
      { label: "Profissionais", href: "/profissionais" },
      { label: "Editais e licitações", href: "/editais" },
      { label: "Notícias", href: "/noticias" },
      { label: "Cursos", href: "/cursos" },
      { label: "Financiamento", href: "/financiamento" },
    ],
  },
  {
    title: "Especialidades",
    links: [
      { label: "Bens integrados", href: "/projetos?specialty=bens_integrados" },
      { label: "Arquitetura e edificações", href: "/projetos?specialty=arquitetura" },
      { label: "Acervos e conservação", href: "/projetos?specialty=acervo" },
      { label: "Arqueologia", href: "/projetos?specialty=arqueologia" },
      { label: "Jardins históricos", href: "/projetos?specialty=paisagismo" },
    ],
  },
  {
    title: "Patrinu Pro",
    links: [
      { label: "Quero contratar", href: "/pro/contratar" },
      { label: "Quero oferecer serviços", href: "/pro/oferecer" },
      { label: "Quero financiamento de obra", href: "/pro/financiamento" },
      { label: "Planos e preços", href: "/empresas" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Fontes do Radar de Editais", href: "/fontes" },
      {
        label: "Divulgar um curso",
        href: "mailto:contato@patrinu.com.br?subject=Divulgar%20curso%20na%20Patrinu",
      },
      { label: "Entrar", href: "/entrar" },
      { label: "Patrinu Pro", href: "/pro" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-brand bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11">
        <p className="display max-w-3xl text-2xl text-ink sm:text-4xl">
          O radar do <span className="accent text-green-ink">patrimônio</span> e do restauro
          do Brasil
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-ink/12 pt-10 sm:grid-cols-3 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="kicker text-muted">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft hover:text-green-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-6" />
            <span className="text-sm text-muted">© {new Date().getFullYear()} Patrinu</span>
          </div>
          <Link
            href="/master/entrar"
            className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted hover:text-green-ink"
          >
            Acesso Master
          </Link>
        </div>
      </div>
    </footer>
  );
}
