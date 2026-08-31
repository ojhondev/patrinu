import { listMembers, mrr } from "@/lib/master";
import { formatBRL, formatDate } from "@/lib/taxonomy";
import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";

export default async function FinanceiroPage() {
  const [{ mrrCents, breakdown }, members] = await Promise.all([mrr(), listMembers()]);
  const arr = mrrCents * 12;

  return (
    <div className="space-y-8">
      <div>
        <p className="kicker text-muted">Assinaturas</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Financeiro</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Projeção — o pagamento real (Stripe / Mercado Pago) ainda não está ligado. Os
          valores vêm do plano de cada trilha.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-ink/12 bg-surface p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">MRR</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-green-ink">
            {formatBRL(mrrCents / 100)}
          </p>
        </div>
        <div className="border border-ink/12 bg-surface p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">ARR</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {formatBRL(arr / 100)}
          </p>
        </div>
        <div className="border border-ink/12 bg-surface p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Membros
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {members.length}
          </p>
        </div>
      </div>

      <div className="border border-ink/12 bg-surface p-5">
        <p className="kicker text-muted">Por trilha</p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {breakdown.map((b) => (
              <tr key={b.track} className="border-b border-ink/8">
                <td className="py-2">{b.label}</td>
                <td className="py-2 text-right tabular-nums">
                  {b.members} × {formatBRL(b.unitCents / 100)}
                </td>
                <td className="py-2 text-right font-bold tabular-nums">
                  {formatBRL(b.totalCents / 100)}
                </td>
              </tr>
            ))}
            {breakdown.length === 0 && (
              <tr>
                <td className="py-3 text-center text-muted">Nenhum membro ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <p className="kicker text-muted">Membros ({members.length})</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2 pr-3">Membro</th>
                <th className="py-2 pr-3">Trilha</th>
                <th className="py-2 pr-3">R$/mês</th>
                <th className="py-2">Desde</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-ink/8">
                  <td className="py-2 pr-3">
                    <span className="font-semibold text-ink">{m.name}</span>
                    <span className="block text-xs text-muted">{m.email}</span>
                  </td>
                  <td className="py-2 pr-3 text-ink-soft">
                    {TRACKS[m.track as ProTrack]?.label ?? "—"}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{formatBRL(m.priceCents / 100)}</td>
                  <td className="py-2 text-xs text-ink-soft">
                    {formatDate(m.since.toISOString())}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted">
                    Nenhum membro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
