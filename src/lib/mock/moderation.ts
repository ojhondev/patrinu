export type PendingItem = {
  id: string;
  kind: "projeto" | "edital" | "curso" | "vaga";
  title: string;
  submittedBy: string;
  submittedAt: string;
  note?: string;
};

/** Fila de moderação de demonstração. O master aprova antes de publicar. */
export const MOCK_PENDING: PendingItem[] = [
  {
    id: "mod-1",
    kind: "projeto",
    title: "Restauro do coro alto e órgão da Igreja de São Bento",
    submittedBy: "Mosteiro de São Bento (contratante)",
    submittedAt: "2026-08-30T09:12:00Z",
    note: "Projeto aberto para propostas, orçamento R$ 600 mil.",
  },
  {
    id: "mod-2",
    kind: "vaga",
    title: "Técnico(a) em conservação de bens móveis — Belo Horizonte",
    submittedBy: "Ateliê Tângere",
    submittedAt: "2026-08-30T08:40:00Z",
  },
  {
    id: "mod-3",
    kind: "curso",
    title: "Oficina de encadernação e restauro de livros — turma março",
    submittedBy: "Instituto de Conservação (parceiro)",
    submittedAt: "2026-08-29T16:20:00Z",
    note: "Pedido de divulgação no diretório de cursos.",
  },
  {
    id: "mod-4",
    kind: "edital",
    title: "Chamamento — restauro de forro pintado, Prefeitura de Tiradentes",
    submittedBy: "Ingestão automática (Querido Diário)",
    submittedAt: "2026-08-29T11:05:00Z",
    note: "Classificado como patrimônio (0.91). Revisar objeto e valor extraídos.",
  },
];
