"use client";

import { useActionState, useState } from "react";
import { Users, Send } from "lucide-react";

import { expressInterest, submitProposal } from "@/app/projetos/actions";
import { UpgradeButton } from "@/components/upgrade-button";

type State = { error?: string; ok?: string } | null;

export function ProjectActions({
  slug,
  loggedIn,
  canPropose,
  isOwner,
  alreadyInterested,
  alreadyProposed,
}: {
  slug: string;
  loggedIn: boolean;
  canPropose: boolean;
  isOwner: boolean;
  alreadyInterested: boolean;
  alreadyProposed: boolean;
}) {
  const [interestState, interestAction, interestPending] = useActionState<State, FormData>(
    expressInterest,
    null,
  );
  const [proposalState, proposalAction, proposalPending] = useActionState<State, FormData>(
    submitProposal,
    null,
  );
  const [showProposal, setShowProposal] = useState(false);

  if (isOwner) {
    return (
      <p className="mt-4 rounded-lg bg-sunk px-3 py-2 text-sm text-ink-soft">
        Este projeto é seu. Veja interessados e propostas no{" "}
        <a href="/painel" className="font-semibold text-green-ink hover:underline">
          painel
        </a>
        .
      </p>
    );
  }

  const proposalDone = alreadyProposed || proposalState?.ok;
  const interestDone = alreadyInterested || interestState?.ok;

  return (
    <div className="mt-4 space-y-3">
      {/* ---- proposta (Pro) ---- */}
      {proposalDone ? (
        <p className="rounded-lg bg-green-weak px-3 py-2 text-sm font-semibold text-green-ink">
          Proposta enviada.
        </p>
      ) : !canPropose ? (
        <UpgradeButton
          label="Assine o Pro para enviar proposta"
          className="w-full justify-center"
        />
      ) : !showProposal ? (
        <button
          type="button"
          onClick={() => setShowProposal(true)}
          className="w-full rounded-lg bg-green px-4 py-3 text-sm font-bold text-white hover:bg-green-hover"
        >
          Enviar proposta
        </button>
      ) : (
        <form action={proposalAction} className="space-y-2 rounded-lg border border-border p-3">
          <input type="hidden" name="slug" value={slug} />
          <textarea
            name="message"
            required
            minLength={30}
            rows={4}
            placeholder="Apresente sua equipe, experiência com o tipo de bem e abordagem…"
            className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm outline-none focus:border-green-ink"
          />
          <input
            name="priceRange"
            placeholder="Faixa de honorários (opcional)"
            className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm outline-none focus:border-green-ink"
          />
          {proposalState?.error && (
            <p className="text-sm font-semibold text-crit">{proposalState.error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={proposalPending}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-green px-3 py-2 text-sm font-bold text-white hover:bg-green-hover disabled:opacity-60"
            >
              <Send size={14} />
              {proposalPending ? "Enviando…" : "Enviar"}
            </button>
            <button
              type="button"
              onClick={() => setShowProposal(false)}
              className="rounded-md border border-border-strong px-3 py-2 text-sm font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ---- quero participar (cadastrado) ---- */}
      {interestDone ? (
        <p className="rounded-lg bg-sunk px-3 py-2 text-sm text-ink-soft">
          Você está na lista de interessados.
        </p>
      ) : (
        <form action={interestAction}>
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            disabled={interestPending}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-bold hover:border-green-ink disabled:opacity-60"
          >
            <Users size={15} />
            {interestPending ? "Enviando…" : "Quero participar"}
          </button>
          {interestState?.error && (
            <p className="mt-1 text-sm font-semibold text-crit">{interestState.error}</p>
          )}
        </form>
      )}

      <p className="text-xs text-muted">
        {loggedIn
          ? "“Quero participar” te coloca na lista de interessados — quem ganhar o projeto pode te chamar para a equipe."
          : "Entre para enviar proposta ou entrar na lista de interessados."}
      </p>
    </div>
  );
}
