/** Leitor de RSS 2.0 (Google News e portais). Sem dependências. */

export type RawArticle = {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  sourceName: string | null;
};

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : null;
}

export async function collectRss(feedUrl: string): Promise<RawArticle[]> {
  const res = await fetch(feedUrl, {
    headers: { "user-agent": "PatrinuBot/1.0 (+https://patrinu.vercel.app)" },
  });
  if (!res.ok) throw new Error(`RSS ${res.status} — ${feedUrl}`);
  const xml = await res.text();

  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const out: RawArticle[] = [];

  for (const block of items) {
    const rawTitle = tag(block, "title");
    const link = tag(block, "link");
    if (!rawTitle || !link) continue;

    // Google News: "Título da matéria - Nome do Veículo"
    let title = rawTitle;
    let sourceName = tag(block, "source");
    const dash = title.lastIndexOf(" - ");
    if (!sourceName && dash > 20 && title.length - dash < 40) {
      sourceName = title.slice(dash + 3).trim();
      title = title.slice(0, dash).trim();
    }

    const pub = tag(block, "pubDate") || tag(block, "dc:date");
    const publishedAt = pub && !Number.isNaN(Date.parse(pub))
      ? new Date(pub).toISOString()
      : null;

    out.push({
      title,
      link: link.trim(),
      summary: (tag(block, "description") || "").slice(0, 600),
      publishedAt,
      sourceName: sourceName?.replace(/\s+/g, " ").trim() || null,
    });
  }
  return out;
}
