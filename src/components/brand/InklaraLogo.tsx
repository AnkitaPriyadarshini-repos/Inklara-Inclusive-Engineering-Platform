import React from "react";
import { InklaraSymbol } from "./InklaraSymbol";

interface InklaraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export function InklaraLogo({
  className = "",
  size = "md",
  withTagline = true,
}: InklaraLogoProps) {
  const symbolSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const taglineSizes = {
    sm: "text-[10px]",
    md: "text-[11px]",
    lg: "text-xs",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <InklaraSymbol className={`${symbolSizes[size]} shrink-0`} glow />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold tracking-tight text-white ${titleSizes[size]}`}
          >
            Inklara
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
            Platform
          </span>
        </div>
        {withTagline && (
          <span
            className={`text-slate-400 font-medium -mt-0.5 tracking-tight ${taglineSizes[size]}`}
          >
            Inclusive Engineering &amp; Verification
          </span>
        )}
      </div>
    </div>
  );
}
