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
        'glass-panel rounded-3xl p-6 sm:p-8',
        hover && 'glass-panel-hover',
        className
      )}
    >
      {children}
    </div>
  );
}
