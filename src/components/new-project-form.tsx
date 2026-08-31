"use client";

import { useActionState } from "react";

import { createProject } from "@/app/projetos/actions";
import { MediaUpload } from "@/components/media-upload";
import { SPECIALTIES, UFS } from "@/lib/taxonomy";

type State = { error?: string } | null;

const field =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink";

export function NewProjectForm() {
  const [state, action, pending] = useActionState<State, FormData>(createProject, null);

  return (
    <form action={action} className="mt-6 space-y-5">
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-semibold text-ink">Tipo de publicação</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2 border border-ink/20 p-3 text-sm has-[:checked]:border-green-ink has-[:checked]:bg-green-weak">
            <input type="radio" name="mode" value="aberto" defaultChecked className="mt-0.5" />
            <span>
              <strong className="block">Oportunidade</strong>
              <span className="text-ink-soft">
                Busco profissionais para executar — recebe propostas.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 border border-ink/20 p-3 text-sm has-[:checked]:border-green-ink has-[:checked]:bg-green-weak">
            <input type="radio" name="mode" value="vitrine" className="mt-0.5" />
            <span>
              <strong className="block">Projeto para a vitrine</strong>
              <span className="text-ink-soft">Obra concluída, publicada como referência.</span>
            </span>
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Título</span>
        <input name="title" required minLength={6} className={field} placeholder="Restauro da fachada da Igreja de São Francisco" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Descrição</span>
        <textarea name="summary" required minLength={40} rows={4} className={field} placeholder="Escopo, estado de conservação, objetivos da intervenção…" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Bem / imóvel</span>
          <input name="assetName" required className={field} placeholder="Igreja de São Francisco de Assis" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Ano (opcional)</span>
          <input name="year" inputMode="numeric" className={field} placeholder="2026" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">UF</span>
          <select name="uf" required defaultValue="" className={field}>
            <option value="" disabled>
              Selecione
            </option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Cidade</span>
          <input name="city" required className={field} placeholder="Ouro Preto" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">
          Faixa de orçamento (opcional)
        </span>
        <input name="budgetRange" className={field} placeholder="R$ 80 mil – R$ 120 mil" />
      </label>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-semibold text-ink">Especialidades</legend>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {Object.entries(SPECIALTIES).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="specialties" value={key} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <MediaUpload />

      {state?.error ? (
        <p className="rounded-lg bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-lg bg-sunk px-3 py-2 text-sm text-ink-soft">
        <span className="font-semibold text-ink">Antes de ir ao ar:</span> todo projeto
        passa por revisão do time da Patrinu.
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar para análise"}
      </button>
    </form>
  );
}
