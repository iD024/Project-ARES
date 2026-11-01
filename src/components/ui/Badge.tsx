import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DataClassification } from '../../types/hud.ts';

export interface BadgeProps {
  variant?: DataClassification | 'ACTIVE' | 'DEFAULT';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'DEFAULT', children, className }) => {
  const base = 'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide border uppercase';

  const variants = {
    OBSERVED: 'bg-cyan-950/40 text-cyan-400 border-cyan-800/60',
    DERIVED: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
    MODELED: 'bg-purple-950/40 text-purple-400 border-purple-800/60',
    SIMULATED: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
    ACTIVE: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60',
    DEFAULT: 'bg-slate-800/50 text-slate-300 border-slate-700/50',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {children}
    </span>
  );
};
