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
  width = 'w-96 sm:w-[440px]',
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
          'absolute top-20 bottom-16 z-30 flex flex-col',
          'backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden',
          side === 'left' ? 'left-4' : 'right-4',
          width,
          className
        )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
        <div>
          <h2 className="text-base font-bold text-white font-mono tracking-wide">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-300 font-sans tracking-tight mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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

