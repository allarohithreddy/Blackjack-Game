import React from 'react';
import { clsx } from 'clsx';
import { CHIP_COLORS } from '../constants/rules';

interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
}

export const Chip: React.FC<ChipProps> = ({
  value,
  onClick,
  disabled = false,
  size = 'md',
  count,
}) => {
  const styling = CHIP_COLORS[value] || {
    bg: 'bg-zinc-700',
    border: 'border-zinc-500',
    text: 'text-white',
    ring: 'border-dashed border-zinc-400',
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs border-2',
    md: 'w-12 h-12 sm:w-14 sm:h-14 text-xs sm:text-sm border-[3px]',
    lg: 'w-16 h-16 sm:w-18 sm:h-18 text-sm sm:text-base border-4',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'relative rounded-full select-none font-bold transition-all duration-150 flex items-center justify-center flex-shrink-0',
        sizeClasses,
        styling.bg,
        styling.border,
        styling.text,
        disabled
          ? 'opacity-35 cursor-not-allowed filter grayscale'
          : 'cursor-pointer hover:scale-105 active:scale-95 shadow-[0_6px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.8)]',
        'group'
      )}
    >
      {/* Outer segmented ring pattern */}
      <div
        className={clsx(
          'absolute inset-0.5 rounded-full border border-white/30 pointer-events-none'
        )}
      />

      {/* Inner dashed ring */}
      <div
        className={clsx(
          'absolute inset-1.5 rounded-full border border-dashed border-white/50 pointer-events-none'
        )}
      />

      {/* Chip Denomination */}
      <div className="relative z-10 font-black tracking-tight flex items-center justify-center drop-shadow">
        ${value}
      </div>

      {/* Optional count badge for chip stacks */}
      {count && count > 1 && (
        <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[10px] font-black rounded-full px-1.5 py-0.5 shadow-md border border-amber-200">
          ×{count}
        </span>
      )}
    </button>
  );
};
