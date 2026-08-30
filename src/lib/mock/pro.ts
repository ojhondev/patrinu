import type {
  CompatibleOpportunity,
  EligibilitySignal,
  Prospect,
} from "@/lib/types";

/* ---------------- Painel do contratante — prospectos ---------------- */

export const MOCK_PROSPECTS: Prospect[] = [
  {
    professionalSlug: "helena-braga",
    projectSlug: "brief-maquinario-teatro-amazonas",
    projectTitle: "Restauro do maquinário cênico do Teatro Amazonas",
    status: "candidatou",
    fit: 0.82,
    reason: "Acervo em bens integrados de madeira; RRT e atestado compatíveis.",
  },
  {
    professionalSlug: "atelie-tangere",
    projectSlug: "brief-igreja-sao-miguel-missoes",
    projectTitle: "Diagnóstico e projeto — São Miguel das Missões",
    status: "match",
    fit: 0.74,
    reason: "Equipe multidisciplinar com conservação de acervo e arqueologia.",
  },
  {
    professionalSlug: "coletivo-pedra-cal",
    projectSlug: "brief-igreja-sao-miguel-missoes",
    projectTitle: "Diagnóstico e projeto — São Miguel das Missões",
    status: "candidatou",
    fit: 0.88,
    reason: "Especialistas em cantaria e consolidação de ruínas em pedra.",
  },
  {
    professionalSlug: "rui-tavares-arquitetura",
    projectSlug: "brief-igreja-sao-miguel-missoes",
    projectTitle: "Diagnóstico e projeto — São Miguel das Missões",
    status: "convidado",
    fit: 0.79,
    reason: "Responsável técnico com cadastro de projetistas no IPHAN.",
  },
  {
    professionalSlug: "atelie-vitral-sul",
    projectSlug: "brief-maquinario-teatro-amazonas",
    projectTitle: "Restauro do maquinário cênico do Teatro Amazonas",
    status: "em_conversa",
    fit: 0.61,
    reason: "Experiência com elementos metálicos artísticos e mecanismos.",
  },
];

/* ---------------- Painel do profissional — oportunidades compatíveis ---------------- */

export const MOCK_COMPATIBLE: CompatibleOpportunity[] = [
  {
    kind: "edital",
    id: "op-ouro-preto-talha",
    title: "Restauração da talha dourada da Capela-mor de São Francisco de Assis",
    organ: "Prefeitura de Ouro Preto",
    uf: "MG",
    value: "R$ 1.180.000",
    deadlineAt: "2026-09-22T20:00:00Z",
    fit: 0.96,
    reason: "Talha, douramento e policromia — casa com suas 5 técnicas principais.",
  },
  {
    kind: "edital",
    id: "op-olinda-cantaria",
    title: "Restauro de portada em cantaria e frontão da Igreja da Sé de Olinda",
    organ: "Fundarpe-PE",
    uf: "PE",
    value: "R$ 480.000",
    deadlineAt: "2026-09-18T17:00:00Z",
    fit: 0.63,
    reason: "Bens integrados; exige acervo em elementos pétreos — parcial.",
  },
  {
    kind: "brief",
    id: "brief-maquinario-teatro-amazonas",
    title: "Restauro do maquinário cênico histórico do Teatro Amazonas",
    organ: "Projeto Rouanet 208941",
    uf: "AM",
    value: "R$ 2,5–3 mi",
    deadlineAt: "2026-11-15T23:59:00Z",
    fit: 0.71,
    reason: "Bens integrados de madeira; disponibilidade in loco a confirmar.",
  },
  {
    kind: "edital",
    id: "op-proac-restauro-sp",
    title: "ProAC Editais — Restauro de bens móveis e integrados (SP)",
    organ: "Secretaria de Cultura SP",
    uf: "SP",
    value: "R$ 3.000.000",
    deadlineAt: "2026-09-30T23:59:00Z",
    fit: 0.84,
    reason: "Bens móveis e integrados; proponente pode ser de fora com anuência.",
  },
];

/* ---------------- Painel do financiamento — elegibilidade sinalizada ---------------- */

export const MOCK_ELIGIBILITY: EligibilitySignal[] = [
  {
    investor: "BNDES + Cultura",
    investorKind: "banco",
    projectSlug: "captacao-solar-marques-abrantes",
    projectTitle: "Restauro do Solar do Marquês de Abrantes",
    status: "elegivel",
    reason: "Conjunto tombado; instituição detentora com projeto aprovado.",
    nextStep: "Enviar dossiê pela chamada pública de patrimônio (abre em out.).",
  },
  {
    investor: "Lei Rouanet",
    investorKind: "lei_incentivo",
    projectSlug: "captacao-solar-marques-abrantes",
    projectTitle: "Restauro do Solar do Marquês de Abrantes",
    status: "elegivel",
    reason: "Restauro de bem tombado com contrapartida de acesso — enquadra no art. 18.",
    nextStep: "Submeter proposta no SALIC; Patrinu gera a planilha orçamentária.",
  },
  {
    investor: "Fazcultura / Fundo de Cultura BA",
    investorKind: "estatal",
    projectSlug: "captacao-solar-marques-abrantes",
    projectTitle: "Restauro do Solar do Marquês de Abrantes",
    status: "aderencia_parcial",
    reason: "Proponente sediado na BA ✓; falta comprovar a titularidade do imóvel.",
    nextStep: "Anexar certidão de propriedade / cessão de uso.",
  },
  {
    investor: "Instituto Cultural Vale",
    investorKind: "instituto",
    projectSlug: "captacao-solar-marques-abrantes",
    projectTitle: "Restauro do Solar do Marquês de Abrantes",
    status: "em_analise",
    reason: "Fora do eixo prioritário (MG), mas alinhado ao tema de patrimônio civil.",
    nextStep: "Aguardando retorno do time de investimento social (prazo ~30 dias).",
  },
];
