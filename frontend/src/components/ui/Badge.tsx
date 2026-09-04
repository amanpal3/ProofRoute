import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'emerald' | 'crimson' | 'indigo' | 'cyan' | 'amber' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  crimson: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
};

export default function Badge({ children, tone = 'indigo', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-wide',
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
