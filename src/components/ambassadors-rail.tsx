"use client";

const AMBASSADORS: { name: string; area: string; img: string }[] = [
  { name: "Renata Pereira B.", area: "Bens integrados", img: pic(1) },
  { name: "Rodrigo Ferrarezi", area: "Pintura e policromia", img: pic(11) },
  { name: "Helena Braga", area: "Talha e douramento", img: pic(5) },
  { name: "Marcos Tavares", area: "Arquitetura e edificações", img: pic(12) },
  { name: "Ana Lúcia Prado", area: "Conservação de acervos", img: pic(9) },
  { name: "Cauê Nogueira", area: "Arqueologia", img: pic(15) },
  { name: "Beatriz Salles", area: "Documental e bibliográfico", img: pic(16) },
  { name: "Otávio Rennó", area: "Cantaria e consolidação", img: pic(3) },
  { name: "Clara Antunes", area: "Vitrais e caixilharia", img: pic(20) },
  { name: "Vinícius Palma", area: "Paisagismo histórico", img: pic(33) },
  { name: "Juliana Rocha", area: "Bens móveis", img: pic(25) },
  { name: "Ferdinando Alves", area: "Sítios urbanos", img: pic(52) },
];

function pic(n: number) {
  return `https://i.pravatar.cc/240?img=${n}`;
}

function Card({ a }: { a: (typeof AMBASSADORS)[number] }) {
  return (
    <figure className="w-[132px] shrink-0 sm:w-[150px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={a.img}
        alt={a.name}
        loading="lazy"
        className="aspect-[4/5] w-full border-b-2 border-brand bg-sunk object-cover"
      />
      <figcaption className="mt-2">
        <p className="truncate text-sm font-bold text-ink">{a.name}</p>
        <p className="truncate text-xs text-ink-soft">{a.area}</p>
      </figcaption>
    </figure>
  );
}

export function AmbassadorsRail({
  variant = "section",
}: {
  variant?: "section" | "inline";
}) {
  const strip = [...AMBASSADORS, ...AMBASSADORS];

  const body = (
    <>
      <p className="kicker text-green-ink">Comunidade</p>
      <h2 className="display mt-2 text-2xl text-ink sm:text-4xl">Embaixadores Patrinu</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Profissionais e instituições que sustentam e divulgam o acervo.
      </p>

      <div className="marquee mt-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="marquee-track gap-6">
          {strip.map((a, i) => (
            <Card key={`${a.name}-${i}`} a={a} />
          ))}
        </div>
      </div>
    </>
  );

  if (variant === "inline") return <div className="my-10">{body}</div>;

  return (
    <section className="border-y border-ink/12 bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">{body}</div>
    </section>
  );
}
