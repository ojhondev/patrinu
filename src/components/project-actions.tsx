"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Send, Lock, FileUp, Check, ChevronLeft } from "lucide-react";

import { expressInterest } from "@/app/projetos/actions";
import { fieldClass, textareaClass, labelClass } from "@/components/ui/field";

type State = { error?: string; ok?: string } | null;

const AVAILABILITY = [
  ["imediata", "Imediata"],
  ["15_dias", "Em até 15 dias"],
  ["30_dias", "Em até 30 dias"],
  ["a_combinar", "A combinar"],
] as const;

export function ProjectActions({
  slug,
  kind = "projeto",
  loggedIn,
  isOwner,
  alreadyInterested,
  canApply = true,
  defaultName = "",
  defaultEmail = "",
}: {
  slug: string;
  kind?: "vaga" | "projeto";
  loggedIn: boolean;
  isOwner: boolean;
  alreadyInterested: boolean;
  /** false = sem créditos e sem Pro (candidatar-se consome 1 crédito) */
  canApply?: boolean;
  defaultName?: string;
  defaultEmail?: string;
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

  if (!loggedIn) {
    return (
      <Link href={`/entrar?next=/projetos/${slug}`} className="btn btn-primary w-full">
        Entrar para {isVaga ? "candidatar-se" : "participar"}
      </Link>
    );
  }

  // sem créditos grátis e sem Pro
  if (!canApply) {
    return (
      <div className="space-y-2">
        <Link href="/pro/oferecer" className="btn btn-primary w-full">
          <Lock size={14} />
          Torne-se membro Pro
        </Link>
        <p className="text-xs text-muted">
          Você usou seus créditos grátis do mês. Com o Patrinu Pro, candidaturas são ilimitadas.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setOpen(true)} className="btn btn-primary w-full">
          {isVaga ? "Candidatar-se" : "Quero participar"}
        </button>
        <p className="text-xs text-muted">
          {isVaga
            ? "Consome 1 crédito. O contratante recebe seu currículo e sua mensagem."
            : "Quem ganhar o projeto pode te chamar para a equipe."}
        </p>
      </div>
    );
  }

  if (!isVaga) {
    return (
      <form action={action} className="space-y-2 rounded-card border border-border p-3">
        <input type="hidden" name="slug" value={slug} />
        <textarea
          name="message"
          required
          minLength={20}
          rows={4}
          placeholder="Conte por que você quer participar e sua experiência com o tipo de bem…"
          className={textareaClass}
        />
        {state?.error && <p className="text-sm font-semibold text-crit">{state.error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="btn btn-primary btn-sm flex-1">
            <Send size={14} />
            {pending ? "Enviando…" : "Enviar"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn btn-secondary btn-sm">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <VagaApplyWizard
      slug={slug}
      action={action}
      pending={pending}
      error={state?.error}
      defaultName={defaultName}
      defaultEmail={defaultEmail}
      onCancel={() => setOpen(false)}
    />
  );
}

function VagaApplyWizard({
  slug,
  action,
  pending,
  error,
  defaultName,
  defaultEmail,
  onCancel,
}: {
  slug: string;
  action: (fd: FormData) => void;
  pending: boolean;
  error?: string;
  defaultName: string;
  defaultEmail: string;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [nationwide, setNationwide] = useState(false);
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const cvInput = useRef<HTMLInputElement>(null);

  const TOTAL = 4;
  const step1ok = name.trim().length >= 3 && /.+@.+\..+/.test(email);
  const step2ok = nationwide || city.trim().length >= 2;
  const step3ok = availability !== "";
  const step4ok = message.trim().length >= 10;

  async function addCv(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploadErr(null);
    if (file.type !== "application/pdf") {
      setUploadErr("Envie o currículo em PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadErr("Arquivo acima de 10 MB.");
      return;
    }
    setBusy(true);
    try {
      const res = await upload(`cv-${crypto.randomUUID()}.pdf`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });
      setCvUrl(res.url);
      setCvName(file.name);
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Falha ao enviar o currículo.");
    } finally {
      setBusy(false);
      if (cvInput.current) cvInput.current.value = "";
    }
  }

  return (
    <form action={action} className="space-y-4 rounded-card border border-border p-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="applicantName" value={name} />
      <input type="hidden" name="applicantEmail" value={email} />
      {nationwide && <input type="hidden" name="nationwide" value="1" />}
      <input type="hidden" name="applicantCity" value={nationwide ? "" : city} />
      <input type="hidden" name="availability" value={availability} />
      {cvUrl && <input type="hidden" name="cvUrl" value={cvUrl} />}
      <input type="hidden" name="message" value={message} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Candidatura · passo {step} de {TOTAL}
        </span>
        <button type="button" onClick={onCancel} className="text-xs text-muted hover:underline">
          Fechar
        </button>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className={
              "h-1 flex-1 rounded-pill " + (i < step ? "bg-brand" : "bg-border-strong")
            }
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className={labelClass}>Seu nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Nome completo"
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelClass}>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="voce@email.com"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className={labelClass}>Cidade de atuação</span>
            <input
              value={city}
              disabled={nationwide}
              onChange={(e) => setCity(e.target.value)}
              className={fieldClass + (nationwide ? " opacity-50" : "")}
              placeholder="Ex.: Ouro Preto / MG"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={nationwide}
              onChange={(e) => setNationwide(e.target.checked)}
            />
            Atendo em todo o Brasil
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className={labelClass}>Currículo (PDF, opcional)</span>
            {cvUrl ? (
              <div className="flex items-center gap-2 text-sm text-green-ink">
                <Check size={15} />
                {cvName}
                <button
                  type="button"
                  onClick={() => {
                    setCvUrl(null);
                    setCvName(null);
                  }}
                  className="text-crit hover:underline"
                >
                  remover
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => cvInput.current?.click()}
                disabled={busy}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                <FileUp size={14} />
                {busy ? "Enviando…" : "Anexar currículo"}
              </button>
            )}
            <input
              ref={cvInput}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => addCv(e.target.files)}
            />
            {uploadErr && <p className="text-xs font-semibold text-crit">{uploadErr}</p>}
          </div>
          <label className="block space-y-1.5">
            <span className={labelClass}>Disponibilidade para começar</span>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className={fieldClass}
            >
              <option value="" disabled>
                Selecione
              </option>
              {AVAILABILITY.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 4 && (
        <label className="block space-y-1.5">
          <span className={labelClass}>Mensagem para o contratante</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className={textareaClass}
            placeholder="Apresente-se: experiência com o tipo de bem, principais trabalhos, por que a vaga faz sentido para você…"
          />
        </label>
      )}

      {error && <p className="text-sm font-semibold text-crit">{error}</p>}

      <div className="flex items-center gap-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="btn btn-ghost btn-sm"
          >
            <ChevronLeft size={14} />
            Voltar
          </button>
        )}
        {step < TOTAL ? (
          <button
            type="button"
            disabled={
              (step === 1 && !step1ok) ||
              (step === 2 && !step2ok) ||
              (step === 3 && !step3ok)
            }
            onClick={() => setStep((s) => s + 1)}
            className="btn btn-primary btn-sm ml-auto disabled:opacity-50"
          >
            Continuar
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending || !step4ok}
            className="btn btn-primary btn-sm ml-auto disabled:opacity-50"
          >
            <Send size={14} />
            {pending ? "Enviando…" : "Enviar candidatura"}
          </button>
        )}
      </div>
    </form>
  );
}
