"use client";

import { useActionState, useState } from "react";

import { createProject } from "@/app/projetos/actions";
import { MediaUpload } from "@/components/media-upload";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { UFS, CONTRACT_TYPES, SENIORITY, WORK_MODES } from "@/lib/taxonomy";
import { fieldClass, textareaClass, labelClass } from "@/components/ui/field";

type State = { error?: string } | null;

export function NewProjectForm() {
  const [state, action, pending] = useActionState<State, FormData>(createProject, null);
  const [mode, setMode] = useState<"vaga" | "vitrine">("vaga");
  const [confidential, setConfidential] = useState(false);
  const isVaga = mode === "vaga";

  return (
    <form action={action} className="mt-6 space-y-6">
      <fieldset className="space-y-2">
        <legend className={labelClass}>O que você vai publicar?</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2.5 rounded-card border border-border-strong p-3.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-green-weak">
            <input
              type="radio"
              name="mode"
              value="vaga"
              checked={isVaga}
              onChange={() => setMode("vaga")}
              className="mt-0.5"
            />
            <span>
              <strong className="block">Uma vaga</strong>
              <span className="text-ink-soft">
                Contrate um profissional — recebe candidaturas.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5 rounded-card border border-border-strong p-3.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-green-weak">
            <input
              type="radio"
              name="mode"
              value="vitrine"
              checked={!isVaga}
              onChange={() => setMode("vitrine")}
              className="mt-0.5"
            />
            <span>
              <strong className="block">Um projeto para a vitrine</strong>
              <span className="text-ink-soft">Obra concluída, publicada como referência.</span>
            </span>
          </label>
        </div>
      </fieldset>

      {isVaga ? (
        <>
          <label className="block space-y-1.5">
            <span className={labelClass}>Função da vaga</span>
            <input
              name="vagaRole"
              required
              minLength={4}
              className={fieldClass}
              placeholder="Restaurador(a) de bens móveis — pleno"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1.5">
              <span className={labelClass}>Tipo de contrato</span>
              <select name="contractType" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Selecione
                </option>
                {Object.entries(CONTRACT_TYPES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Senioridade</span>
              <select name="seniority" defaultValue="" className={fieldClass}>
                <option value="">Indiferente</option>
                {Object.entries(SENIORITY).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Modelo de trabalho</span>
              <select name="workMode" defaultValue="" className={fieldClass}>
                <option value="">Indiferente</option>
                {Object.entries(WORK_MODES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="space-y-2">
            <legend className={labelClass}>Faixa salarial (opcional)</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="salaryMin"
                inputMode="numeric"
                disabled={confidential}
                className={fieldClass + (confidential ? " opacity-50" : "")}
                placeholder="Mínimo (R$/mês)"
              />
              <input
                name="salaryMax"
                inputMode="numeric"
                disabled={confidential}
                className={fieldClass + (confidential ? " opacity-50" : "")}
                placeholder="Máximo (R$/mês)"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="salaryConfidential"
                checked={confidential}
                onChange={(e) => setConfidential(e.target.checked)}
              />
              Salário a combinar (o valor aparece borrado no card)
            </label>
          </fieldset>
        </>
      ) : (
        <label className="block space-y-1.5">
          <span className={labelClass}>Título do projeto</span>
          <input
            name="title"
            required
            minLength={6}
            className={fieldClass}
            placeholder="Restauro da fachada da Igreja de São Francisco"
          />
        </label>
      )}

      <label className="block space-y-1.5">
        <span className={labelClass}>{isVaga ? "Descrição da vaga" : "Descrição do projeto"}</span>
        <textarea
          name="summary"
          required
          minLength={40}
          rows={4}
          className={textareaClass}
          placeholder={
            isVaga
              ? "Responsabilidades, requisitos, sobre o escritório e a obra…"
              : "Escopo, estado de conservação, objetivos da intervenção…"
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {!isVaga && (
          <>
            <label className="block space-y-1.5">
              <span className={labelClass}>Bem / imóvel</span>
              <input
                name="assetName"
                required
                className={fieldClass}
                placeholder="Igreja de São Francisco de Assis"
              />
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Ano (opcional)</span>
              <input name="year" inputMode="numeric" className={fieldClass} placeholder="2026" />
            </label>
          </>
        )}
        <label className="block space-y-1.5">
          <span className={labelClass}>UF</span>
          <select name="uf" required defaultValue="" className={fieldClass}>
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
        <label className="block space-y-1.5">
          <span className={labelClass}>Cidade</span>
          <input name="city" required className={fieldClass} placeholder="Ouro Preto" />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>
          {isVaga ? "Áreas de atuação desejadas" : "Especialidades"}
        </legend>
        <div className="space-y-3">
          {CATEGORY_GROUPS.map((g) => (
            <details key={g.key} className="rounded-card border border-border">
              <summary className="cursor-pointer px-3.5 py-2.5 text-sm font-semibold text-ink">
                {g.label}
              </summary>
              <div className="grid gap-1.5 px-3.5 pb-3 sm:grid-cols-2">
                {g.specialties.map((s) => (
                  <label key={s.key} className="flex items-center gap-2 text-sm text-ink-soft">
                    <input type="checkbox" name="specialties" value={s.key} />
                    {s.label}
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </fieldset>

      {!isVaga && <MediaUpload />}

      {state?.error ? (
        <p className="rounded-btn bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
        <span className="font-semibold text-ink">Antes de ir ao ar:</span> tudo passa por revisão
        do time da Patrinu.
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
        {pending ? "Enviando…" : "Enviar para análise"}
      </button>
    </form>
  );
}
