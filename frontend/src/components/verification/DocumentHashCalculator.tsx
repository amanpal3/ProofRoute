'use client';

import React, { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';
import { truncateHash } from '@/lib/crypto';

interface DocumentHashCalculatorProps {
  hash?: string;
  fileName?: string;
  timeMs?: number;
}

export default function DocumentHashCalculator({
  hash,
  fileName,
  timeMs,
}: DocumentHashCalculatorProps) {
  const [copied, setCopied] = useState(false);

  if (!hash) {
    return (
      <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 font-mono">
        SHA-256 digest will appear here after a document is hashed locally.
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1.5">
      <div className="flex items-center justify-between text-zinc-400 text-[11px]">
        <span className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-zinc-500" />
          SHA-256 Digest (WebCrypto)
        </span>
        <button type="button" onClick={copy} className="hover:text-white" aria-label="Copy document hash">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p className="text-zinc-200 break-all select-all font-medium text-xs leading-relaxed">{hash}</p>
      <p className="text-[11px] text-zinc-500">
        {fileName ? `${fileName} · ` : ''}
        {truncateHash(hash, 10, 8)}
        {typeof timeMs === 'number' ? ` · ${timeMs}ms` : ''}
      </p>
    </div>
  );
}
