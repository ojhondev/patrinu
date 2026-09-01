"use client";

import { useActionState } from "react";

import { signIn, signUp } from "@/app/conta/actions";
import { fieldClass, labelClass } from "@/components/ui/field";

type State = { error?: string } | null;

export function AuthForm({
  mode,
  track,
  next,
}: {
  mode: "login" | "signup";
  track?: string;
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<State, FormData>(action, null);

  return (
    <form action={formAction} className="mt-6 w-full space-y-3.5 text-left">
      {track ? <input type="hidden" name="track" value={track} /> : null}
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {mode === "signup" && (
        <label className="block space-y-1.5">
          <span className={labelClass}>Nome</span>
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
      )}

      <label className="block space-y-1.5">
        <span className={labelClass}>E-mail</span>
        <input type="email" name="email" required autoComplete="email" className={fieldClass} />
      </label>

      <label className="block space-y-1.5">
        <span className={labelClass}>Senha</span>
        <input
          type="password"
          name="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={fieldClass}
        />
        {mode === "signup" && (
          <span className="block text-xs text-muted">Ao menos 8 caracteres.</span>
        )}
      </label>

      {state?.error ? <p className="text-sm font-semibold text-crit">{state.error}</p> : null}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta grátis"}
      </button>
    </form>
  );
}
