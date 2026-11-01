import React from 'react';
import { Button } from '../ui/Button.tsx';
import { Compass } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
        {icon || <Compass className="w-6 h-6 text-slate-400 opacity-70" />}
      </div>
      <h4 className="text-xs font-bold font-mono text-slate-200 tracking-wider uppercase">{title}</h4>
      <p className="text-[11px] text-slate-400 font-sans mt-1 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
