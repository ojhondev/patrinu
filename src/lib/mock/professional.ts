import type { SpecialtyKey } from "@/lib/taxonomy";

/** Perfil de demonstração — substituir pela sessão autenticada (src/db). */
export type DemoProfessional = {
  slug: string;
  displayName: string;
  headline: string;
  uf: string;
  city: string;
  specialties: SpecialtyKey[];
  techniques: string[];
  verified: boolean;
  plan: "free" | "pro";
  /** documentos no "cofre" — camada A do Marketplace */
  documents: { kind: string; title: string; label: string }[];
};

export const DEMO_PROFESSIONAL: DemoProfessional = {
  slug: "helena-braga",
  displayName: "Helena Braga",
  headline: "Conservadora-restauradora de bens integrados · talha e policromia",
  uf: "MG",
  city: "Mariana",
  specialties: ["bens_integrados", "bens_moveis"],
  techniques: ["talha", "douramento", "policromia", "reintegração cromática", "consolidação"],
  verified: true,
  plan: "pro",
  documents: [
    { kind: "registro_profissional", title: "ABRACOR — filiação ativa", label: "Registro profissional" },
    { kind: "art_rrt", title: "RRT nº 20250148820 — restauro de retábulo, Catas Altas", label: "ART/RRT" },
    {
      kind: "atestado_capacidade_tecnica",
      title: "Atestado — restauro da talha da Matriz de Nossa Senhora do Pilar (2024)",
      label: "Atestado de capacidade técnica",
    },
    { kind: "certidao", title: "Certidões negativas federal e estadual", label: "Regularidade fiscal" },
    { kind: "diploma", title: "Bacharelado em Conservação-Restauração — UFMG/CECOR", label: "Formação" },
  ],
};

/** Casa (de forma ingênua, para o mock) uma exigência de habilitação com o cofre. */
export function documentSatisfies(requirementLabel: string, pro: DemoProfessional): boolean {
  const l = requirementLabel.toLowerCase();
  const has = (...terms: string[]) =>
    pro.documents.some((d) => {
      const t = `${d.kind} ${d.title} ${d.label}`.toLowerCase();
      return terms.some((term) => t.includes(term));
    });

  if (l.includes("art") || l.includes("rrt")) return has("art", "rrt");
  if (l.includes("atestado")) return has("atestado");
  if (l.includes("cau") || l.includes("crea") || l.includes("registro") || l.includes("conselho"))
    return has("registro", "abracor", "art", "rrt");
  if (l.includes("formação") || l.includes("diploma") || l.includes("superior") || l.includes("conservação-restauro"))
    return has("diploma", "bacharelado", "formação");
  if (l.includes("certid") || l.includes("regularidade") || l.includes("fiscal") || l.includes("cndt"))
    return has("certid", "regularidade");
  return false;
}
