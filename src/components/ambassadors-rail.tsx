"use client";

import { useEffect, useMemo, useState } from "react";

const NAMES = [
  "Renata Pereira B.",
  "Rodrigo Ferrarezi",
  "Helena Braga",
  "Marcos Tavares",
  "Ana Lúcia Prado",
  "Cauê Nogueira",
  "Beatriz Salles",
  "Otávio Rennó",
  "Clara Antunes",
  "Vinícius Palma",
  "Juliana Rocha",
  "Ferdinando Alves",
  "Lívia Camargo",
  "Thiago Mendonça",
];

type Person = { name: string; img: string };

const POOL: Person[] = NAMES.map((name, i) => ({
  name,
  // retratos de placeholder — trocar por fotos reais dos embaixadores
  img: `https://i.pravatar.cc/480?img=${((i * 5) % 70) + 1}`,
}));

const VISIBLE = 5;
const INTERVAL = 3800;

export function AmbassadorsRail({ variant = "section" }: { variant?: "section" | "inline" }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setOffset((o) => (o + 1) % POOL.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const shown = useMemo(
    () => Array.from({ length: VISIBLE }, (_, i) => POOL[(offset + i) % POOL.length]),
    [offset],
  );

  const body = (
    <>
      <p className="kicker text-green-ink">Comunidade</p>
      <h2 className="display mt-2 text-2xl text-ink sm:text-4xl">Embaixadores Patrinu</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Profissionais e instituições que sustentam e divulgam o acervo.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {shown.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="bg-brand p-2 text-white"
            style={{ animation: "fadeIn .5s ease" }}
          >
            <p className="truncate px-1 py-1 text-sm font-semibold">{p.name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={p.name}
              loading="lazy"
              className="aspect-[4/5] w-full bg-white object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );

  if (variant === "inline") return <div className="my-10">{body}</div>;

  return (
    <section className="border-y border-ink/12 bg-sunk">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-11">{body}</div>
    </section>
  );
}
