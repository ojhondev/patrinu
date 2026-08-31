"use client";

import { useActionState } from "react";

import { signIn, signUp } from "@/app/conta/actions";

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
    <form action={formAction} className="mt-6 w-full space-y-3 text-left">
      {track ? <input type="hidden" name="track" value={track} /> : null}
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {mode === "signup" && (
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Nome</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">E-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Senha</span>
        <input
          type="password"
          name="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
        />
        {mode === "signup" && (
          <span className="mt-1 block text-xs text-muted">Ao menos 8 caracteres.</span>
        )}
      </label>

      {state?.error ? (
        <p className="text-sm font-semibold text-crit">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover disabled:opacity-60"
      >
        {pending
          ? "Aguarde…"
          : mode === "login"
            ? "Entrar"
            : "Criar conta grátis"}
      </button>
    </form>
  );
}
