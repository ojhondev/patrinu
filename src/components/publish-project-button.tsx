"use client";

import { useState } from "react";
import { Plus, Clock, X } from "lucide-react";

export function PublishProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
      >
        <Plus size={16} />
        Publicar projeto
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-[var(--shadow-pop)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-green-weak text-green-ink">
              <Clock size={20} />
            </span>
            <h3 className="mt-3 font-display text-lg font-bold">Projeto em análise</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              Tudo que é publicado passa por revisão do time da Patrinu antes de ir ao ar.
              Você recebe um aviso assim que for aprovado — normalmente em até 1 dia útil.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-sm font-bold text-white hover:bg-green-hover"
            >
              <X size={14} />
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
