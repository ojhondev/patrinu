"use client";

import { useState } from "react";

import { saveBanner } from "@/app/master/actions";
import { ImageUploadField } from "@/components/image-upload-field";

export function BannerUpload({
  slot,
  currentImage,
  currentImageMobile,
  currentLink,
  withMobile = false,
}: {
  slot: string;
  currentImage: string | null;
  currentImageMobile?: string | null;
  currentLink: string | null;
  withMobile?: boolean;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await saveBanner(fd);
        setPending(false);
      }}
      className="mt-4 space-y-3"
    >
      <input type="hidden" name="slot" value={slot} />

      <ImageUploadField
        name="image"
        label={withMobile ? "Imagem — desktop (1697 × 300)" : "Imagem"}
        defaultValue={currentImage ?? ""}
        shape="wide"
      />

      {withMobile && (
        <ImageUploadField
          name="image_mobile"
          label="Imagem — mobile (500 × 400)"
          defaultValue={currentImageMobile ?? ""}
          shape="wide"
          hint="Opcional. Sem ela, o mobile usa a imagem de desktop."
        />
      )}

      <input
        name="link"
        defaultValue={currentLink ?? ""}
        placeholder="https://… (destino do clique, opcional)"
        className="w-full rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <button type="submit" disabled={pending} className="btn btn-primary btn-sm disabled:opacity-50">
        {pending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
