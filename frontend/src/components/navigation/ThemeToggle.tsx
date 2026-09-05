'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg border border-transparent" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 rounded-lg border transition-all active:scale-[0.96] flex items-center justify-center ${
        isDark
          ? 'text-zinc-400 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700'
          : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 hover:border-zinc-300'
      } ${className || ''}`}
      aria-label={isDark ? 'Switch to Day mode' : 'Switch to Night mode'}
      title={isDark ? 'Switch to Day mode' : 'Switch to Night mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
