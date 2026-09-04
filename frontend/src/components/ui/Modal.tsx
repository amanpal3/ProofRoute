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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          'relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40',
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={closeDisabled}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        {(title || description) && (
          <div className="pr-10 mb-5">
            {title && (
              <h3 id="modal-title" className="text-lg font-bold text-white">
                {title}
              </h3>
            )}
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
