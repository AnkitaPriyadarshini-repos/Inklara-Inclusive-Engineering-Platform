import React from "react";

interface InklaraSymbolProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export function InklaraSymbol({
  className = "w-9 h-9",
  size,
  glow = false,
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
        <linearGradient id="sym-portal" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        <linearGradient id="sym-lens" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a5f3fc" />
        </linearGradient>

        <linearGradient id="sym-verify" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        {glow && (
          <filter id="sym-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Rounded Portal Backing Plate */}
      <rect width="100" height="100" rx="24" fill="#090b15" />
      <rect width="98" height="98" x="1" y="1" rx="23" stroke="#22283d" strokeWidth="2" />

      {/* 1. Open Portal Frame (Inclusive Access) */}
      <path
        d="M 28 78 L 28 30 C 28 24.5 32.5 20 38 20 L 70 20 C 75.5 20 80 24.5 80 30 L 80 38"
        stroke="url(#sym-portal)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Inspection Lens (Aperture / Discovery) */}
      <path
        d="M 68 36 A 22 22 0 1 0 46 76"
        stroke="url(#sym-lens)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="85 15"
      />

      {/* 3. Verification Path (Continuous Check) */}
      <path
        d="M 38 52 L 48 64 L 76 34"
        stroke="url(#sym-verify)"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? "url(#sym-glow)" : undefined}
      />

      <circle cx="50" cy="50" r="3" fill="#38bdf8" opacity="0.9" />
    </svg>
  );
}
