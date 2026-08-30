import type { Project } from "./types";
import { MOCK_PROJECTS } from "./mock/projects";

const VITRINE: Project["status"][] = ["vitrine", "concluido", "em_execucao"];
const ABERTO: Project["status"][] = ["aberto", "em_captacao"];

export type ProjectMode = "vitrine" | "abertos" | "todos";

export async function listProjects(
  opts: { mode?: ProjectMode; q?: string; specialty?: string; uf?: string } = {},
): Promise<Project[]> {
  const { mode = "todos", q, specialty, uf } = opts;
  return MOCK_PROJECTS.filter((p) => {
    if (mode === "vitrine" && !VITRINE.includes(p.status)) return false;
    if (mode === "abertos" && !ABERTO.includes(p.status)) return false;
    if (uf && p.uf !== uf) return false;
    if (specialty && !p.specialties.includes(specialty as Project["specialties"][number]))
      return false;
    if (q) {
      const hay = `${p.title} ${p.summary} ${p.assetName} ${p.city} ${p.techniques.join(" ")}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getProject(slug: string): Promise<Project | null> {
  return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
}

export async function featuredProjects(limit = 6): Promise<Project[]> {
  return MOCK_PROJECTS.filter((p) => p.featured).slice(0, limit);
}

export async function projectsByProfessional(slug: string): Promise<Project[]> {
  return MOCK_PROJECTS.filter((p) => p.credits.some((c) => c.slug === slug));
}
