"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 group">
      <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md border">
        {id}
      </span>
      <button 
        onClick={handleCopy}
        className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
        title="Copy ID"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    </div>
  );
}
