import type { LucideIcon } from "lucide-react";
import {
  Frame,
  Landmark,
  Hammer,
  Shovel,
  Archive,
  Trees,
  Building,
  Music,
  BookMarked,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { SpecialtyKey } from "@/lib/taxonomy";

type Visual = { icon: LucideIcon; from: string; to: string };

/** Cada especialidade ganha um gradiente da família do vermelho da marca +
 *  um ícone. Substitui as fotos de gig por um tratamento gráfico leve —
 *  nada de tiles escuros/pretos. */
const VISUALS: Record<SpecialtyKey, Visual> = {
  bens_moveis: { icon: Frame, from: "#e04a2c", to: "#a83318" },
  bens_integrados: { icon: Landmark, from: "#d84a2a", to: "#9e3118" },
  arquitetura: { icon: Hammer, from: "#cf4436", to: "#992e28" },
  arqueologia: { icon: Shovel, from: "#d85c30", to: "#9c4020" },
  acervo: { icon: Archive, from: "#dd4b30", to: "#a13320" },
  paisagismo: { icon: Trees, from: "#cc5636", to: "#964024" },
  urbanismo: { icon: Building, from: "#d24d3c", to: "#993830" },
  imaterial: { icon: Music, from: "#e14e33", to: "#a2361f" },
  documental: { icon: BookMarked, from: "#c74e3e", to: "#8f3a2e" },
};

export function specialtyVisual(key: SpecialtyKey): Visual {
  return VISUALS[key] ?? VISUALS.arquitetura;
}

export function SpecialtyThumb({
  specialty,
  className,
  label,
}: {
  specialty: SpecialtyKey;
  className?: string;
  label?: string;
}) {
  const { icon: Icon, from, to } = specialtyVisual(specialty);
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon
        size={140}
        strokeWidth={1}
        className="absolute -bottom-6 -right-4 text-white/25"
      />
      {label ? (
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-ink">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function SpecialtyIcon({
  specialty,
  size = 22,
  className,
}: {
  specialty: SpecialtyKey;
  size?: number;
  className?: string;
}) {
  const { icon: Icon } = specialtyVisual(specialty);
  return <Icon size={size} strokeWidth={1.6} className={className} />;
}
