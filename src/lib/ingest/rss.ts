/** Leitor de RSS 2.0 (Google News e portais). Sem dependências. */

export type RawArticle = {
  title: string;
  link: string;
  summary: string;
  /** corpo da matéria em parágrafos, quando o feed entrega texto (ex.: Agência Brasil). */
  paragraphs: string[];
  publishedAt: string | null;
  sourceName: string | null;
};

/** decodifica entidades HTML comuns. */
function entities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

/** valor de um campo estruturado: entidades → tira tags → normaliza espaço.
 *  NÃO remove URLs (senão zera o <link>). */
function unwrap(s: string): string {
  return entities(s)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** texto livre (resumo): unwrap + tira URLs cruas e o rodapé do Google Notícias. */
function cleanText(s: string): string {
  return unwrap(s)
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/view full coverage on google news/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** quebra um HTML de descrição/conteúdo em parágrafos de texto puro. */
function paragraphsOf(raw: string): string[] {
  return entities(raw)
    .split(/<\/p>|<br\s*\/?>|<\/div>|<\/li>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]*>/g, " ")
        .replace(/https?:\/\/\S+/gi, " ")
        .replace(/view full coverage on google news/gi, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((p) => p.length >= 30 && !/^(foto|imagem|crédito|legenda)[:\s]/i.test(p));
}

function field(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? unwrap(m[1]) : null;
}

function fieldRaw(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : null;
}

export async function collectRss(feedUrl: string): Promise<RawArticle[]> {
  const res = await fetch(feedUrl, {
    headers: { "user-agent": "PatrinuBot/1.0 (+https://patrinu.com)" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`RSS ${res.status} — ${feedUrl}`);
  const xml = await res.text();

  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const out: RawArticle[] = [];

  for (const block of items) {
    const rawTitle = field(block, "title");
    const link = field(block, "link");
    if (!rawTitle || !link) continue;

    // Google News: "Título da matéria - Nome do Veículo"
    let title = rawTitle;
    let sourceName = field(block, "source");
    const dash = title.lastIndexOf(" - ");
    if (!sourceName && dash > 20 && title.length - dash < 40) {
      sourceName = title.slice(dash + 3).trim();
      title = title.slice(0, dash).trim();
    }

    const pub = field(block, "pubDate") || field(block, "dc:date");
    const publishedAt =
      pub && !Number.isNaN(Date.parse(pub)) ? new Date(pub).toISOString() : null;

    const descRaw = fieldRaw(block, "content:encoded") || fieldRaw(block, "description") || "";
    const paragraphs = paragraphsOf(descRaw).slice(0, 40);

    out.push({
      title,
      link: link.trim(),
      summary: cleanText(fieldRaw(block, "description") || "").slice(0, 600),
      paragraphs,
      publishedAt,
      sourceName: sourceName?.replace(/\s+/g, " ").trim() || null,
    });
  }
  return out;
}
