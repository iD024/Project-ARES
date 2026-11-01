import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DrawerProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  title,
  subtitle,
  onClose,
  side = 'left',
  children,
  className,
  width = 'w-84 sm:w-96',
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <aside
      className={twMerge(
        clsx(
          'absolute top-16 bottom-14 z-30 flex flex-col',
          'backdrop-blur-xl bg-slate-900/90 border border-slate-700/60 shadow-2xl rounded-2xl overflow-hidden',
          side === 'left' ? 'left-4' : 'right-4',
          width,
          className
        )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">{title}</h2>
          {subtitle && (
            <p className="text-[10px] text-slate-400 font-sans tracking-tight">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {children}
      </div>
    </aside>
  );
};
