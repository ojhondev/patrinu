import type { FundingSource } from "@/lib/types";

/** Fontes de recurso para o pilar Financiamento. No v1 o match é por regras. */
export const MOCK_FUNDING: FundingSource[] = [
  {
    slug: "lei-rouanet",
    name: "Lei Rouanet — Programa Nacional de Apoio à Cultura",
    kind: "lei_incentivo",
    scope: "federal",
    summary:
      "Mecanismo federal de incentivo fiscal. Projetos aprovados captam recurso de patrocinadores pessoa física e jurídica, que abatem do imposto de renda.",
    fitFor: [
      "Restauro de bens tombados em nível federal, estadual ou municipal",
      "Conservação de acervos museológicos",
      "Projetos com contrapartida cultural e de acesso",
    ],
    ticket: "Sem teto fixo — conforme planilha aprovada",
    cycle: "Submissão contínua",
    url: "https://www.gov.br/cultura/pt-br/assuntos/lei-rouanet",
  },
  {
    slug: "bndes-cultura",
    name: "BNDES + Cultura — linha de Patrimônio Cultural",
    kind: "edital_banco",
    scope: "federal",
    summary:
      "Apoio do BNDES a projetos de restauro de conjuntos e monumentos tombados, com recursos incentivados e não incentivados e possibilidade de matchfunding.",
    fitFor: [
      "Conjuntos arquitetônicos e monumentos tombados",
      "Instituições detentoras do bem com projeto aprovado",
    ],
    ticket: "R$ 1 mi – R$ 20 mi",
    cycle: "Chamadas públicas periódicas",
    url: "https://www.bndes.gov.br",
  },
  {
    slug: "leic-mg",
    name: "Lei Estadual de Incentivo à Cultura de Minas Gerais (LEIC)",
    kind: "lei_incentivo",
    scope: "estadual",
    summary:
      "Incentivo via ICMS. Empresas mineiras patrocinam projetos culturais e abatem parte do imposto devido. Inscrição contínua na Plataforma Digital de Fomento.",
    fitFor: [
      "Restauro de bens tombados em MG",
      "Projetos com proponente sediado em Minas Gerais",
    ],
    ticket: "Conforme porte do proponente",
    cycle: "Fluxo contínuo",
    url: "https://www.secult.mg.gov.br",
  },
  {
    slug: "proac-icms-sp",
    name: "ProAC ICMS — São Paulo",
    kind: "lei_incentivo",
    scope: "estadual",
    summary:
      "Principal mecanismo de incentivo fiscal à cultura de São Paulo. Patrocinadores escolhem iniciativas e abatem do ICMS devido.",
    fitFor: [
      "Restauro de bens móveis e integrados de instituições paulistas",
      "Proponente com sede em SP",
    ],
    ticket: "Conforme projeto",
    cycle: "Fluxo contínuo + editais",
    url: "https://www.cultura.sp.gov.br",
  },
  {
    slug: "icms-patrimonio-cultural-mg",
    name: "ICMS Patrimônio Cultural (IEPHA-MG)",
    kind: "fundo_estadual",
    scope: "estadual",
    summary:
      "Repasse de ICMS a municípios mineiros conforme suas ações de preservação — inventários, tombamentos e conservação. Recurso chega via prefeitura.",
    fitFor: [
      "Bens protegidos em nível municipal em MG",
      "Projetos executados com apoio da prefeitura",
    ],
    ticket: "Variável por município",
    cycle: "Anual",
    url: "https://www.iepha.mg.gov.br",
  },
  {
    slug: "world-monuments-watch",
    name: "World Monuments Watch",
    kind: "fundo_internacional",
    scope: "internacional",
    summary:
      "Programa bienal do World Monuments Fund que seleciona sítios de valor excepcional para apoio técnico e financeiro e visibilidade internacional.",
    fitFor: [
      "Bens de valor universal excepcional sob risco",
      "Projetos com componente de engajamento comunitário",
    ],
    ticket: "Grants variáveis",
    cycle: "Ciclo bienal",
    url: "https://www.wmf.org",
  },
];
