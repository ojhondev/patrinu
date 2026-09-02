"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, X } from "lucide-react";

const MAX_BYTES = 8 * 1024 * 1024;
const TARGET = 1200;

/** redimensiona no navegador antes de subir — mantém o upload leve. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, TARGET / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) return file;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
}

/**
 * Campo de imagem por upload do dispositivo (Vercel Blob). Grava a URL num
 * input hidden `name`. Substitui os antigos campos de "cole o link da imagem".
 */
export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  hint,
  shape = "wide",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  /** "square" (avatar) ou "wide" (banner/capa) */
  shape?: "square" | "wide";
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function pick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr("Imagem acima de 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const blob = await shrink(file);
      const ext = blob.type === "image/jpeg" ? "jpg" : file.name.split(".").pop() || "jpg";
      const res = await upload(`${name}-${crypto.randomUUID()}.${ext}`, blob, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: blob.type || file.type,
      });
      setUrl(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-semibold text-ink-soft">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className={
              "border border-border object-cover " +
              (shape === "square" ? "h-16 w-16 rounded-full" : "h-16 w-28 rounded-btn")
            }
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-crit hover:underline"
          >
            <X size={14} />
            Remover
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="btn btn-secondary btn-sm disabled:opacity-50"
        >
          <ImagePlus size={15} />
          {busy ? "Enviando…" : "Enviar imagem do dispositivo"}
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files)}
      />
      {err && <p className="text-xs font-semibold text-crit">{err}</p>}
      {hint && !err && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
