"use client";

import { useActionState } from "react";

import { loginMaster } from "../actions";

export function MasterLoginForm() {
  const [state, action, pending] = useActionState(loginMaster, null as { error?: string } | null);

  return (
    <form action={action} className="mt-6 w-full space-y-3 text-left">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">E-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Senha</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-green-ink"
        />
      </label>
      {state?.error ? (
        <p className="text-sm font-semibold text-crit">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
