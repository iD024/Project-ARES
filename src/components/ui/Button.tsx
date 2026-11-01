import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tactical' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'tactical',
  size = 'md',
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-ares-cyan/50 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-45';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-1.5 gap-2',
    lg: 'text-sm px-4 py-2 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-ares-rust hover:bg-orange-600 text-white shadow-md shadow-orange-950/40 border border-orange-500/50',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80',
    tactical: 'bg-slate-900/85 hover:bg-slate-800/90 text-slate-200 border border-slate-700/70 hover:border-slate-600 active:scale-[0.98]',
    danger: 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
