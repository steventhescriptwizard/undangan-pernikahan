import React, { useEffect, useState, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Petal {
  id: number;
  left: number;       // % from left
  size: number;       // px
  duration: number;   // fall duration in seconds
  delay: number;      // start delay in seconds
  swayX: number;      // horizontal sway amplitude in px
  swayFreq: number;   // how wavy the path is
  rotation: number;   // initial rotation deg
  rotSpeed: number;   // tumble speed (deg/frame)
  opacity: number;
  color: string;
  shape: number;      // 0 = teardrop, 1 = round, 2 = wide oval
}

// ── Colours ────────────────────────────────────────────────────────────────
const COLORS = [
  'rgba(255, 182, 193, 0.90)', // light pink
  'rgba(230, 148, 148, 0.85)', // mid rose
  'rgba(197, 100, 100, 0.80)', // deeper rose
  'rgba(99,  32,  46, 0.60)',  // maroon tint
  'rgba(255, 220, 214, 0.90)', // blush
  'rgba(249, 246, 240, 0.85)', // cream
  'rgba(212, 181, 176, 0.80)', // dustyrose
];

// ── Petal SVG variants ─────────────────────────────────────────────────────
const PetalSVG = ({ color, size, shape }: { color: string; size: number; shape: number }) => {
  const paths = [
    /* teardrop  */ 'M15 1 C26 7, 30 22, 15 41 C0 22, 4 7, 15 1Z',
    /* round     */ 'M15 3 C24 3, 29 18, 15 38 C1 18, 6 3, 15 3Z',
    /* wide oval */ 'M15 5 C28 5, 32 18, 15 36 C-2 18, 2 5, 15 5Z',
  ];
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 30 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0px 1px 2px rgba(99,32,46,0.15))' }}
    >
      <path d={paths[shape]} fill={color} />
      {/* mid-vein highlight */}
      <path
        d="M15 4 C15 4, 14.5 28, 15 40"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* subtle sheen */}
      <path
        d="M13 6 C11 12, 10 20, 12 30"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ── CSS keyframes injected once ────────────────────────────────────────────
const STYLE_ID = 'falling-petals-styles';
const injectStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes petalFall {
      0%   { transform: translateY(-100px) rotate(var(--r0)) translateX(0px); opacity: 0; }
      5%   { opacity: 1; }
      50%  { transform: translateY(45vh) rotate(var(--r180)) translateX(var(--sway)); }
      95%  { opacity: 1; }
      100% { transform: translateY(107vh) rotate(var(--r360)) translateX(0px); opacity: 0; }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
      50%       { opacity: 1;   transform: scale(1.3) rotate(180deg); }
    }
  `;
  document.head.appendChild(s);
};

// ── Main component ─────────────────────────────────────────────────────────
export const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const injected = useRef(false);

  useEffect(() => {
    if (!injected.current) { injectStyles(); injected.current = true; }

    const count = 24;
    const generated: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     2  + (i * 4.1)  % 97,
      size:     9  + (i * 2.9)  % 14,       // 9–23 px
      duration: 10 + (i * 3.1)  % 12,       // 10–22 s
      delay:    (i * 2.3) % 18,              // spread over 18 s
      swayX:    40 + (i * 17)   % 80,       // 40–120 px
      swayFreq: 0,                            // unused (CSS handles it)
      rotation: (i * 43)        % 360,
      rotSpeed: 0,
      opacity:  0.55 + (i * 0.04) % 0.45,
      color:    COLORS[i % COLORS.length],
      shape:    i % 3,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-80px',
            left: `${p.left}%`,
            opacity: p.opacity,
            // CSS custom props used in the keyframe
            ['--r0'   as any]: `${p.rotation}deg`,
            ['--r180' as any]: `${p.rotation + 180}deg`,
            ['--r360' as any]: `${p.rotation + 360}deg`,
            ['--sway' as any]: `${p.swayX * (p.id % 2 === 0 ? 1 : -1)}px`,
            animation: `petalFall ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        >
          <PetalSVG color={p.color} size={p.size} shape={p.shape} />
        </div>
      ))}
    </div>
  );
};

// ── SparkleAccent (unchanged API) ──────────────────────────────────────────
interface SparkleProps {
  count?: number;
  className?: string;
}

export const SparkleAccent: React.FC<SparkleProps> = ({ count = 5, className = '' }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + (i * 22) % 80,
    y: 10 + (i * 31) % 80,
    size: 3 + (i * 2) % 5,
    delay: i * 0.5,
    duration: 2 + (i * 0.4) % 1.5,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {stars.map((s) => (
        <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          <svg
            width={s.size * 2}
            height={s.size * 2}
            viewBox="0 0 20 20"
            style={{ animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite` }}
          >
            <path
              d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
              fill="#D4AF37"
              opacity="0.7"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
