import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Oportunidades",
    links: [
      { label: "Radar de licitações", href: "/radar?kind=licitacao" },
      { label: "Editais de fomento", href: "/radar?kind=edital" },
      { label: "Chamamentos", href: "/radar?kind=chamamento" },
      { label: "Fontes do Radar", href: "/docs/radar-fontes.html" },
    ],
  },
  {
    title: "Especialidades",
    links: [
      { label: "Bens integrados", href: "/radar?specialty=bens_integrados" },
      { label: "Arquitetura e edificações", href: "/radar?specialty=arquitetura" },
      { label: "Acervos e conservação", href: "/radar?specialty=acervo" },
      { label: "Arqueologia", href: "/radar?specialty=arqueologia" },
    ],
  },
  {
    title: "Para quem preserva",
    links: [
      { label: "Perfil e portfólio", href: "/profissionais" },
      { label: "Passaporte do Patrimônio", href: "/passaporte" },
      { label: "Formar consórcio", href: "/radar" },
      { label: "Cofre de documentos", href: "/entrar" },
    ],
  },
  {
    title: "Para quem contrata",
    links: [
      { label: "Patrinu para empresas", href: "/empresas" },
      { label: "Planos institucionais", href: "/empresas" },
      { label: "Vitrine de projetos", href: "/empresas" },
      { label: "Publicar um projeto", href: "/entrar" },
    ],
  },
  {
    title: "Patrinu",
    links: [
      { label: "PRD do produto", href: "/docs/PRD-v3.html" },
      { label: "Como funciona", href: "/#como-funciona" },
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
                      className="text-sm text-ink-soft hover:text-ink hover:underline"
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
            O ecossistema digital do patrimônio · restauro e conservação · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
