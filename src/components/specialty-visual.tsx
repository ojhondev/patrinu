import type { LucideIcon } from "lucide-react";
import {
  Frame,
  Brush,
  Sparkles,
  Landmark,
  Book,
  Camera,
  Shirt,
  Gem,
  Shapes,
  Pyramid,
  Hammer,
  Building,
  Shovel,
  Archive,
  Trees,
  Music,
  Ruler,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { groupOf } from "@/lib/categories";

const GROUP_ICON: Record<string, LucideIcon> = {
  "bens-moveis": Frame,
  pintura: Brush,
  douramento: Sparkles,
  "bens-integrados": Landmark,
  "papel-livros": Book,
  "fotografia-midias": Camera,
  texteis: Shirt,
  metais: Gem,
  "ceramica-vidro": Shapes,
  "pedra-cantaria": Pyramid,
  "madeira-estruturas": Hammer,
  arquitetura: Building,
  arqueologia: Shovel,
  "acervos-museologia": Archive,
  "jardins-paisagem": Trees,
  imaterial: Music,
  "documentacao-projeto": Ruler,
};

const GRAD: [from: string, to: string][] = [
  ["#e04a2c", "#a83318"],
  ["#d84a2a", "#9e3118"],
  ["#cf4436", "#992e28"],
  ["#d85c30", "#9c4020"],
  ["#dd4b30", "#a13320"],
  ["#cc5636", "#964024"],
];

function visualFor(specialtyKey: string) {
  const group = groupOf(specialtyKey) ?? "arquitetura";
  const icon = GROUP_ICON[group] ?? Building;
  const idx = CATEGORY_INDEX(group) % GRAD.length;
  const [from, to] = GRAD[idx];
  return { icon, from, to };
}

function CATEGORY_INDEX(group: string): number {
  return Math.abs([...group].reduce((a, c) => a + c.charCodeAt(0), 0));
}

/** compat — algumas telas chamavam specialtyVisual(key). */
export function specialtyVisual(key: string) {
  return visualFor(key);
}

export function SpecialtyThumb({
  specialty,
  className,
  label,
}: {
  specialty: string;
  className?: string;
  label?: string;
}) {
  const { icon: Icon, from, to } = visualFor(specialty);
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon size={140} strokeWidth={1} className="absolute -bottom-6 -right-4 text-white/25" />
      {label ? (
        <span className="absolute left-3 top-3 rounded-pill bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink">
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
  specialty: string;
  size?: number;
  className?: string;
}) {
  const { icon: Icon } = visualFor(specialty);
  return <Icon size={size} strokeWidth={1.6} className={className} />;
}

/** ícone de um GRUPO (para a category rail). */
export function GroupIcon({
  group,
  size = 22,
  className,
}: {
  group: string;
  size?: number;
  className?: string;
}) {
  const Icon = GROUP_ICON[group] ?? Building;
  return <Icon size={size} strokeWidth={1.6} className={className} />;
}
