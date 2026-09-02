"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { removeProject } from "@/app/painel/actions";

export function DeleteProjectButton({
  projectId,
  kind,
  hasApplicants,
}: {
  projectId: string;
  kind: "vaga" | "projeto";
  hasApplicants: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn btn-ghost btn-sm shrink-0 text-crit"
      >
        <Trash2 size={14} />
        Excluir
      </button>
    );
  }

  return (
    <form action={removeProject} className="shrink-0 text-right">
      <input type="hidden" name="projectId" value={projectId} />
      <p className="mb-1.5 text-xs text-ink-soft">
        Excluir esta {kind === "vaga" ? "vaga" : "publicação"} de vez?
        {hasApplicants && " As candidaturas recebidas também serão apagadas."}
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-danger btn-sm">
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </form>
  );
}
