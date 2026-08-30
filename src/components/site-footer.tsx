import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

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
    title: "Para quem preserva",
    links: [
      { label: "Perfil e portfólio", href: "/profissionais" },
      { label: "Passaporte do Patrimônio", href: "/passaporte" },
      { label: "Formar consórcio", href: "/editais" },
      { label: "Alertas de edital", href: "/entrar" },
    ],
  },
  {
    title: "Para quem contrata",
    links: [
      { label: "Patrinu para empresas", href: "/empresas" },
      { label: "Planos institucionais", href: "/empresas" },
      { label: "Publicar um projeto", href: "/entrar" },
      { label: "Vitrine de projetos", href: "/financiamento" },
    ],
  },
  {
    title: "Patrinu",
    links: [
      { label: "PRD do produto", href: "/docs/PRD-v4.html" },
      { label: "Fontes do Radar", href: "/docs/radar-fontes.html" },
      { label: "Cadastrar", href: "/cadastro" },
      { label: "Entrar", href: "/entrar" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
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
            <Wordmark className="text-xl" />
            <span className="text-sm text-muted">© {new Date().getFullYear()} Patrinu</span>
          </div>
          <p className="text-sm text-muted">
            O Radar do Patrimônio e Restauro do Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
