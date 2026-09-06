import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  steps: string[];
  currentIndex: number;
}

export default function ProgressSteps({ steps, currentIndex }: ProgressStepsProps) {
  return (
    <div className="space-y-2">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              'h-1 rounded-full transition-colors',
              index <= currentIndex ? 'bg-emerald-400' : 'bg-zinc-800'
            )}
            aria-hidden
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-wide text-zinc-500">
        {steps.map((step, index) => (
          <span key={step} className={cn(index <= currentIndex && 'text-zinc-200 font-medium')}>
            {step.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
