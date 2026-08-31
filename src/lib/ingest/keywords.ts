/**
 * Triagem por regras (sem IA): decide se um texto de edital/notícia é sobre
 * conservação e restauro de patrimônio. Ajuste as listas livremente.
 */

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ");

/** casa o termo como palavra(s) inteira(s), evitando "detalha" ⊃ "talha". */
function makeMatcher(term: string): RegExp {
  const t = norm(term).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${t}([^a-z0-9]|$)`);
}

/** Termos que indicam patrimônio/restauro. */
export const KEYWORDS = [
  "restauro",
  "restauracao",
  "conservacao preventiva",
  "conservacao-restauracao",
  "conservacao e restauracao",
  "patrimonio historico",
  "patrimonio cultural",
  "patrimonio edificado",
  "patrimonio arquitetonico",
  "bem tombado",
  "bens tombados",
  "bem cultural",
  "bens culturais",
  "tombamento",
  "tombado",
  "iphan",
  "iepha",
  "condephaat",
  "condepac",
  "patrimonio mundial",
  "patrimonio da humanidade",
  "centro historico",
  "conjunto arquitetonico",
  "sitio historico",
  "casario historico",
  "monumento",
  "igreja matriz",
  "capela",
  "santuario",
  "mosteiro",
  "convento",
  "se catedral",
  "casa de camara e cadeia",
  "sobrado colonial",
  "solar colonial",
  "solar historico",
  "engenho historico",
  "forte historico",
  "fortaleza historica",
  "talha",
  "douramento",
  "policromia",
  "retabulo",
  "altar-mor",
  "forro pintado",
  "pintura mural",
  "pintura de forro",
  "cantaria",
  "alvenaria de pedra",
  "argamassa de cal",
  "reboco historico",
  "azulejaria",
  "azulejo historico",
  "vitral",
  "vitrais",
  "reintegracao cromatica",
  "acervo museologico",
  "conservacao de acervo",
  "higienizacao de acervo",
  "pinacoteca",
  "arquivo historico",
  "acervo bibliografico",
  "arqueologia",
  "arqueologico",
  "prospeccao arqueologica",
  "resgate arqueologico",
  "sitio arqueologico",
  "projeto de restauracao",
  "projeto executivo de restauro",
  "projeto de conservacao",
  "restauro de fachada",
  "recuperacao de fachada historica",
  "laudo de estado de conservacao",
  "diagnostico de conservacao",
];

/** Termos que DERRUBAM o resultado (falsos positivos comuns de "restauração"). */
export const NEGATIVE = [
  "restauracao florestal",
  "restauracao ecologica",
  "restauracao da vegetacao",
  "restauracao ambiental",
  "recuperacao de area degradada",
  "restauracao de pastagem",
  "restauracao dental",
  "restauracao dentaria",
  "restaurante",
  "restauracao de veiculo",
  "restauracao de estradas",
  "restauracao de pavimento",
  "restauracao asfaltica",
  "energia solar",
  "usina solar",
  "microgeracao",
  "fotovoltaica",
  "fotovoltaico",
  "iluminacao publica",
];

const KW = KEYWORDS.map((k) => ({ label: k, re: makeMatcher(k) }));
const NEG = NEGATIVE.map(makeMatcher);

/** termos "fortes" — sozinhos já bastam; os demais precisam de reforço. */
const STRONG = new Set([
  "restauro",
  "restauracao",
  "conservacao-restauracao",
  "conservacao e restauracao",
  "patrimonio historico",
  "patrimonio cultural",
  "patrimonio edificado",
  "bem tombado",
  "bens tombados",
  "tombamento",
  "iphan",
  "iepha",
  "condephaat",
  "patrimonio mundial",
  "projeto de restauracao",
  "projeto executivo de restauro",
  "restauro de fachada",
  "conservacao de acervo",
]);

export type Triage = {
  relevant: boolean;
  score: number; // 0..1 grosseiro
  matched: string[];
};

export function triage(...texts: (string | null | undefined)[]): Triage {
  const hay = " " + norm(texts.filter(Boolean).join("  ")) + " ";
  if (!hay.trim()) return { relevant: false, score: 0, matched: [] };
  if (NEG.some((re) => re.test(hay))) return { relevant: false, score: 0, matched: [] };

  const matched = KW.filter((k) => k.re.test(hay)).map((k) => k.label);
  const hasStrong = matched.some((m) => STRONG.has(norm(m)));
  // relevante se: 1 termo forte, OU 2+ termos quaisquer
  const relevant = hasStrong || matched.length >= 2;
  const score = Math.min(1, (matched.length + (hasStrong ? 1 : 0)) / 3);
  return { relevant, score, matched };
}
