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
  const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider border uppercase backdrop-blur-md';

  const variants = {
    OBSERVED: 'bg-cyan-950/30 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    DERIVED: 'bg-amber-950/30 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    MODELED: 'bg-purple-950/30 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
    SIMULATED: 'bg-white/5 text-white/60 border-white/10',
    ACTIVE: 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    DEFAULT: 'bg-white/5 text-white/80 border-white/10',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {children}
    </span>
  );
};

export default Badge;
