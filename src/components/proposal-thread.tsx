import { formatDate } from "@/lib/taxonomy";
import { Badge } from "@/components/badge";
import { decideProposal, postMessage } from "@/app/painel/actions";
import { messagesForProposal, type ProposalRow } from "@/lib/interactions";

const STATUS: Record<
  ProposalRow["status"],
  { tone: "neutral" | "green" | "ok" | "crit"; label: string }
> = {
  enviada: { tone: "neutral", label: "enviada" },
  em_conversa: { tone: "green", label: "em conversa" },
  aceita: { tone: "ok", label: "aceita" },
  recusada: { tone: "crit", label: "recusada" },
};

export async function ProposalThread({
  proposal,
  viewer,
  currentUserId,
}: {
  proposal: ProposalRow;
  /** "owner" = dono do projeto; "proponent" = quem enviou a proposta */
  viewer: "owner" | "proponent";
  currentUserId: string;
}) {
  const messages = await messagesForProposal(proposal.id);
  const s = STATUS[proposal.status];
  const closed = proposal.status === "aceita" || proposal.status === "recusada";

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={s.tone}>{s.label}</Badge>
        <span className="text-xs text-muted">{formatDate(proposal.createdAt.toISOString())}</span>
      </div>

      <p className="mt-1.5 text-sm">
        {viewer === "owner" ? (
          <>
            <strong className="text-ink">{proposal.userName}</strong> propôs em{" "}
          </>
        ) : (
          <>Proposta para </>
        )}
        <a
          href={`/projetos/${proposal.projectSlug}`}
          className="font-semibold text-green-ink hover:underline"
        >
          {proposal.projectTitle}
        </a>
      </p>

      <p className="mt-2 whitespace-pre-wrap rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
        {proposal.message}
      </p>
      {proposal.priceRange && (
        <p className="mt-1 text-sm">
          <span className="text-muted">Faixa: </span>
          <strong className="text-ink">{proposal.priceRange}</strong>
        </p>
      )}
      {viewer === "owner" && (
        <p className="mt-1 text-xs text-muted">
          Contato: {proposal.userEmail}
        </p>
      )}

      {/* thread */}
      {messages.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-border pt-3">
          {messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <li
                key={m.id}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  mine
                    ? "ml-auto bg-green-weak text-ink"
                    : "mr-auto bg-sunk text-ink-soft"
                }`}
              >
                <span className="block text-[11px] font-semibold text-muted">
                  {mine ? "Você" : m.senderName} · {formatDate(m.createdAt.toISOString())}
                </span>
                <span className="whitespace-pre-wrap">{m.body}</span>
              </li>
            );
          })}
        </ul>
      )}

      {!closed && (
        <form action={postMessage} className="mt-3 flex gap-2">
          <input type="hidden" name="proposalId" value={proposal.id} />
          <input
            name="body"
            required
            placeholder="Escreva uma mensagem…"
            className="min-w-0 flex-1 rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
          >
            Enviar
          </button>
        </form>
      )}

      {viewer === "owner" && !closed && (
        <div className="mt-2 flex flex-wrap gap-2">
          <form action={decideProposal}>
            <input type="hidden" name="proposalId" value={proposal.id} />
            <input type="hidden" name="decision" value="aceita" />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Aceitar
            </button>
          </form>
          <form action={decideProposal}>
            <input type="hidden" name="proposalId" value={proposal.id} />
            <input type="hidden" name="decision" value="recusada" />
            <button
              type="submit"
              className="btn btn-danger btn-sm"
            >
              Recusar
            </button>
          </form>
        </div>
      )}

      {proposal.status === "aceita" && (
        <p className="mt-2 text-sm font-semibold text-ok">
          Proposta aceita — combinem os próximos passos por e-mail.
        </p>
      )}
    </div>
  );
}
