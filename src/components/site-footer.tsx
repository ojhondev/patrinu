import Link from "next/link";

import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explorar",
    links: [
      { label: "Vagas", href: "/vagas" },
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
    title: "Membro Patrinu",
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
      { label: "Seja membro", href: "/pro" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-11">
        <p className="display max-w-3xl text-2xl text-ink sm:text-4xl">
          O radar do <span className="accent text-green-ink">patrimônio</span> e do restauro
          do Brasil
        </p>
        <p className="mt-4 max-w-2xl text-sm text-ink-soft">
          Plataforma independente que reúne num só lugar conservação e restauro do
          patrimônio no Brasil — mantida pela assinatura dos seus membros.{" "}
          <Link href="/pro" className="font-semibold text-green-ink hover:underline">
            Torne-se membro
          </Link>
          .
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-3 lg:grid-cols-4">
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

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-3">
              <Logo className="h-6" />
              <span className="text-sm text-muted">© {new Date().getFullYear()} Patrinu</span>
            </div>
            <Link href="/privacidade" className="text-xs font-medium text-muted hover:text-green-ink">
              Privacidade
            </Link>
            <Link href="/termos" className="text-xs font-medium text-muted hover:text-green-ink">
              Termos de uso
            </Link>
            <Link href="/cookies" className="text-xs font-medium text-muted hover:text-green-ink">
              Cookies
            </Link>
          </div>
          <Link href="/master/entrar" className="text-xs font-medium text-muted hover:text-green-ink">
            Acesso Master
          </Link>
        </div>
      </div>
    </footer>
  );
}
