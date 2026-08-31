import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { articles, opportunities, sources } from "@/db/schema";
import { collectPncp } from "./pncp";
import { collectRss } from "./rss";
import { triage } from "./keywords";

/* ------------------------------------------------------------------ */
/* Fontes de ingestão (criadas no 1º run)                              */
/* ------------------------------------------------------------------ */

type NewsFeed = {
  slug: string;
  name: string;
  feedUrl: string;
  /** feed com licença aberta (CC-BY): pode publicar o texto na íntegra com crédito. */
  openLicense?: boolean;
  /** crédito/assinatura quando publicado automaticamente. */
  credit?: string;
};

const NEWS_FEEDS: NewsFeed[] = [
  {
    slug: "gnews-patrimonio-restauro",
    name: "Google Notícias — patrimônio / restauro",
    feedUrl:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(
        "(restauro OR restauração OR tombamento OR patrimônio) (igreja OR museu OR histórico OR IPHAN OR colonial OR barroco OR fachada)",
      ) +
      "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    slug: "gnews-iphan-tombamento",
    name: "Google Notícias — IPHAN / tombamento",
    feedUrl:
      "https://news.google.com/rss/search?q=IPHAN%20tombamento%20OR%20%22bem%20tombado%22&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    slug: "gnews-restauro-igreja-museu",
    name: "Google Notícias — restauro de igreja/museu",
    feedUrl:
      "https://news.google.com/rss/search?q=restauro%20(igreja%20OR%20museu%20OR%20acervo%20OR%20fachada%20OR%20talha)&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    slug: "agenciabrasil-cultura",
    name: "Agência Brasil — Cultura",
    feedUrl: "https://agenciabrasil.ebc.com.br/rss/cultura/feed.xml",
    openLicense: true, // CC-BY 3.0 Brasil — republicação permitida com crédito
    credit: "Agência Brasil",
  },
];

async function ensureSource(input: {
  slug: string;
  name: string;
  kind: "edital" | "noticia";
  access: "api" | "scraping" | "monitorar";
  feedUrl?: string;
}) {
  const [existing] = await db
    .select()
    .from(sources)
    .where(eq(sources.slug, input.slug))
    .limit(1);
  if (existing) return existing;
  const [row] = await db
    .insert(sources)
    .values({
      slug: input.slug,
      name: input.name,
      kind: input.kind,
      access: input.access,
      tier: 0,
      active: true,
      feedUrl: input.feedUrl ?? null,
    })
    .returning();
  return row;
}

/* ------------------------------------------------------------------ */
/* Heurísticas de classificação (sem IA)                               */
/* ------------------------------------------------------------------ */

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function guessSpecialties(matched: string[]): string[] {
  const m = matched.map(norm).join(" ");
  const out = new Set<string>();
  if (/talha|douramento|policromia|retabulo|altar|forro pintado|pintura mural/.test(m))
    out.add("bens_integrados");
  if (/bem movel|bens moveis|escultura|imagem|tela|mobiliario/.test(m)) out.add("bens_moveis");
  if (/fachada|cantaria|alvenaria|argamassa|reboco|edificado|arquitetonico|conjunto arquitetonico|casa de camara|sobrado|solar|monumento|igreja|capela|mosteiro|convento/.test(m))
    out.add("arquitetura");
  if (/arqueolog/.test(m)) out.add("arqueologia");
  if (/acervo|museologico|pinacoteca|arquivo|bibliografico/.test(m)) out.add("acervo");
  if (/documental|bibliografico|arquivo historico/.test(m)) out.add("documental");
  if (/azulej/.test(m)) out.add("bens_integrados");
  return out.size ? [...out] : ["arquitetura"];
}

function guessCategory(text: string): string {
  const t = norm(text);
  if (/edital|licita|chamamento|pregao|concorrencia|selecao publica/.test(t)) return "edital";
  if (
    /lei |rouanet|pac |ministerio|politica|governo|decreto|recurso federal|tombamento|iphan|tomba(r|do)|patrimonio nacional/.test(
      t,
    )
  )
    return "politica";
  if (/tecnica|metodo|argamassa|conservacao preventiva|estudo|pesquisa/.test(t))
    return "tecnica";
  if (/curso|oficina|formacao|workshop|pos-graduacao/.test(t)) return "curso";
  if (/mercado|empresa|contrato|investimento|leilao/.test(t)) return "mercado";
  return "obra";
}

/** chave grosseira para dedupe de manchetes: primeiras 6 palavras "fortes". */
function dedupeKey(title: string): string {
  return norm(title)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 6)
    .sort()
    .join(" ");
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

/* ------------------------------------------------------------------ */
/* Execução                                                            */
/* ------------------------------------------------------------------ */

export type IngestResult = {
  editais: { checked: number; matched: number; inserted: number };
  noticias: { checked: number; matched: number; inserted: number; published: number };
  ranAt: string;
};

export async function runIngest(): Promise<IngestResult> {
  const result: IngestResult = {
    editais: { checked: 0, matched: 0, inserted: 0 },
    noticias: { checked: 0, matched: 0, inserted: 0, published: 0 },
    ranAt: new Date().toISOString(),
  };

  // teto do plano Hobby = 60s. Notícias rodam primeiro (rápidas); o PNCP
  // (instável, lento) fica com o tempo que sobrar até ~45s.
  const PNCP_DEADLINE = Date.now() + 45_000;

  /* ---- NOTÍCIAS: RSS ---- */
  const NEWS_MAX_AGE_MS = 10 * 86_400_000; // matérias dos últimos 10 dias
  const NEWS_CAP = 30; // teto de novas notícias por execução
  const titleSeen = new Set<string>();
  // pré-carrega títulos recentes já no banco para não repetir a mesma história
  const recent = await db
    .select({ title: articles.title })
    .from(articles)
    .orderBy(desc(articles.publishedAt))
    .limit(400);
  for (const r of recent) titleSeen.add(dedupeKey(r.title));

  for (const feed of NEWS_FEEDS) {
    if (result.noticias.inserted >= NEWS_CAP) break;
    const src = await ensureSource({
      slug: feed.slug,
      name: feed.name,
      kind: "noticia",
      access: "api",
      feedUrl: feed.feedUrl,
    });

    const raw = await collectRss(feed.feedUrl).catch((e) => {
      console.error(`[ingest] feed ${feed.slug} falhou:`, e);
      return [];
    });
    result.noticias.checked += raw.length;

    for (const item of raw) {
      if (result.noticias.inserted >= NEWS_CAP) break;

      // recência
      if (item.publishedAt) {
        const age = Date.now() - Date.parse(item.publishedAt);
        if (age > NEWS_MAX_AGE_MS || age < -86_400_000) continue;
      }
      // dedupe por título normalizado (mesma história em vários veículos)
      const key = dedupeKey(item.title);
      if (titleSeen.has(key)) continue;

      const tri = triage(item.title, item.summary);
      if (!tri.relevant) continue;
      result.noticias.matched++;
      titleSeen.add(key);

      const [dup] = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.sourceUrl, item.link))
        .limit(1);
      if (dup) continue;

      let slug = slugify(item.title) || `noticia-${Date.now()}`;
      const [clash] = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);
      if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

      const clean = item.summary.replace(/\s+/g, " ").trim();
      const paras = item.paragraphs
        .map((p) => p.replace(/\s+/g, " ").trim())
        .filter((p) => p.length >= 30);
      const bodyText = paras.join(" ");
      const hasBody = paras.length >= 2 && bodyText.length >= 300;

      // publica sozinho só quando: feed de licença aberta + tem corpo de verdade
      // + casamento forte (termo STRONG e ao menos 2 termos no total)
      const canAuto =
        Boolean(feed.openLicense) && hasBody && tri.hasStrong && tri.matched.length >= 2;

      const excerpt = hasBody
        ? paras[0].slice(0, 280)
        : clean.length >= 60
          ? clean.slice(0, 280)
          : "(rascunho — escreva o resumo da matéria antes de publicar)";
      const body = hasBody ? paras : clean.length >= 60 ? [clean] : [];
      const words = bodyText ? bodyText.split(/\s+/).length : 0;

      await db.insert(articles).values({
        slug,
        title: item.title,
        excerpt,
        body,
        category: guessCategory(`${item.title} ${clean}`),
        author: canAuto ? feed.credit ?? "Agência Brasil" : "Redação Patrinu",
        sourceName: item.sourceName ?? (feed.openLicense ? feed.credit ?? null : null),
        sourceUrl: item.link,
        readingMinutes: words ? Math.min(15, Math.max(2, Math.round(words / 200))) : 2,
        reviewStatus: canAuto ? "publicado" : "pendente",
        matchedTerms: tri.matched,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      });
      result.noticias.inserted++;
      if (canAuto) result.noticias.published++;
    }
    await db.update(sources).set({ lastIngestedAt: new Date() }).where(eq(sources.id, src.id));
  }

  /* ---- EDITAIS: PNCP (com o tempo que sobrou) ---- */
  const pncpSource = await ensureSource({
    slug: "pncp",
    name: "PNCP — Portal Nacional de Contratações Públicas",
    kind: "edital",
    access: "api",
    feedUrl: "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao",
  });

  const rawOpps = await collectPncp(2, PNCP_DEADLINE).catch((e) => {
    console.error("[ingest] PNCP falhou:", e);
    return [];
  });
  result.editais.checked = rawOpps.length;

  for (const op of rawOpps) {
    const tri = triage(op.title, op.object);
    if (!tri.relevant) continue;
    result.editais.matched++;

    const [dup] = await db
      .select({ id: opportunities.id })
      .from(opportunities)
      .where(
        and(
          eq(opportunities.sourceId, pncpSource.id),
          eq(opportunities.externalId, op.externalId),
        ),
      )
      .limit(1);
    if (dup) continue;

    const deadline = op.deadlineAt ? new Date(op.deadlineAt) : null;
    await db.insert(opportunities).values({
      sourceId: pncpSource.id,
      externalId: op.externalId,
      url: op.url,
      kind: "licitacao",
      status: deadline && deadline.getTime() < Date.now() ? "encerrada" : "aberta",
      title: op.title,
      summary: op.object.slice(0, 400),
      object: op.object,
      organ: op.organ || "—",
      organScope: op.organScope,
      uf: op.uf,
      city: op.city,
      estimatedValue: op.estimatedValue != null ? String(op.estimatedValue) : null,
      specialties: guessSpecialties(tri.matched),
      publishedAt: op.publishedAt ? new Date(op.publishedAt) : null,
      deadlineAt: deadline,
      relevanceScore: tri.score,
      reviewStatus: "pendente",
      matchedTerms: tri.matched,
      raw: op.raw,
    });
    result.editais.inserted++;
  }
  await db
    .update(sources)
    .set({ lastIngestedAt: new Date() })
    .where(eq(sources.id, pncpSource.id));

  return result;
}

/** contagem para o badge do painel Master */
export async function pendingIngestCounts() {
  const [e] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(opportunities)
    .where(eq(opportunities.reviewStatus, "pendente"));
  const [n] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(articles)
    .where(eq(articles.reviewStatus, "pendente"));
  return { editais: e?.n ?? 0, noticias: n?.n ?? 0 };
}
