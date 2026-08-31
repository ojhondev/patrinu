import { getSetting } from "@/lib/settings";

/**
 * Espaço de anúncio (imagem) definido pelo Master.
 * `ratio` no formato "w/h" — o container é responsivo e mantém a proporção.
 */
export async function AdBanner({
  slot,
  ratio = "1920/500",
  className = "",
}: {
  slot: "news" | "projects";
  ratio?: string;
  className?: string;
}) {
  const [image, link] = await Promise.all([
    getSetting(`${slot}_banner_image`),
    getSetting(`${slot}_banner_link`),
  ]);

  const frame = `w-full border border-ink/12 ${className}`;
  const box = { aspectRatio: ratio.replace("/", " / ") };

  if (!image) {
    return (
      <div
        className={`${frame} grid place-items-center bg-sunk text-center text-xs text-muted`}
        style={box}
      >
        Espaço reservado para anúncio · {ratio.replace("/", " × ")}
      </div>
    );
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="Anúncio" className="h-full w-full object-cover" />
  );

  return (
    <div className={frame} style={box}>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer sponsored" className="block h-full">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
