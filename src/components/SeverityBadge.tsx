import React from "react";
import { AlertCircle, AlertTriangle, Info, HelpCircle } from "lucide-react";

interface SeverityBadgeProps {
  impact: string;
  showIcon?: boolean;
}

export function SeverityBadge({ impact, showIcon = true }: SeverityBadgeProps) {
  const normalized = impact?.toLowerCase() || "minor";

  if (normalized === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-red-950/80 text-red-200 border border-red-800">
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />}
        <span>Critical</span>
      </span>
    );
  }

  if (normalized === "serious") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-orange-950/80 text-orange-200 border border-orange-800">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />}
        <span>Serious</span>
      </span>
    );
  }

  if (normalized === "moderate") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-950/80 text-amber-200 border border-amber-800">
        {showIcon && <Info className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />}
        <span>Moderate</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-cyan-950/80 text-cyan-200 border border-cyan-800">
      {showIcon && <HelpCircle className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />}
      <span>Minor</span>
    </span>
  );
}
