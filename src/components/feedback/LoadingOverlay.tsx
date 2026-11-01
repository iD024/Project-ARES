import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'PROCESSING PLANETARY DATA...',
  className = '',
}) => {
  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none ${className}`}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-center">
        <Loader2 className="w-8 h-8 text-ares-rust animate-spin" />
        <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
          {message}
        </span>
      </div>
    </div>
  );
};
