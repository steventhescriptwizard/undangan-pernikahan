import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;       // % from left
  size: number;       // px
  duration: number;   // seconds
  delay: number;      // seconds
  swayAmount: number; // px sway
  rotation: number;   // initial rotation
  opacity: number;
  color: string;
}

const PETAL_COLORS = [
  'rgba(212, 181, 176, 0.85)', // dustyrose
  'rgba(197, 168, 128, 0.75)', // brand/gold
  'rgba(255, 220, 210, 0.8)',  // soft pink
  'rgba(249, 246, 240, 0.9)',  // cream white
  'rgba(230, 195, 185, 0.8)',  // rose
];

// SVG petal shape
const PetalSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 30 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2 C25 8, 30 20, 15 40 C0 20, 5 8, 15 2Z"
      fill={color}
      stroke="rgba(197,168,128,0.3)"
      strokeWidth="0.5"
    />
    <path
      d="M15 5 C15 5, 15 25, 15 38"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  </svg>
);

export const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: 3 + (i * 7) % 95,
      size: 10 + (i * 3) % 12,
      duration: 9 + (i * 2.3) % 8,
      delay: (i * 1.7) % 12,
      swayAmount: 30 + (i * 15) % 60,
      rotation: (i * 37) % 360,
      opacity: 0.6 + (i * 0.07) % 0.4,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
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
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            transform: `rotate(${p.rotation}deg)`,
            willChange: 'transform, opacity',
          }}
        >
          <PetalSVG color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  );
};

// Sparkle star component for section accents
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
        <div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          {/* 4-point star */}
          <svg
            width={s.size * 2}
            height={s.size * 2}
            viewBox="0 0 20 20"
            style={{
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
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
