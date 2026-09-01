"use client";

import { useActionState } from "react";

import { loginMaster } from "../actions";
import { fieldClass, labelClass } from "@/components/ui/field";

export function MasterLoginForm() {
  const [state, action, pending] = useActionState(loginMaster, null as { error?: string } | null);

  return (
    <form action={action} className="mt-6 w-full space-y-3.5 text-left">
      <label className="block space-y-1.5">
        <span className={labelClass}>E-mail</span>
        <input type="email" name="email" required autoComplete="username" className={fieldClass} />
      </label>
      <label className="block space-y-1.5">
        <span className={labelClass}>Senha</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      {state?.error ? <p className="text-sm font-semibold text-crit">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
