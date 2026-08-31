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
  bens_moveis: { icon: Frame, from: "#d13a3a", to: "#a82a2a" },
  bens_integrados: { icon: Landmark, from: "#c8443a", to: "#9e3128" },
  arquitetura: { icon: Hammer, from: "#b83f4a", to: "#8c2d38" },
  arqueologia: { icon: Shovel, from: "#c25a3a", to: "#96412a" },
  acervo: { icon: Archive, from: "#cb4340", to: "#9e302e" },
  paisagismo: { icon: Trees, from: "#b6503f", to: "#8a3a2d" },
  urbanismo: { icon: Building, from: "#c04a4f", to: "#93353a" },
  imaterial: { icon: Music, from: "#d0473c", to: "#a2332a" },
  documental: { icon: BookMarked, from: "#b34747", to: "#8a3434" },
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
