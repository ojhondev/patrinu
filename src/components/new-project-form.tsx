"use client";

import { useActionState, useState } from "react";

import { createProject, editProject } from "@/app/projetos/actions";
import { MediaUpload } from "@/components/media-upload";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { UFS, CONTRACT_TYPES, SENIORITY, WORK_MODES } from "@/lib/taxonomy";
import { fieldClass, textareaClass, labelClass } from "@/components/ui/field";

type State = { error?: string } | null;

export type ProjectFormValues = {
  mode: "vaga" | "vitrine";
  title: string;
  vagaRole: string;
  summary: string;
  assetName: string;
  uf: string;
  city: string;
  year: string;
  specialties: string[];
  contractType: string;
  seniority: string;
  workMode: string;
  salaryMin: string;
  salaryMax: string;
  salaryConfidential: boolean;
  contactWhatsapp: string;
  contactEmail: string;
  locationNote: string;
  images: string[];
  videoUrl: string;
};

const EMPTY: ProjectFormValues = {
  mode: "vaga",
  title: "",
  vagaRole: "",
  summary: "",
  assetName: "",
  uf: "",
  city: "",
  year: "",
  specialties: [],
  contractType: "",
  seniority: "",
  workMode: "",
  salaryMin: "",
  salaryMax: "",
  salaryConfidential: false,
  contactWhatsapp: "",
  contactEmail: "",
  locationNote: "",
  images: [],
  videoUrl: "",
};

export function NewProjectForm({
  canPublish = true,
  defaultMode = "vaga",
  edit,
}: {
  /** false = conta grátis sem créditos no mês (só na criação) */
  canPublish?: boolean;
  defaultMode?: "vaga" | "vitrine";
  /** presente = edição de uma publicação existente */
  edit?: { projectId: string; values: ProjectFormValues };
}) {
  const v: ProjectFormValues = edit
    ? edit.values
    : { ...EMPTY, mode: defaultMode };

  const [state, action, pending] = useActionState<State, FormData>(
    edit ? editProject : createProject,
    null,
  );
  const [mode, setMode] = useState<"vaga" | "vitrine">(v.mode);
  const [confidential, setConfidential] = useState(v.salaryConfidential);
  const isVaga = mode === "vaga";
  const sel = new Set(v.specialties);

  return (
    <form action={action} className="mt-6 space-y-6">
      {edit && <input type="hidden" name="projectId" value={edit.projectId} />}

      {edit ? (
        <>
          <input type="hidden" name="mode" value={mode} />
          <div className="rounded-card border border-border bg-sunk px-3.5 py-2.5 text-sm text-ink-soft">
            Editando {isVaga ? "uma vaga" : "um projeto da vitrine"}. Ao salvar, a publicação
            volta para a fila de revisão do time da Patrinu.
          </div>
        </>
      ) : (
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
      )}

      {isVaga ? (
        <>
          <label className="block space-y-1.5">
            <span className={labelClass}>Função da vaga</span>
            <input
              name="vagaRole"
              required
              minLength={4}
              defaultValue={v.vagaRole || v.title}
              className={fieldClass}
              placeholder="Restaurador(a) de bens móveis — pleno"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1.5">
              <span className={labelClass}>Tipo de contrato</span>
              <select
                name="contractType"
                required
                defaultValue={v.contractType}
                className={fieldClass}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {Object.entries(CONTRACT_TYPES).map(([val, l]) => (
                  <option key={val} value={val}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Senioridade</span>
              <select name="seniority" defaultValue={v.seniority} className={fieldClass}>
                <option value="">Indiferente</option>
                {Object.entries(SENIORITY).map(([val, l]) => (
                  <option key={val} value={val}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Modelo de trabalho</span>
              <select name="workMode" defaultValue={v.workMode} className={fieldClass}>
                <option value="">Indiferente</option>
                {Object.entries(WORK_MODES).map(([val, l]) => (
                  <option key={val} value={val}>
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
                defaultValue={v.salaryMin}
                className={fieldClass + (confidential ? " opacity-50" : "")}
                placeholder="Mínimo (R$/mês)"
              />
              <input
                name="salaryMax"
                inputMode="numeric"
                disabled={confidential}
                defaultValue={v.salaryMax}
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

          <fieldset className="space-y-2">
            <legend className={labelClass}>Contato do contratante</legend>
            <p className="text-xs text-muted">
              Fica visível apenas para candidatos membros do Patrinu Pro.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="contactWhatsapp"
                inputMode="tel"
                defaultValue={v.contactWhatsapp}
                className={fieldClass}
                placeholder="WhatsApp (ex.: 31 99999-0000)"
              />
              <input
                name="contactEmail"
                type="email"
                defaultValue={v.contactEmail}
                className={fieldClass}
                placeholder="E-mail para candidaturas"
              />
            </div>
            <input
              name="locationNote"
              defaultValue={v.locationNote}
              className={fieldClass}
              placeholder="Localização desejada (ex.: presencial em Ouro Preto / MG)"
            />
          </fieldset>
        </>
      ) : (
        <label className="block space-y-1.5">
          <span className={labelClass}>Título do projeto</span>
          <input
            name="title"
            required
            minLength={6}
            defaultValue={v.title}
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
          defaultValue={v.summary}
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
                defaultValue={v.assetName === "—" ? "" : v.assetName}
                className={fieldClass}
                placeholder="Igreja de São Francisco de Assis"
              />
            </label>
            <label className="block space-y-1.5">
              <span className={labelClass}>Ano (opcional)</span>
              <input
                name="year"
                inputMode="numeric"
                defaultValue={v.year}
                className={fieldClass}
                placeholder="2026"
              />
            </label>
          </>
        )}
        <label className="block space-y-1.5">
          <span className={labelClass}>UF</span>
          <select name="uf" required defaultValue={v.uf} className={fieldClass}>
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
          <input
            name="city"
            required
            defaultValue={v.city}
            className={fieldClass}
            placeholder="Ouro Preto"
          />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>
          {isVaga ? "Áreas de atuação desejadas" : "Especialidades"}
        </legend>
        <div className="space-y-3">
          {CATEGORY_GROUPS.map((g) => (
            <details
              key={g.key}
              className="rounded-card border border-border"
              open={g.specialties.some((s) => sel.has(s.key))}
            >
              <summary className="cursor-pointer px-3.5 py-2.5 text-sm font-semibold text-ink">
                {g.label}
              </summary>
              <div className="grid gap-1.5 px-3.5 pb-3 sm:grid-cols-2">
                {g.specialties.map((s) => (
                  <label key={s.key} className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      name="specialties"
                      value={s.key}
                      defaultChecked={sel.has(s.key)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </fieldset>

      {!isVaga && <MediaUpload defaultImages={v.images} defaultVideo={v.videoUrl || null} />}

      {state?.error ? (
        <p className="rounded-btn bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          {state.error}
        </p>
      ) : null}

      {!edit && (
        <div className="flex items-center gap-3 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
          <span className="font-semibold text-ink">Antes de ir ao ar:</span> tudo passa por
          revisão do time da Patrinu.
        </div>
      )}

      {!edit && !canPublish && (
        <p className="rounded-btn bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          Você usou seus créditos grátis do mês. Assine o Patrinu Pro para publicar sem limite.
        </p>
      )}

      <button
        type="submit"
        disabled={pending || (!edit && !canPublish)}
        className="btn btn-primary disabled:opacity-60"
      >
        {pending
          ? "Salvando…"
          : edit
            ? "Salvar e reenviar para análise"
            : "Enviar para análise"}
      </button>
    </form>
  );
}
