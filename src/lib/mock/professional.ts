import { DEMO_PROFESSIONAL } from "./professionals";

export { DEMO_PROFESSIONAL };

/** Cofre de documentos do perfil de demonstração — camada A do Marketplace (Editais). */
export const DEMO_DOCUMENTS: { kind: string; title: string; label: string }[] = [
  { kind: "registro_profissional", title: "ABRACOR — filiação ativa", label: "Registro profissional" },
  { kind: "art_rrt", title: "RRT nº 20250148820 — restauro de retábulo, Catas Altas", label: "ART/RRT" },
  {
    kind: "atestado_capacidade_tecnica",
    title: "Atestado — restauro da talha da Matriz de Nossa Senhora do Pilar (2024)",
    label: "Atestado de capacidade técnica",
  },
  { kind: "certidao", title: "Certidões negativas federal e estadual", label: "Regularidade fiscal" },
  { kind: "diploma", title: "Bacharelado em Conservação-Restauração — UFMG/CECOR", label: "Formação" },
];

/** Casa (de forma ingênua, para o mock) uma exigência de habilitação com o cofre. */
export function documentSatisfies(requirementLabel: string): boolean {
  const l = requirementLabel.toLowerCase();
  const has = (...terms: string[]) =>
    DEMO_DOCUMENTS.some((d) => {
      const t = `${d.kind} ${d.title} ${d.label}`.toLowerCase();
      return terms.some((term) => t.includes(term));
    });

  if (l.includes("art") || l.includes("rrt")) return has("art", "rrt");
  if (l.includes("atestado")) return has("atestado");
  if (l.includes("cau") || l.includes("crea") || l.includes("registro") || l.includes("conselho"))
    return has("registro", "abracor", "art", "rrt");
  if (
    l.includes("formação") ||
    l.includes("diploma") ||
    l.includes("superior") ||
    l.includes("conservação-restauro")
  )
    return has("diploma", "bacharelado", "formação");
  if (l.includes("certid") || l.includes("regularidade") || l.includes("fiscal") || l.includes("cndt"))
    return has("certid", "regularidade");
  return false;
}
