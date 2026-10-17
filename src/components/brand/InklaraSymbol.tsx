import React from "react";

interface InklaraSymbolProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  variant?: "light" | "dark";
}

export function InklaraSymbol({
  className = "w-8 h-8",
  size,
  variant = "dark",
}: InklaraSymbolProps) {
  const style = size ? { width: size, height: size } : undefined;
  const isLightBackground = variant === "dark"; // dark marks on light canvas

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
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>

        <linearGradient id="inklara-lens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="inklara-verify" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Solid Architectural Badge */}
      <rect
        width="100"
        height="100"
        rx="22"
        fill={isLightBackground ? "#0f172a" : "#1e293b"}
      />
      <rect
        width="98"
        height="98"
        x="1"
        y="1"
        rx="21"
        stroke={isLightBackground ? "#334155" : "#475569"}
        strokeWidth="1.5"
      />

      {/* 1. Inklara Portal: Precision Inclusive Architectural Aperture */}
      <path
        id="inklara-portal"
        d="M 28 72 L 28 28 C 28 22 33 18 40 18 L 60 18 C 67 18 72 22 72 28 L 72 40"
        stroke="url(#inklara-portal)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Inklara Lens: Diagnostic Inspection Arc */}
      <path
        id="inklara-lens"
        d="M 68 38 A 18 18 0 1 0 46 68"
        stroke="url(#inklara-lens)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* 3. Inklara Verify: Trajectory Vector */}
      <path
        id="inklara-verify"
        d="M 36 52 L 47 63 L 74 36"
        stroke="url(#inklara-verify)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Precision Calibration Focus */}
      <circle cx="50" cy="50" r="2.5" fill="#38bdf8" />
    </svg>
  );
}
