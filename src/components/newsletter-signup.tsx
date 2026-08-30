"use client";

import { useState, type FormEvent } from "react";
import { Mail, Check } from "lucide-react";

import { cn } from "@/lib/cn";

export function NewsletterSignup({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Protótipo — a integração real da newsletter entra no MVP.
    setDone(true);
  }

  if (done) {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2 text-sm font-semibold",
          dark ? "text-white" : "text-green-ink",
        )}
      >
        <Check size={16} />
        Pronto — você recebe a próxima edição. (Protótipo)
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md items-stretch gap-2">
      <div
        className={cn(
          "flex flex-1 items-center gap-2 rounded-lg border px-3",
          dark ? "border-white/30 bg-white/10" : "border-border bg-surface",
        )}
      >
        <Mail size={16} className={dark ? "text-white/60" : "text-muted"} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={cn(
            "min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none",
            dark ? "text-white placeholder:text-white/50" : "text-ink placeholder:text-muted",
          )}
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-hover"
      >
        Assinar
      </button>
    </form>
  );
}
