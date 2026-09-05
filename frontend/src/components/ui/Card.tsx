import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'specular-card rounded-2xl p-6 sm:p-8 transition-all',
        hover && 'hover:border-zinc-700/80 hover:bg-zinc-900/80 hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
