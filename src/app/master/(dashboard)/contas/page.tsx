import { Ban, Trash2 } from "lucide-react";

import { listAccounts } from "@/lib/master";
import { actBanUser, actDeleteUser, actSetPlan, actUnbanUser } from "../../mod-actions";
import { formatDate } from "@/lib/taxonomy";

const PLAN_LABEL: Record<string, string> = {
  visitante: "Visitante",
  cadastrado: "Grátis",
  pro: "Membro",
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
          {rows.length} contas. Promova a membro, bane ou exclua. Contas de demonstração
          (@seed) ficam ocultas.
        </p>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome ou e-mail"
          className="w-full max-w-sm rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button className="btn-museum">Buscar</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-3">Conta</th>
              <th className="py-2 pr-3">Plano</th>
              <th className="py-2 pr-3">Desde</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-ink/8 align-top">
                <td className="py-3 pr-3">
                  <p className="font-semibold text-ink">
                    {u.name}
                    {u.bannedAt && (
                      <span className="ml-2 bg-crit/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-crit">
                        banido
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{u.email}</p>
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
                </td>
                <td className="py-3 pr-3">
                  <form action={actSetPlan} className="flex items-center gap-1">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="plan"
                      defaultValue={u.plan === "pro" ? "pro" : "cadastrado"}
                      className="rounded-btn border border-border-strong bg-surface px-1.5 py-1 text-xs"
                    >
                      <option value="cadastrado">Grátis</option>
                      <option value="pro">Membro</option>
                    </select>
                    <button className="text-[11px] font-bold uppercase text-green-ink hover:underline">
                      ok
                    </button>
                  </form>
                  <span className="text-[11px] text-muted">{PLAN_LABEL[u.plan]}</span>
                </td>
                <td className="py-3 pr-3 text-xs text-ink-soft">
                  {formatDate(u.createdAt.toISOString())}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-3">
                    {u.bannedAt ? (
                      <form action={actUnbanUser}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="text-xs font-bold text-green-ink hover:underline">
                          Reativar
                        </button>
                      </form>
                    ) : (
                      <form action={actBanUser} className="flex items-center gap-1">
                        <input type="hidden" name="userId" value={u.id} />
                        <input
                          name="reason"
                          placeholder="motivo"
                          className="w-24 rounded-btn border border-border-strong bg-surface px-1.5 py-1 text-[11px] outline-none"
                        />
                        <button className="inline-flex items-center gap-1 text-xs font-bold text-crit hover:underline">
                          <Ban size={11} /> Banir
                        </button>
                      </form>
                    )}
                    <form action={actDeleteUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-crit">
                        <Trash2 size={11} /> Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
