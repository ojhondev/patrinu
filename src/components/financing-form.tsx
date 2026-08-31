"use client";

import { useActionState } from "react";

import { submitFinancingRequest } from "@/app/comecar/actions";
import { UFS } from "@/lib/taxonomy";

type State = { error?: string } | null;

const field =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink";

export function FinancingForm({
  defaultName,
  defaultEmail,
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    submitFinancingRequest,
    null,
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Responsável</span>
          <input name="contactName" required defaultValue={defaultName} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">E-mail de contato</span>
          <input
            type="email"
            name="contactEmail"
            required
            defaultValue={defaultEmail}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">
            Organização proponente
          </span>
          <input name="organization" required className={field} placeholder="Fundação, diocese, prefeitura…" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Bem / imóvel</span>
          <input name="assetName" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">UF</span>
          <select name="uf" defaultValue="" className={field}>
            <option value="">—</option>
            {UFS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Cidade</span>
          <input name="city" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Estágio do projeto</span>
        <select name="projectStage" defaultValue="" className={field}>
          <option value="">—</option>
          <option>Ideia inicial</option>
          <option>Projeto básico em elaboração</option>
          <option>Projeto executivo pronto</option>
          <option>Aprovado em órgão de tutela</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Meta de captação</span>
          <input name="fundingGoal" className={field} placeholder="R$ 4,2 mi" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">
            Mecanismo pretendido
          </span>
          <input
            name="mechanism"
            className={field}
            placeholder="Lei Rouanet, lei estadual, edital de banco…"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Resumo do escopo</span>
        <textarea name="summary" rows={4} className={field} placeholder="O que precisa ser restaurado e por quê." />
      </label>

      {state?.error && (
        <p className="rounded-lg bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar para análise da Patrinu"}
      </button>
      <p className="text-xs text-muted">
        A equipe da Patrinu recebe o pedido e retorna com as fontes de financiamento com
        aderência ao seu projeto.
      </p>
    </form>
  );
}
