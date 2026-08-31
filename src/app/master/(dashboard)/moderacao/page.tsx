import { Check, X, ExternalLink } from "lucide-react";

import { pendingProjects } from "@/lib/projects";
import { pendingOpportunities } from "@/lib/opportunities";
import { pendingArticles } from "@/lib/directory";
import { moderateArticle, moderateOpportunity, moderateProject } from "../../actions";
import { formatBRL, formatDate, specialtyLabel } from "@/lib/taxonomy";

const input =
  "w-full border border-ink/20 bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-green-ink";

export default async function ModeracaoPage() {
  const [projs, editais, noticias] = await Promise.all([
    pendingProjects(),
    pendingOpportunities(),
    pendingArticles(),
  ]);

  return (
    <div className="space-y-12 [overflow-wrap:anywhere]">
      <div>
        <p className="kicker text-muted">Fila</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Moderação</h1>
      </div>

      {/* -------- PROJETOS -------- */}
      <section>
        <h2 className="text-lg font-bold">
          Projetos <span className="font-mono text-sm text-muted">({projs.length})</span>
        </h2>
        <div className="mt-4 space-y-3">
          {projs.length === 0 && <Empty>Nenhum projeto na fila.</Empty>}
          {projs.map((p) => {
            const mode =
              (p.requirements ?? []).find((r) => r.startsWith("__mode:"))?.slice(7) ?? "aberto";
            return (
              <div key={p.id} className="border border-ink/12 bg-surface p-4">
                <p className="text-xs text-muted">
                  {mode === "vitrine" ? "Vitrine" : "Brief aberto"} ·{" "}
                  {p.submittedAt ? formatDate(p.submittedAt.toISOString()) : "—"} · {p.city}/{p.uf}
                </p>
                <p className="mt-1 font-display font-bold text-ink">{p.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{p.summary}</p>
                {p.specialties.length > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {p.specialties.map((s) => specialtyLabel(s)).join(" · ")}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={moderateProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value="approve" />
                    <Approve>Aprovar e publicar</Approve>
                  </form>
                  <form action={moderateProject} className="flex gap-1.5">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value="reject" />
                    <input name="reason" placeholder="Motivo (opcional)" className="border border-ink/20 bg-surface px-2 py-1.5 text-xs outline-none" />
                    <Reject />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------- EDITAIS -------- */}
      <section>
        <h2 className="text-lg font-bold">
          Editais <span className="font-mono text-sm text-muted">({editais.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Do PNCP, triados por palavra-chave. Revise o resumo antes de aprovar.
        </p>
        <div className="mt-4 space-y-3">
          {editais.length === 0 && <Empty>Nada na fila. Rode a ingestão em Configurações.</Empty>}
          {editais.map(({ o, s }) => (
            <div key={o.id} className="border border-ink/12 bg-surface p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span>{s?.name ?? "PNCP"}</span>
                {o.deadlineAt && <span>prazo {formatDate(o.deadlineAt.toISOString())}</span>}
                {o.estimatedValue != null && <span>{formatBRL(Number(o.estimatedValue))}</span>}
                {o.uf && (
                  <span>
                    {o.city ? `${o.city}/` : ""}
                    {o.uf}
                  </span>
                )}
                {o.url && (
                  <a href={o.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-ink hover:underline">
                    PNCP <ExternalLink size={11} />
                  </a>
                )}
                <span>· casou: {(o.matchedTerms ?? []).join(", ") || "—"}</span>
              </div>
              <div className="mt-2 space-y-2">
                <form action={moderateOpportunity} className="space-y-2">
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="decision" value="aprovado" />
                  <input name="title" defaultValue={o.title} className={`${input} font-semibold`} />
                  <textarea name="summary" defaultValue={o.summary ?? o.object ?? ""} rows={3} className={input} />
                  <Approve>Aprovar e publicar</Approve>
                </form>
                <form action={moderateOpportunity}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="decision" value="recusado" />
                  <button type="submit" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-crit">
                    <X size={13} /> Recusar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------- NOTÍCIAS -------- */}
      <section>
        <h2 className="text-lg font-bold">
          Notícias <span className="font-mono text-sm text-muted">({noticias.length})</span>
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          O feed traz só a manchete e a fonte. <strong>Escreva o resumo e o texto</strong> —
          não publique com o rascunho.
        </p>
        <div className="mt-4 space-y-3">
          {noticias.length === 0 && <Empty>Nada na fila.</Empty>}
          {noticias.map((a) => (
            <div key={a.id} className="border border-ink/12 bg-surface p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span>{a.sourceName ?? "Fonte"}</span>
                <span>· {formatDate(a.publishedAt.toISOString())}</span>
                {a.sourceUrl && (
                  <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-ink hover:underline">
                    matéria original <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div className="mt-2 space-y-2">
                <form action={moderateArticle} className="space-y-2">
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="decision" value="publicado" />
                  <input name="title" defaultValue={a.title} className={`${input} font-semibold`} />
                  <textarea
                    name="excerpt"
                    defaultValue={a.excerpt.startsWith("(rascunho") ? "" : a.excerpt}
                    rows={2}
                    placeholder="Resumo / linha fina (obrigatório)"
                    className={input}
                  />
                  <textarea
                    name="body"
                    defaultValue={a.body.join("\n\n")}
                    rows={5}
                    placeholder="Texto da matéria — um parágrafo por linha em branco."
                    className={input}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select name="category" defaultValue={a.category} className="border border-ink/20 bg-surface px-2 py-1.5 text-sm">
                      {["obra", "tecnica", "politica", "mercado", "curso", "edital"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Approve>Publicar</Approve>
                  </div>
                </form>
                <form action={moderateArticle}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="decision" value="recusado" />
                  <button type="submit" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-crit">
                    <X size={13} /> Recusar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
      {children}
    </p>
  );
}
function Approve({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-1.5 bg-green px-3.5 py-2 text-sm font-bold text-white hover:bg-green-hover"
    >
      <Check size={15} /> {children}
    </button>
  );
}
function Reject() {
  return (
    <button
      type="submit"
      aria-label="Recusar"
      className="inline-flex items-center gap-1.5 border border-border-strong px-3 py-1.5 text-sm font-bold text-ink-soft hover:border-crit hover:text-crit"
    >
      <X size={15} />
    </button>
  );
}
