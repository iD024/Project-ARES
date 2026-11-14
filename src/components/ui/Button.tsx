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
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-1.5 gap-2',
    lg: 'text-sm px-4 py-2 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-ares-rust hover:bg-orange-600 text-white shadow-md shadow-orange-950/40 border border-orange-400/40 active:scale-[0.98]',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/15 active:scale-[0.98]',
    tactical: 'bg-white/[0.04] hover:bg-white/[0.09] text-white/90 hover:text-white border border-white/10 hover:border-white/20 shadow-sm active:scale-[0.98]',
    danger: 'bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-700/50 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-white/10 text-white/70 hover:text-white active:scale-[0.98]',
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

export default Button;
