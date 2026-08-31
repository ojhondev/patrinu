/** Coletor PNCP — Portal Nacional de Contratações Públicas. API aberta, sem chave. */

const BASE = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao";

/** Modalidades que interessam: 4 concorrência, 6 pregão, 8 dispensa, 9 inexigibilidade. */
export const MODALIDADES = [4, 6, 8, 9];

const PAGE_SIZE = 50;
const MAX_PAGES = 10; // teto por modalidade/execução
const DELAY_MS = 700; // PNCP retorna 429 se as chamadas forem rápidas demais

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ESFERA: Record<string, "federal" | "estadual" | "municipal" | "privado"> = {
  F: "federal",
  E: "estadual",
  M: "municipal",
  D: "federal",
};

export type RawOpportunity = {
  externalId: string;
  url: string | null;
  title: string;
  object: string;
  organ: string;
  organScope: "federal" | "estadual" | "municipal" | "privado" | "internacional";
  uf: string | null;
  city: string | null;
  estimatedValue: number | null;
  kind: "licitacao" | "edital" | "chamamento" | "credenciamento";
  publishedAt: string | null;
  deadlineAt: string | null;
  raw: unknown;
};

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function pncpLink(numeroControle: string | null | undefined): string | null {
  // "83021808000182-1-000489/2026" → app/editais/83021808000182/2026/489
  if (!numeroControle) return null;
  const m = numeroControle.match(/^(\d+)-\d+-0*(\d+)\/(\d{4})$/);
  if (!m) return null;
  return `https://pncp.gov.br/app/editais/${m[1]}/${m[3]}/${m[2]}`;
}

async function fetchPage(
  modalidade: number,
  from: string,
  to: string,
  pagina: number,
): Promise<{ items: Record<string, unknown>[]; totalPaginas: number }> {
  const url = `${BASE}?dataInicial=${from}&dataFinal=${to}&codigoModalidadeContratacao=${modalidade}&pagina=${pagina}&tamanhoPagina=${PAGE_SIZE}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`PNCP ${res.status} (modalidade ${modalidade}, pág ${pagina})`);
    const json = (await res.json()) as {
      data?: Record<string, unknown>[];
      totalPaginas?: number;
    };
    return { items: json.data ?? [], totalPaginas: json.totalPaginas ?? 1 };
  }
  throw new Error(`PNCP instável (modalidade ${modalidade}, pág ${pagina})`);
}

function map(item: Record<string, unknown>): RawOpportunity {
  const orgao = (item.orgaoEntidade ?? {}) as Record<string, unknown>;
  const unidade = (item.unidadeOrgao ?? {}) as Record<string, unknown>;
  const objeto = String(item.objetoCompra ?? "").replace(/\s+/g, " ").trim();
  const numeroControle = item.numeroControlePNCP as string | undefined;

  return {
    externalId: numeroControle ?? `${orgao.cnpj}-${item.anoCompra}-${item.sequencialCompra}`,
    url: (item.linkSistemaOrigem as string) || pncpLink(numeroControle),
    title: objeto.length > 140 ? objeto.slice(0, 137) + "…" : objeto,
    object: objeto,
    organ: [orgao.razaoSocial, unidade.nomeUnidade].filter(Boolean).join(" — "),
    organScope: ESFERA[String(orgao.esferaId ?? "")] ?? "municipal",
    uf: (unidade.ufSigla as string) || null,
    city: (unidade.municipioNome as string) || null,
    estimatedValue:
      typeof item.valorTotalEstimado === "number" && item.valorTotalEstimado > 0
        ? item.valorTotalEstimado
        : null,
    kind: "licitacao",
    publishedAt: (item.dataPublicacaoPncp as string) ?? null,
    deadlineAt: (item.dataEncerramentoProposta as string) ?? null,
    raw: item,
  };
}

/** Busca as contratações publicadas nos últimos `days` dias, em todas as modalidades. */
export async function collectPncp(days = 3): Promise<RawOpportunity[]> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 86_400_000);
  const f = ymd(from);
  const t = ymd(to);

  const out: RawOpportunity[] = [];
  const seen = new Set<string>();

  for (const modalidade of MODALIDADES) {
    let totalPaginas = 1;
    for (let pagina = 1; pagina <= Math.min(totalPaginas, MAX_PAGES); pagina++) {
      let page;
      try {
        page = await fetchPage(modalidade, f, t, pagina);
      } catch (err) {
        console.error("[pncp]", err instanceof Error ? err.message : err);
        break;
      }
      totalPaginas = page.totalPaginas;
      for (const item of page.items) {
        const mapped = map(item);
        if (mapped.object.length < 20) continue;
        if (seen.has(mapped.externalId)) continue;
        seen.add(mapped.externalId);
        out.push(mapped);
      }
      await sleep(DELAY_MS);
    }
    await sleep(DELAY_MS);
  }
  return out;
}
