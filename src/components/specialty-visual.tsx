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

/** Cada especialidade ganha um par de cores + ícone. Substitui as fotos de
 *  gig do Fiverr por um tratamento gráfico consistente e leve. */
const VISUALS: Record<SpecialtyKey, Visual> = {
  bens_moveis: { icon: Frame, from: "#3f6212", to: "#1a2e05" },
  bens_integrados: { icon: Landmark, from: "#a16207", to: "#422006" },
  arquitetura: { icon: Hammer, from: "#0e7490", to: "#083344" },
  arqueologia: { icon: Shovel, from: "#7c2d12", to: "#2a1006" },
  acervo: { icon: Archive, from: "#4338ca", to: "#1e1b4b" },
  paisagismo: { icon: Trees, from: "#15803d", to: "#052e16" },
  urbanismo: { icon: Building, from: "#334155", to: "#0f172a" },
  imaterial: { icon: Music, from: "#9d174d", to: "#4c0519" },
  documental: { icon: BookMarked, from: "#525252", to: "#171717" },
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
        className="absolute -bottom-6 -right-4 text-white/15"
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
