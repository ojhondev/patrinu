/**
 * Faixa rotativa de marcas / escritórios no Patrinu Pro.
 * Placeholder por ora — troque por <img src="/brands/<slug>.svg"> quando o
 * usuário enviar os logos.
 */

const BRANDS = [
  "Ateliê Restaura",
  "Patrimônio & Memória",
  "Restaura Nordeste",
  "Lócus Conservação",
  "Cerâmica Viva",
  "Ateliê Douração",
  "Vitral Paulista",
  "Casa Colonial",
];

function Logo({ name }: { name: string }) {
  return (
    <span className="flex h-9 shrink-0 items-center rounded-md border border-dashed border-border-strong px-5 text-[13px] font-semibold text-muted">
      {name}
    </span>
  );
}

export function ProBrandsRail() {
  const strip = [...BRANDS, ...BRANDS];
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-5 sm:px-6 lg:px-11">
        <span className="hidden shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-muted sm:block">
          Escritórios no Patrinu&nbsp;Pro
        </span>
        <div className="marquee min-w-0 flex-1">
          <div className="marquee-track gap-4">
            {strip.map((b, i) => (
              <Logo key={`${b}-${i}`} name={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
