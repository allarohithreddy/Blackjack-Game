import React from 'react';
import { TableTheme } from '../types/blackjack';

interface TableFeltProps {
  children: React.ReactNode;
  theme?: TableTheme;
}

const THEME_GRADIENTS: Record<TableTheme, { gradient: string; arcBorder: string }> = {
  emerald: {
    gradient: 'from-emerald-800 via-emerald-950 to-zinc-950',
    arcBorder: 'border-amber-400/20',
  },
  'royal-blue': {
    gradient: 'from-blue-900 via-slate-950 to-zinc-950',
    arcBorder: 'border-cyan-400/20',
  },
  burgundy: {
    gradient: 'from-rose-950 via-red-950 to-zinc-950',
    arcBorder: 'border-amber-400/20',
  },
  midnight: {
    gradient: 'from-zinc-900 via-zinc-950 to-black',
    arcBorder: 'border-white/10',
  },
};

export const TableFelt: React.FC<TableFeltProps> = ({ children, theme = 'emerald' }) => {
  const currentTheme = THEME_GRADIENTS[theme] || THEME_GRADIENTS.emerald;

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden transition-colors duration-500">
      {/* Felt background styling */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentTheme.gradient} opacity-95 pointer-events-none transition-all duration-500`}
      />

      {/* Realistic felt fabric texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* Casino curved arc lines */}
      <div
        className={`absolute inset-x-6 sm:inset-x-12 top-10 bottom-20 border-2 ${currentTheme.arcBorder} rounded-b-[200px] sm:rounded-b-[300px] pointer-events-none transition-colors duration-500`}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-2 sm:p-4">
        {children}
      </div>
    </div>
  );
};
