import React from "react";
import { CheckCircle2, Clock, AlertOctagon, HelpCircle, Check, Slash } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "VERIFIED_FIXED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>Verified Fixed</span>
        </span>
      );
    case "FIXED_PENDING_VERIFICATION":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950 text-blue-300 border border-blue-800">
          <Check className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
          <span>Fixed (Pending Verification)</span>
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>In Progress</span>
        </span>
      );
    case "NEEDS_FURTHER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950 text-purple-300 border border-purple-800">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
          <span>Needs Review</span>
        </span>
      );
    case "NOT_APPLICABLE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          <Slash className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Not Applicable</span>
        </span>
      );
    case "OPEN":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-300 border border-red-800">
          <AlertOctagon className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          <span>Open</span>
        </span>
      );
  }
}
