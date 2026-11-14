import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 'max-w-2xl',
  className,
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in-50"
      onClick={onClose}
    >
      <div
        className={twMerge(
          clsx(
            'w-full flex flex-col rounded-2xl overflow-hidden',
            'backdrop-blur-2xl bg-[#080A0F]/92 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.14)]',
            maxWidth,
            className
          )
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.025]">
          <div>
            <h2 className="text-base font-bold text-white font-mono tracking-wide">{title}</h2>
            {subtitle && (
              <p className="text-xs text-white/60 font-sans tracking-tight mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
