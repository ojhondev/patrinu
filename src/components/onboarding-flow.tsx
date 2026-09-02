"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/cn";

export type OnboardingField = {
  label: string;
  type: "text" | "textarea" | "select" | "chips";
  placeholder?: string;
  options?: string[];
};

export type OnboardingStep = {
  title: string;
  hint?: string;
  fields: OnboardingField[];
};

export function OnboardingFlow({
  steps,
  finishHref,
  trackLabel,
}: {
  steps: OnboardingStep[];
  finishHref: string;
  trackLabel: string;
}) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const last = i === steps.length - 1;
  const step = steps[i];

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      {/* progress */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              idx <= i ? "bg-green" : "bg-sunk-2",
            )}
          />
        ))}
      </div>

      <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-ink">
        {trackLabel} · passo {i + 1} de {steps.length}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{step.title}</h1>
      {step.hint ? <p className="mt-1 text-sm text-ink-soft">{step.hint}</p> : null}

      <div className="mt-6 space-y-5">
        {step.fields.map((f) => (
          <label key={f.label} className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-green-ink"
              />
            ) : f.type === "select" ? (
              <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink">
                <option value="">Selecione…</option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "chips" ? (
              <div className="flex flex-wrap gap-2">
                {f.options?.map((o) => (
                  <Chip key={o} label={o} />
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-green-ink"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (i === 0 ? router.back() : setI(i - 1))}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={15} />
          Voltar
        </button>
        {last ? (
          <button
            type="button"
            onClick={() => router.push(finishHref)}
            className="inline-flex items-center gap-2 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
          >
            <Check size={16} />
            Concluir
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setI(i + 1)}
            className="inline-flex items-center gap-2 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
          >
            Continuar
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Protótipo — os campos não são salvos ainda. A gravação real entra com a
        autenticação própria da conta.
      </p>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
        on
          ? "border-green bg-green text-white"
          : "border-border-strong text-ink hover:border-green-ink",
      )}
    >
      {label}
    </button>
  );
}
