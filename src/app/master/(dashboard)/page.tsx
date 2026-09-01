import Link from "next/link";
import { Users, BadgeCheck, FolderKanban, Wallet, Ban } from "lucide-react";

import { masterOverview } from "@/lib/master";
import { formatBRL } from "@/lib/taxonomy";

function Stat({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Users;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
        <Icon size={14} className="text-green-ink" />
        {label}
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

export default async function MasterHome() {
  const ov = await masterOverview();

  return (
    <div className="space-y-8">
      <div>
        <p className="kicker text-muted">Painel</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Visão geral</h1>
      </div>

      {ov.queue.total > 0 && (
        <Link
          href="/master/moderacao"
          className="flex items-center justify-between rounded-card border border-border bg-sunk px-4 py-3 text-sm font-semibold hover:bg-green-weak"
        >
          <span>
            <strong className="text-ink">{ov.queue.total}</strong> {ov.queue.total === 1 ? "item" : "itens"} aguardando
            moderação
            <span className="ml-2 text-muted">
              ({ov.queue.projetos} projetos · {ov.queue.editais} editais · {ov.queue.noticias} notícias
              {ov.queue.financiamento > 0 ? ` · ${ov.queue.financiamento} financiamento` : ""})
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-green-ink">Abrir →</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Contas" value={String(ov.totalUsers)} icon={Users} />
        <Stat
          label="Membros"
          value={String(ov.members)}
          sub={
            ov.comped > 0
              ? `MRR ${formatBRL(ov.mrrCents / 100)} · ${ov.comped} cortesia${ov.comped === 1 ? "" : "s"}`
              : `MRR estimado ${formatBRL(ov.mrrCents / 100)}`
          }
          icon={Wallet}
        />
        <Stat
          label="Profissionais"
          value={String(ov.prosTotal)}
          sub={`${ov.prosVerified} verificados`}
          icon={BadgeCheck}
        />
        <Stat label="Projetos publicados" value={String(ov.projPublished)} icon={FolderKanban} />
        <Stat label="Contas banidas" value={String(ov.banned)} icon={Ban} />
        <Stat label="Fila de moderação" value={String(ov.queue.total)} icon={FolderKanban} />
      </div>

      <div className="card p-5">
        <p className="kicker text-muted">Receita recorrente estimada</p>
        <p className="mt-1 text-xs text-ink-soft">
          Projeção pelo preço de cada trilha. Contas de cortesia não entram no cálculo.
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/12 text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="pb-2">Trilha</th>
              <th className="pb-2 text-right">Membros</th>
              <th className="pb-2 text-right">R$/mês</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ov.breakdown.length === 0 && (
              <tr>
                <td colSpan={4} className="py-3 text-center text-muted">
                  Nenhum membro ainda.
                </td>
              </tr>
            )}
            {ov.breakdown.map((b) => (
              <tr key={b.track} className="border-b border-ink/8">
                <td className="py-2">{b.label}</td>
                <td className="py-2 text-right tabular-nums">{b.members}</td>
                <td className="py-2 text-right tabular-nums">
                  {formatBRL(b.unitCents / 100)}
                </td>
                <td className="py-2 text-right font-bold tabular-nums">
                  {formatBRL(b.totalCents / 100)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="pt-2">MRR</td>
              <td className="pt-2 text-right tabular-nums">{ov.members}</td>
              <td className="pt-2" />
              <td className="pt-2 text-right tabular-nums text-green-ink">
                {formatBRL(ov.mrrCents / 100)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
