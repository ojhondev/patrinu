import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/badge";

export const metadata: Metadata = {
  title: "Fontes do Radar de Editais",
  description:
    "As fontes que a Patrinu monitora para reunir editais, licitações e chamamentos de patrimônio do Brasil.",
};

type Row = { n: number; name: string; what: string; access: "API" | "Scraping" | "Monitorar" };

const TIERS: { title: string; note: string; rows: Row[] }[] = [
  {
    title: "Base nacional",
    note: "O Radar de licitações roda só com isto.",
    rows: [
      { n: 1, name: "PNCP — Portal Nacional de Contratações Públicas", what: "Portal obrigatório da Lei 14.133/2021: editais e contratos de União, estados e municípios.", access: "API" },
      { n: 2, name: "Compras.gov.br (Comprasnet)", what: "Compras do executivo federal — IPHAN, museus federais, Funarte, universidades.", access: "API" },
      { n: 3, name: "Diário Oficial da União", what: "Extratos de edital, avisos de licitação e editais de fomento federais.", access: "API" },
      { n: 4, name: "Querido Diário", what: "Agregação aberta de diários oficiais municipais — cidades fora do PNCP.", access: "API" },
      { n: 5, name: "Licitações-e (Banco do Brasil)", what: "Plataforma de pregão usada por milhares de prefeituras.", access: "Scraping" },
      { n: 6, name: "Plataformas privadas de pregão", what: "Portal de Compras Públicas, BLL, Licitar Digital, BNC.", access: "Scraping" },
    ],
  },
  {
    title: "Patrimônio federal",
    note: "Maior densidade de restauro.",
    rows: [
      { n: 7, name: "IPHAN — Editais e Seleções", what: "Editais de restauro, seleção de projetos, chamamentos e credenciamentos.", access: "Scraping" },
      { n: 8, name: "IPHAN — licitações e contratos", what: "A autarquia contrata obra e projeto via PNCP/Comprasnet.", access: "API" },
      { n: 9, name: "Novo PAC — Cidades Históricas", what: "Pipeline de obras em 44+ cidades históricas (~R$ 1,6 bi).", access: "Monitorar" },
      { n: 10, name: "Fundações e museus federais", what: "IBRAM, Funarte, Casa de Rui Barbosa, Biblioteca Nacional, Fundação Palmares.", access: "API" },
      { n: 11, name: "Ministério da Cultura — Editais", what: "Editais nacionais de fomento com recorte de patrimônio.", access: "Scraping" },
    ],
  },
  {
    title: "Incentivo e fomento",
    note: "Também abastece o pilar Financiamento.",
    rows: [
      { n: 12, name: "SALIC / VerSalic — Lei Rouanet", what: "Projetos de patrimônio buscando patrocínio, com valor, proponente e status.", access: "API" },
      { n: 13, name: "PNAB — Política Nacional Aldir Blanc", what: "Editais culturais de estados e municípios com recurso federal.", access: "API" },
      { n: 14, name: "Rede Mapas Culturais", what: "Plataforma usada por dezenas de estados e municípios para publicar editais.", access: "API" },
      { n: 15, name: "Prosas", what: "Agregador privado de editais social/cultural/patrimônio.", access: "Scraping" },
    ],
  },
  {
    title: "Estados — polos de patrimônio",
    note: "Prioridade: MG, BA, PE, RJ, SP, RS.",
    rows: [
      { n: 16, name: "IEPHA-MG", what: "Editais, chamamentos e o programa ICMS Patrimônio Cultural.", access: "Scraping" },
      { n: 17, name: "SEC-MG — Lei Estadual de Incentivo (LEIC)", what: "Plataforma de Fomento e Incentivo Cultural de MG.", access: "Scraping" },
      { n: 18, name: "Secretaria de Cultura SP — ProAC", what: "Maior programa estadual de fomento; linhas de patrimônio e acervos.", access: "Scraping" },
      { n: 19, name: "CONDEPHAAT-SP / UPPM", what: "Patrimônio tombado estadual paulista.", access: "Scraping" },
      { n: 20, name: "IPAC-BA + Secult-BA", what: "Centro histórico de Salvador, Cachoeira, Recôncavo.", access: "Scraping" },
      { n: 21, name: "Fundarpe-PE (Funcultura)", what: "Órgão de patrimônio + fomento de Pernambuco.", access: "Scraping" },
      { n: 22, name: "INEPAC-RJ, IPHAE-RS e secretarias de cultura", what: "Patrimônio e incentivo estaduais de RJ e RS.", access: "Scraping" },
      { n: 23, name: "Demais secretarias estaduais", what: "PR, SC, CE, PA, ES, GO, DF — via Mapas Culturais e diários oficiais.", access: "API" },
    ],
  },
  {
    title: "Bancos, estatais e institutos",
    note: "Baixa frequência, altíssimo valor.",
    rows: [
      { n: 24, name: "BNDES — Patrimônio Cultural / matchfunding", what: "Um dos maiores financiadores de restauro de bens tombados.", access: "Monitorar" },
      { n: 25, name: "Petrobras — Seleção Pública Cultural", what: "Grandes editais periódicos com linhas de patrimônio.", access: "Monitorar" },
      { n: 26, name: "Instituto Cultural Vale", what: "Forte atuação em Minas — Ouro Preto, Congonhas, Mariana.", access: "Monitorar" },
      { n: 27, name: "Caixa, CCBB, Itaú Cultural, Banco do Nordeste", what: "Editais de ocupação e fomento; ocasionalmente restauro.", access: "Monitorar" },
      { n: 28, name: "Fundações e institutos privados", what: "Fundação Roberto Marinho, Sesc, entre outros.", access: "Monitorar" },
    ],
  },
  {
    title: "Internacional",
    note: "Nicho, alto valor simbólico.",
    rows: [
      { n: 29, name: "Fundos de preservação", what: "World Monuments Watch, Getty, ALIPH, Ambassadors Fund, Gulbenkian, UNESCO.", access: "Monitorar" },
      { n: 30, name: "Bancos multilaterais", what: "BID, Banco Mundial, CAF — revitalização urbana com componente de patrimônio.", access: "Monitorar" },
    ],
  },
];

function AccessBadge({ a }: { a: Row["access"] }) {
  const tone = a === "API" ? "green" : a === "Scraping" ? "warn" : "neutral";
  return <Badge tone={tone}>{a}</Badge>;
}

export default function FontesPage() {
  return (
    <>
      <PageHero eyebrow="Radar de Editais" title="As fontes que a Patrinu monitora">
        Reunimos editais, licitações e chamamentos de patrimônio de dezenas de fontes
        públicas. Estas são as ~30 prioritárias, agrupadas por relação valor/esforço.
      </PageHero>

      <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-11">
        {TIERS.map((tier) => (
          <section key={tier.title} className="mb-10">
            <h2 className="font-display text-xl font-bold tracking-tight">{tier.title}</h2>
            <p className="mt-0.5 text-sm text-ink-soft">{tier.note}</p>
            <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {tier.rows.map((r) => (
                    <tr key={r.n} className="border-b border-border last:border-0">
                      <td className="w-8 px-3 py-3 text-center font-mono text-xs text-muted">
                        {r.n}
                      </td>
                      <td className="px-2 py-3">
                        <p className="font-semibold text-ink">{r.name}</p>
                        <p className="mt-0.5 text-ink-soft">{r.what}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                        <AccessBadge a={r.access} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <div className="rounded-[var(--radius-card)] border border-border bg-sunk p-5 text-sm text-ink-soft">
          <p>
            <strong className="text-ink">Como lemos as fontes.</strong> PNCP, Comprasnet, DOU
            e Querido Diário se sobrepõem — a mesma licitação aparece em vários lugares. Uma
            camada de deduplicação junta tudo numa oportunidade canônica, classifica se é de
            patrimônio, extrai valor, prazo e exigências de habilitação, e acompanha o
            desfecho (quem venceu, por quanto).
          </p>
          <p className="mt-3 text-xs text-muted">
            Nomes de portais verificados em fontes públicas; disponibilidade de API a
            confirmar por fonte.
          </p>
        </div>
      </div>
    </>
  );
}
