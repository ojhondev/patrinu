"use client";

import { useActionState } from "react";
import Link from "next/link";

import { saveProfile } from "@/app/painel/perfil/actions";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { UFS } from "@/lib/taxonomy";
import { fieldClass, textareaClass, labelClass } from "@/components/ui/field";

type State = { error?: string; ok?: string } | null;

export type ProfileDefaults = {
  displayName: string;
  headline: string;
  bio: string;
  uf: string;
  city: string;
  specialties: string[];
  techniques: string[];
  registros: string[];
  whatsapp: string;
  website: string;
  instagram: string;
  linkedin: string;
  avatarUrl: string;
  slug: string | null;
  isPro: boolean;
};

export function ProfileForm({ defaults }: { defaults: ProfileDefaults }) {
  const [state, action, pending] = useActionState<State, FormData>(saveProfile, null);
  const sel = new Set(defaults.specialties);

  return (
    <form action={action} className="mt-6 space-y-6">
      {state?.ok && (
        <div className="rounded-card border border-green-ink/25 bg-green-weak p-4 text-sm text-ink-soft">
          {state.ok}{" "}
          {defaults.slug && (
            <Link
              href={`/profissionais/${defaults.slug}`}
              className="font-semibold text-green-ink hover:underline"
            >
              Ver meu perfil público
            </Link>
          )}
        </div>
      )}

      <label className="block space-y-1.5">
        <span className={labelClass}>Nome / ateliê</span>
        <input
          name="displayName"
          required
          minLength={3}
          defaultValue={defaults.displayName}
          className={fieldClass}
          placeholder="Ana Restauro · Ateliê de Bens Móveis"
        />
      </label>

      <label className="block space-y-1.5">
        <span className={labelClass}>Resumo (aparece no card do diretório)</span>
        <input
          name="headline"
          required
          minLength={8}
          defaultValue={defaults.headline}
          className={fieldClass}
          placeholder="Restauradora de pintura de cavalete e douramento"
        />
      </label>

      <label className="block space-y-1.5">
        <span className={labelClass}>Sobre a sua atuação</span>
        <textarea
          name="bio"
          required
          minLength={40}
          rows={5}
          defaultValue={defaults.bio}
          className={textareaClass}
          placeholder="Formação, tipos de bem que você atende, principais obras, abordagem de trabalho…"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className={labelClass}>UF</span>
          <select name="uf" defaultValue={defaults.uf} className={fieldClass}>
            <option value="">—</option>
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
            defaultValue={defaults.city}
            className={fieldClass}
            placeholder="Ouro Preto"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className={labelClass}>Foto — URL (opcional)</span>
        <input
          name="avatarUrl"
          defaultValue={defaults.avatarUrl}
          className={fieldClass}
          placeholder="https://…"
        />
      </label>

      <fieldset className="space-y-3 rounded-card border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-ink-soft">
          Contato e links da sua página
        </legend>
        {!defaults.isPro && (
          <p className="rounded-btn bg-sunk px-3 py-2 text-xs text-ink-soft">
            No plano gratuito, esses dados ficam guardados mas{" "}
            <strong className="text-ink">só aparecem na sua página pública quando você é
            Membro Pro</strong>. Enquanto isso, os contratantes falam com você pelas
            candidaturas.{" "}
            <Link href="/pro" className="font-semibold text-green-ink hover:underline">
              Ver o Patrinu Pro
            </Link>
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={labelClass}>WhatsApp</span>
            <input
              name="whatsapp"
              inputMode="tel"
              defaultValue={defaults.whatsapp}
              className={fieldClass}
              placeholder="31 99999-0000"
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelClass}>Site / portfólio</span>
            <input
              name="website"
              type="url"
              defaultValue={defaults.website}
              className={fieldClass}
              placeholder="https://…"
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelClass}>Instagram</span>
            <input
              name="instagram"
              defaultValue={defaults.instagram}
              className={fieldClass}
              placeholder="@seuatelie"
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelClass}>LinkedIn</span>
            <input
              name="linkedin"
              defaultValue={defaults.linkedin}
              className={fieldClass}
              placeholder="linkedin.com/in/você"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Especialidades</legend>
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

      <label className="block space-y-1.5">
        <span className={labelClass}>Técnicas (separe por vírgula)</span>
        <input
          name="techniques"
          defaultValue={defaults.techniques.join(", ")}
          className={fieldClass}
          placeholder="Reintegração cromática, velatura, consolidação de suporte"
        />
      </label>

      <label className="block space-y-1.5">
        <span className={labelClass}>Registros e associações (separe por vírgula)</span>
        <input
          name="registros"
          defaultValue={defaults.registros.join(", ")}
          className={fieldClass}
          placeholder="ABRACOR, CAU-BR, RRT nº…"
        />
      </label>

      {state?.error && (
        <p className="rounded-btn bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
        {pending ? "Salvando…" : defaults.slug ? "Salvar alterações" : "Publicar meu perfil"}
      </button>
    </form>
  );
}
