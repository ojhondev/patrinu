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

/** Cada especialidade ganha um gradiente da família do verde + um ícone.
 *  Substitui as fotos de gig por um tratamento gráfico leve e sempre verde —
 *  nada de tiles escuros/pretos. */
const VISUALS: Record<SpecialtyKey, Visual> = {
  bens_moveis: { icon: Frame, from: "#4a8f6a", to: "#356b4e" },
  bens_integrados: { icon: Landmark, from: "#5e9a6b", to: "#437a4e" },
  arquitetura: { icon: Hammer, from: "#3f8f83", to: "#2c6b61" },
  arqueologia: { icon: Shovel, from: "#7e8f56", to: "#5e6b3d" },
  acervo: { icon: Archive, from: "#3d8f76", to: "#2a6b58" },
  paisagismo: { icon: Trees, from: "#54a05f", to: "#3a7a43" },
  urbanismo: { icon: Building, from: "#5a8f80", to: "#436b5f" },
  imaterial: { icon: Music, from: "#4a9a8c", to: "#347368" },
  documental: { icon: BookMarked, from: "#6f8f78", to: "#516b58" },
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
