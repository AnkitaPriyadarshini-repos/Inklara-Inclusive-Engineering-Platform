"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface SanitizedCodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
  label?: string;
}

export function SanitizedCodeBlock({
  code,
  language = "html",
  maxHeight = "max-h-56",
  label,
}: SanitizedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-md border border-apple-border bg-apple-surface overflow-hidden text-xs font-mono">
      {label && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-apple-border bg-apple-elevated/70 text-apple-muted">
          <span className="font-semibold text-slate-300">{label}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus p-1 rounded"
            aria-label={copied ? "Copied code snippet" : "Copy code snippet to clipboard"}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-sans">Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre
        tabIndex={0}
        aria-label={label || `${language} snippet`}
        className={`p-3 overflow-x-auto text-slate-200 select-all ${maxHeight}`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
