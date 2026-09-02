"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

import { SITE_URL } from "@/lib/site";

export function ShareProfileButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/profissionais/${slug}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${name} no Patrinu — ${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className="btn btn-secondary btn-sm">
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
      >
        <Share2 size={14} />
        Compartilhar
      </a>
    </div>
  );
}
