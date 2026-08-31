import { getSetting } from "@/lib/settings";

/** Espaço de anúncio das notícias — imagem definida pelo Master. */
export async function NewsBanner({ className = "" }: { className?: string }) {
  const [image, link] = await Promise.all([
    getSetting("news_banner_image"),
    getSetting("news_banner_link"),
  ]);
  if (!image) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="Anúncio" className="w-full object-cover" />
  );

  return (
    <aside className={`border border-ink/12 ${className}`}>
      <p className="border-b border-ink/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
        Publicidade
      </p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer sponsored">
          {img}
        </a>
      ) : (
        img
      )}
    </aside>
  );
}
