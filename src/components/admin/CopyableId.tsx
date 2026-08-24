"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortId = id.length > 8 ? `#DCC-${id.slice(-6).toUpperCase()}` : `#${id.toUpperCase()}`;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200/80 hover:bg-slate-200/70 transition-colors cursor-pointer group select-none"
      onClick={handleCopy}
      title={`Full ID: ${id} (Click to copy)`}
    >
      <span className="font-mono text-[11px] font-bold text-slate-800 tracking-tight">
        {shortId}
      </span>
      <button 
        type="button"
        aria-label="Copy full order ID"
        className="text-slate-400 group-hover:text-primary transition-colors focus:outline-none"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" />
        ) : (
          <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    </div>
  );
}
