import React from 'react';

export interface SliderProps {
  label: string;
  value: number; // e.g. 0.0 to 1.0
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.05,
  onChange,
  className = '',
}) => {
  const percentage = Math.round(value * 100);

  return (
    <div className={`flex flex-col gap-1.5 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between text-slate-300">
        <span className="text-[11px] text-slate-400 font-medium">{label}</span>
        <span className="text-[11px] text-ares-cyan font-semibold">{percentage}%</span>
      </div>
      <input
        type="range"
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ares-rust focus:outline-none"
      />
    </div>
  );
};

