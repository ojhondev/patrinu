"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Send, Lock } from "lucide-react";

import { expressInterest } from "@/app/projetos/actions";

type State = { error?: string; ok?: string } | null;

export function ProjectActions({
  slug,
  kind = "projeto",
  loggedIn,
  isOwner,
  alreadyInterested,
  canApply = true,
}: {
  slug: string;
  kind?: "vaga" | "projeto";
  loggedIn: boolean;
  isOwner: boolean;
  alreadyInterested: boolean;
  /** false = usuário não é membro Pro (candidatar-se a vaga exige Pro) */
  canApply?: boolean;
}) {
  const [state, action, pending] = useActionState<State, FormData>(expressInterest, null);
  const [open, setOpen] = useState(false);
  const isVaga = kind === "vaga";

  if (isOwner) {
    return (
      <p className="rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">
        {isVaga ? "Esta vaga é sua." : "Este projeto é seu."} Veja as candidaturas no{" "}
        <a href="/painel" className="font-semibold text-green-ink hover:underline">
          painel
        </a>
        .
      </p>
    );
  }

  const done = alreadyInterested || state?.ok;

  if (done) {
    return (
      <p className="rounded-btn bg-green-weak px-3 py-2 text-sm font-semibold text-green-ink">
        {isVaga ? "Candidatura enviada." : "Você está na lista de interessados."}
      </p>
    );
  }

  // candidatar-se a vaga é recurso Pro
  if (isVaga && !canApply) {
    return (
      <div className="space-y-2">
        <Link href="/pro/oferecer" className="btn btn-primary w-full">
          <Lock size={14} />
          Torne-se membro Pro
        </Link>
        <p className="text-xs text-muted">
          Candidatar-se às vagas é um recurso do Patrinu Pro para profissionais.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="btn btn-primary w-full">
          {isVaga ? "Candidatar-se" : "Quero participar"}
        </button>
      ) : (
        <form action={action} className="space-y-2 rounded-card border border-border p-3">
          <input type="hidden" name="slug" value={slug} />
          <textarea
            name="message"
            required
            minLength={20}
            rows={4}
            placeholder={
              isVaga
                ? "Apresente-se em poucas linhas: experiência com o tipo de bem, disponibilidade, link do portfólio…"
                : "Conte por que você quer participar e sua experiência com o tipo de bem…"
            }
            className="w-full rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
          {state?.error && <p className="text-sm font-semibold text-crit">{state.error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn btn-primary btn-sm flex-1">
              <Send size={14} />
              {pending ? "Enviando…" : isVaga ? "Enviar candidatura" : "Enviar"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-muted">
        {loggedIn
          ? isVaga
            ? "O contratante recebe seu perfil e sua mensagem, e entra em contato."
            : "Quem ganhar o projeto pode te chamar para a equipe."
          : "Entre na sua conta para se candidatar."}
      </p>
    </div>
  );
}
