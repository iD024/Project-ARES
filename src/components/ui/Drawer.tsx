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
          'backdrop-blur-2xl bg-[#07090E]/85 border border-white/10',
          'shadow-[0_24px_50px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.12)]',
          'rounded-3xl overflow-hidden transition-all duration-200 animate-in fade-in-50 zoom-in-95',
          side === 'left' ? 'left-4' : 'right-4',
          width,
          className
        )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.025]">
        <div>
          <h2 className="text-sm font-bold text-white font-mono tracking-wider uppercase">{title}</h2>
          {subtitle && (
            <p className="text-xs text-white/60 font-sans tracking-tight mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
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

export default Drawer;
