import Link from "next/link";

import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explorar",
    links: [
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
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-ink">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft hover:text-green-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-6" />
            <span className="text-sm text-muted">© {new Date().getFullYear()} Patrinu</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>O Radar do Patrimônio e Restauro do Brasil</span>
            <Link href="/master/entrar" className="hover:text-green-ink">
              Acesso Master
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
