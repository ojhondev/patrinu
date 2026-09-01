import { listProjects } from "./projects";
import { listProfessionals, listArticles, listCourses } from "./directory";
import { listOpportunities } from "./opportunities";
import type { Project, Professional, Opportunity, Article, Course } from "./types";

export type SearchResults = {
  q: string;
  vagas: Project[];
  projetos: Project[];
  profissionais: Professional[];
  editais: Opportunity[];
  noticias: Article[];
  cursos: Course[];
  total: number;
};

const CAP = 8;

/** Busca geral em todas as verticais. */
export async function searchAll(qRaw: string): Promise<SearchResults> {
  const q = qRaw.trim();
  if (!q) {
    return {
      q,
      vagas: [],
      projetos: [],
      profissionais: [],
      editais: [],
      noticias: [],
      cursos: [],
      total: 0,
    };
  }

  const [vagas, projetos, profissionais, editais, noticias, cursos] = await Promise.all([
    listProjects({ mode: "abertos", entryKind: "vaga", q }),
    listProjects({ mode: "vitrine", entryKind: "projeto", q }),
    listProfessionals({ q }),
    listOpportunities({ q }),
    listArticles(undefined, q),
    listCourses({ q }),
  ]);

  const cut = <T,>(a: T[]) => a.slice(0, CAP);
  const total =
    vagas.length +
    projetos.length +
    profissionais.length +
    editais.length +
    noticias.length +
    cursos.length;

  return {
    q,
    vagas: cut(vagas),
    projetos: cut(projetos),
    profissionais: cut(profissionais),
    editais: cut(editais),
    noticias: cut(noticias),
    cursos: cut(cursos),
    total,
  };
}
