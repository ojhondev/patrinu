import { Ban, Trash2, Gift, Search } from "lucide-react";

import { listAccounts } from "@/lib/master";
import {
  actBanUser,
  actDeleteUser,
  actGrantPro,
  actRevokePro,
  actUnbanUser,
} from "../../mod-actions";
import { formatDate } from "@/lib/taxonomy";

const PLAN_LABEL: Record<string, string> = {
  visitante: "Visitante",
  cadastrado: "Grátis",
  pro: "Membro",
};

const TRACK_LABEL: Record<string, string> = {
  contratar: "Empresa (contratar)",
  oferecer: "Profissional (oferecer)",
  financiamento: "Financiamento",
};

export default async function ContasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const rows = await listAccounts(q);

  return (
    <div className="space-y-6">
      <div>
        <p className="kicker text-muted">Moderação</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Contas</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {rows.length} contas. Presenteie o Patrinu&nbsp;Pro, bane ou exclua. Cortesias não
          entram no MRR. Contas de demonstração (@seed) ficam ocultas.
        </p>
      </div>

      <form className="flex gap-2">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-btn border border-border-strong bg-surface px-3">
          <Search size={15} className="text-muted" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nome ou e-mail"
            className="h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <button className="btn btn-secondary btn-sm">Buscar</button>
      </form>

      {rows.length === 0 && (
        <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
          Nenhuma conta encontrada.
        </p>
      )}

      <div className="space-y-3">
        {rows.map((u) => {
          const isPro = u.plan === "pro";
          const isComp = isPro && u.planSource === "comp";
          return (
            <div key={u.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                    {u.name}
                    <span
                      className={
                        isPro
                          ? "rounded-pill bg-green-weak px-2 py-0.5 text-[11px] font-bold text-green-ink"
                          : "rounded-pill bg-sunk px-2 py-0.5 text-[11px] font-bold text-ink-soft"
                      }
                    >
                      {PLAN_LABEL[u.plan]}
                      {isComp && " · cortesia"}
                    </span>
                    {u.bannedAt && (
                      <span className="rounded-pill bg-crit/15 px-2 py-0.5 text-[10px] font-bold uppercase text-crit">
                        banido
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{u.email}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Desde {formatDate(u.createdAt.toISOString())}
                    {u.track && ` · trilha: ${TRACK_LABEL[u.track] ?? u.track}`}
                  </p>
                  {isComp && u.proNote && (
                    <p className="mt-1 text-xs italic text-ink-soft">“{u.proNote}”</p>
                  )}
                  {u.proSlug && (
                    <a
                      href={`/profissionais/${u.proSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-green-ink hover:underline"
                    >
                      perfil profissional →
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {u.bannedAt ? (
                    <form action={actUnbanUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="text-xs font-semibold text-green-ink hover:underline">
                        Reativar
                      </button>
                    </form>
                  ) : (
                    <form action={actBanUser} className="flex items-center gap-1">
                      <input type="hidden" name="userId" value={u.id} />
                      <input
                        name="reason"
                        placeholder="motivo"
                        className="w-24 rounded-btn border border-border-strong bg-surface px-2 py-1 text-[11px] outline-none"
                      />
                      <button className="inline-flex items-center gap-1 text-xs font-semibold text-crit hover:underline">
                        <Ban size={12} /> Banir
                      </button>
                    </form>
                  )}
                  <form action={actDeleteUser}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-crit">
                      <Trash2 size={12} /> Excluir
                    </button>
                  </form>
                </div>
              </div>

              {/* presentear / remover Pro */}
              <div className="mt-3 border-t border-border pt-3">
                {isPro ? (
                  <form action={actRevokePro} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <span className="text-xs text-ink-soft">
                      {isComp ? "Cortesia ativa." : "Membro pagante."}
                    </span>
                    <button className="btn btn-secondary btn-sm">Remover Pro</button>
                  </form>
                ) : (
                  <form action={actGrantPro} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <Gift size={13} className="text-green-ink" /> Presentear Pro:
                    </span>
                    <select
                      name="track"
                      defaultValue=""
                      className="rounded-btn border border-border-strong bg-surface px-2 py-1 text-xs"
                    >
                      <option value="">Sem trilha</option>
                      <option value="contratar">Empresa</option>
                      <option value="oferecer">Profissional</option>
                    </select>
                    <input
                      name="note"
                      placeholder="motivo / de quem é o presente (opcional)"
                      className="min-w-[180px] flex-1 rounded-btn border border-border-strong bg-surface px-2 py-1 text-xs outline-none"
                    />
                    <button className="btn btn-primary btn-sm">Conceder</button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
