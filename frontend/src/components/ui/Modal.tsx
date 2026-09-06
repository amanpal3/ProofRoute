'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeDisabled?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  closeDisabled = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closeDisabled) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, closeDisabled]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          'relative w-full max-w-md bg-[#0d0f14] border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-2xl',
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={closeDisabled}
          className="absolute top-3.5 right-3.5 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/80 disabled:opacity-40 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
        {(title || description) && (
          <div className="pr-8 mb-4">
            {title && (
              <h3 id="modal-title" className="text-base font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}
            {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
