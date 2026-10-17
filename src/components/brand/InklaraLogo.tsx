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
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const taglineSizes = {
    sm: "text-[10px]",
    md: "text-[11px]",
    lg: "text-xs",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <InklaraSymbol className={`${symbolSizes[size]} shrink-0`} />
      <div className="flex flex-col">
        <span
          className={`font-semibold tracking-tight text-white leading-none ${titleSizes[size]}`}
        >
          Inklara
        </span>
        {withTagline && (
          <span
            className={`text-slate-400 font-normal tracking-normal mt-1 leading-none ${taglineSizes[size]}`}
          >
            Inclusive Engineering
          </span>
        )}
      </div>
    </div>
  );
}
