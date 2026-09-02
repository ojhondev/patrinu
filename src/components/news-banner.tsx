import { getSetting } from "@/lib/settings";

/**
 * Espaço de anúncio das notícias — imagem definida pelo Master.
 * Desktop: 1697 × 300. Mobile: 500 × 400 (se enviada; senão usa a de desktop).
 */
export async function NewsBanner({ className = "" }: { className?: string }) {
  const [image, mobile, link] = await Promise.all([
    getSetting("news_banner_image"),
    getSetting("news_banner_image_mobile"),
    getSetting("news_banner_link"),
  ]);
  if (!image) return null;

  const media = (
    <picture>
      {mobile && <source media="(max-width: 639px)" srcSet={mobile} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt="Anúncio"
        className="block aspect-[1697/300] w-full rounded-card object-cover max-sm:aspect-[500/400]"
      />
    </picture>
  );

  return (
    <aside className={`mx-auto max-w-[1100px] ${className}`.trim()}>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
        Publicidade
      </p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer sponsored" className="block">
          {media}
        </a>
      ) : (
        media
      )}
    </aside>
  );
}
