import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'emerald' | 'crimson' | 'indigo' | 'cyan' | 'amber' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  crimson: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  slate: 'bg-zinc-800/70 text-zinc-300 border-zinc-700/60',
};

export default function Badge({ children, tone = 'indigo', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium tracking-wide',
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
