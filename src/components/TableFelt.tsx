import React from 'react';
import { TableTheme } from '../types/blackjack';

interface TableFeltProps {
  children: React.ReactNode;
  theme?: TableTheme;
}

const THEME_GRADIENTS: Record<TableTheme, { gradient: string; arcBorder: string; textColor: string }> = {
  emerald: {
    gradient: 'from-emerald-800 via-emerald-950 to-zinc-950',
    arcBorder: 'border-amber-500/20',
    textColor: 'text-amber-300',
  },
  'royal-blue': {
    gradient: 'from-blue-900 via-slate-950 to-zinc-950',
    arcBorder: 'border-cyan-400/20',
    textColor: 'text-cyan-200',
  },
  burgundy: {
    gradient: 'from-rose-950 via-red-950 to-zinc-950',
    arcBorder: 'border-amber-400/20',
    textColor: 'text-amber-200',
  },
  midnight: {
    gradient: 'from-zinc-900 via-zinc-950 to-black',
    arcBorder: 'border-white/10',
    textColor: 'text-slate-300',
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

      {/* Subtle table texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Casino curved arc lines and gold markings */}
      <div
        className={`absolute inset-x-8 top-12 bottom-24 border-2 ${currentTheme.arcBorder} rounded-b-[180px] sm:rounded-b-[260px] pointer-events-none flex flex-col items-center justify-center transition-colors duration-500`}
      >
        {/* Table text in gold foil */}
        <div className="text-center space-y-1.5 opacity-25 select-none pointer-events-none px-4">
          <p
            className={`font-casino font-black tracking-[0.25em] text-xs sm:text-sm md:text-base ${currentTheme.textColor} uppercase`}
          >
            Blackjack Pays 3 to 2
          </p>
          <p className="font-casino font-semibold tracking-widest text-[10px] sm:text-xs text-amber-200/90 uppercase">
            Dealer Must Draw to 16 and Stand on all 17s
          </p>
          <p className="font-casino tracking-wider text-[9px] sm:text-[10px] text-amber-300/80 uppercase">
            Insurance Pays 2 to 1 • Perfect Pairs Pays 25 to 1
          </p>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-3 sm:p-6">
        {children}
      </div>
    </div>
  );
};
