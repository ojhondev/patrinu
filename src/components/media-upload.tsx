"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { X, ImagePlus, Film } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const TARGET_DIMENSION = 2000;

/** Redimensiona a imagem no navegador antes de subir (mantém o upload leve). */
async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, TARGET_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.82),
  );
}

export function MediaUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const vidInput = useRef<HTMLInputElement>(null);

  async function addImages(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const room = MAX_IMAGES - images.length;
      for (const file of Array.from(files).slice(0, room)) {
        if (!file.type.startsWith("image/")) continue;
        const blob = await shrinkImage(file);
        const res = await upload(`projeto-${crypto.randomUUID()}.jpg`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: "image/jpeg",
        });
        setImages((prev) => [...prev, res.url]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar imagem.");
    } finally {
      setBusy(false);
      if (imgInput.current) imgInput.current.value = "";
    }
  }

  async function addVideo(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError("Arquivo não é um vídeo.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError("Vídeo acima de 50 MB.");
      return;
    }
    setBusy(true);
    try {
      const res = await upload(`projeto-${crypto.randomUUID()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: file.type,
      });
      setVideo(res.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar vídeo.");
    } finally {
      setBusy(false);
      if (vidInput.current) vidInput.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      {images.map((url) => (
        <input key={url} type="hidden" name="mediaImages" value={url} />
      ))}
      {video && <input type="hidden" name="mediaVideo" value={video} />}

      <div>
        <span className="mb-1 block text-sm font-semibold text-ink">
          Imagens — antes, durante e depois ({images.length}/{MAX_IMAGES})
        </span>
        {images.length > 0 && (
          <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden border border-ink/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center bg-ink text-white"
                  aria-label="Remover"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => imgInput.current?.click()}
          disabled={busy || images.length >= MAX_IMAGES}
          className="btn-museum disabled:opacity-50"
        >
          <ImagePlus size={15} />
          {busy ? "Enviando…" : "Adicionar imagens"}
        </button>
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addImages(e.target.files)}
        />
        <p className="mt-1 text-xs text-muted">
          JPG/PNG — redimensionadas para no máx. 2000 px no seu navegador antes de subir.
        </p>
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold text-ink">Vídeo (opcional)</span>
        {video ? (
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Film size={15} className="text-green-ink" />
            vídeo enviado
            <button
              type="button"
              onClick={() => setVideo(null)}
              className="text-crit hover:underline"
            >
              remover
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => vidInput.current?.click()}
            disabled={busy}
            className="btn-museum disabled:opacity-50"
          >
            <Film size={15} />
            Adicionar vídeo
          </button>
        )}
        <input
          ref={vidInput}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => addVideo(e.target.files)}
        />
        <p className="mt-1 text-xs text-muted">MP4/WebM até 50 MB.</p>
      </div>

      {error && (
        <p className="bg-crit/10 px-3 py-2 text-sm font-semibold text-crit">{error}</p>
      )}
    </div>
  );
}
