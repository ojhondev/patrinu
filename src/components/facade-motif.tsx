/** Fachada neoclássica em linha — motivo de fundo do hero. Decorativo. */
export function FacadeMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      className={className}
    >
      {/* frontão */}
      <path d="M40 120 L200 40 L360 120" strokeLinejoin="round" />
      <path d="M40 120 H360" />
      <path d="M64 120 L200 52 L336 120" opacity="0.5" />
      {/* entablamento */}
      <rect x="40" y="120" width="320" height="20" />
      <rect x="40" y="140" width="320" height="10" opacity="0.6" />
      {/* colunas */}
      {[60, 118, 176, 234, 292].map((x) => (
        <g key={x}>
          <rect x={x} y="150" width="30" height="150" />
          <line x1={x + 8} y1="156" x2={x + 8} y2="294" opacity="0.4" />
          <line x1={x + 15} y1="156" x2={x + 15} y2="294" opacity="0.4" />
          <line x1={x + 22} y1="156" x2={x + 22} y2="294" opacity="0.4" />
          <rect x={x - 4} y="150" width="38" height="8" />
          <rect x={x - 6} y="292" width="42" height="10" />
        </g>
      ))}
      {/* base */}
      <rect x="28" y="302" width="344" height="12" />
    </svg>
  );
}
