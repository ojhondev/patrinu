"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Trash2 } from "lucide-react";

import { saveBanner } from "@/app/master/actions";

const MAX = 8 * 1024 * 1024;

export function BannerUpload({
  slot,
  currentImage,
  currentLink,
}: {
  slot: string;
  currentImage: string | null;
  currentLink: string | null;
}) {
  const [image, setImage] = useState(currentImage ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function pick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setErr(null);
    if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) {
      setErr("Envie um JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX) {
      setErr("Imagem acima de 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const res = await upload(`banner-${slot}-${crypto.randomUUID()}.${file.name.split(".").pop()}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: file.type,
      });
      setImage(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <form action={saveBanner} className="mt-4 space-y-3">
      <input type="hidden" name="slot" value={slot} />
      <input type="hidden" name="image" value={image} />

      {image ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Banner"
            className="max-h-32 w-full rounded-btn border border-border object-contain"
          />
          <button
            type="button"
            onClick={() => setImage("")}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-white"
            aria-label="Remover imagem"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="btn btn-secondary btn-sm w-full disabled:opacity-50"
        >
          <ImagePlus size={15} />
          {busy ? "Enviando…" : "Enviar imagem"}
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => pick(e.target.files)}
      />
      {err && <p className="text-xs font-semibold text-crit">{err}</p>}

      <input
        name="link"
        defaultValue={currentLink ?? ""}
        placeholder="https://… (destino do clique, opcional)"
        className="w-full rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <button type="submit" disabled={busy} className="btn btn-primary btn-sm disabled:opacity-50">
        Salvar
      </button>
    </form>
  );
}
