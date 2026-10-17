import React from "react";

interface InklaraSymbolProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export function InklaraSymbol({
  className = "w-8 h-8",
  size,
}: InklaraSymbolProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="inklara-portal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        <linearGradient id="inklara-lens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="inklara-verify" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Solid Architectural Tile */}
      <rect width="100" height="100" rx="22" fill="#06080f" />
      <rect width="98" height="98" x="1" y="1" rx="21" stroke="#1c2438" strokeWidth="1.5" />

      {/* 1. Inklara Portal: Inclusive Frame & Structural Stem */}
      <path
        id="inklara-portal"
        d="M 32 74 L 32 30 C 32 23 37 18 44 18 L 66 18 C 73 18 78 23 78 30 L 78 38"
        stroke="url(#inklara-portal)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Inklara Lens: Calibrated Inspection Aperture */}
      <path
        id="inklara-lens"
        d="M 68 36 A 20 20 0 1 0 48 72"
        stroke="url(#inklara-lens)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 3. Inklara Verify: Precision Verification Vector */}
      <path
        id="inklara-verify"
        d="M 38 52 L 48 62 L 72 36"
        stroke="url(#inklara-verify)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Focal Calibration Point */}
      <circle cx="50" cy="50" r="2.5" fill="#38bdf8" />
    </svg>
  );
}
