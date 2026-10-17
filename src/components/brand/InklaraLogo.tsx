import React from "react";
import { InklaraSymbol } from "./InklaraSymbol";

interface InklaraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  theme?: "light" | "dark"; // "dark" = dark text on light background; "light" = white text on dark background
}

export function InklaraLogo({
  className = "",
  size = "md",
  withTagline = true,
  theme = "dark",
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

  const isLightText = theme === "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <InklaraSymbol
        className={`${symbolSizes[size]} shrink-0`}
        variant={isLightText ? "light" : "dark"}
      />
      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight leading-none ${
            isLightText ? "text-white" : "text-slate-900"
          } ${titleSizes[size]}`}
        >
          Inklara
        </span>
        {withTagline && (
          <span
            className={`font-medium tracking-normal mt-1 leading-none ${
              isLightText ? "text-slate-200" : "text-slate-700"
            } ${taglineSizes[size]}`}
          >
            Inclusive Engineering
          </span>
        )}
      </div>
    </div>
  );
}
