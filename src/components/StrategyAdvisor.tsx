import React from 'react';
import { StrategyAdvice } from '../types/blackjack';
import { Lightbulb, Info } from 'lucide-react';

interface StrategyAdvisorProps {
  advice: StrategyAdvice | null;
  enabled: boolean;
}

export const StrategyAdvisor: React.FC<StrategyAdvisorProps> = ({ advice, enabled }) => {
  if (!enabled || !advice) return null;

  const actionColors: Record<StrategyAdvice['action'], { bg: string; text: string; border: string }> = {
    HIT: { bg: 'bg-emerald-950/80', text: 'text-emerald-400', border: 'border-emerald-600/60' },
    STAND: { bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-600/60' },
    DOUBLE: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-600/60' },
    SPLIT: { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-600/60' },
    SURRENDER: { bg: 'bg-zinc-900/80', text: 'text-zinc-300', border: 'border-zinc-600/60' },
  };

  const style = actionColors[advice.action];

  return (
    <div className="w-full max-w-xl mx-auto px-3 animate-fade-in">
      <div
        className={`flex items-start sm:items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-md shadow-lg ${style.bg} ${style.border}`}
      >
        <div className="p-1 rounded-lg bg-black/40 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
          <Lightbulb className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300">
              Basic Strategy:
            </span>
            <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${style.text} bg-black/40 border border-white/10`}>
              {advice.action}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300/90 mt-0.5 line-clamp-2">
            {advice.explanation}
          </p>
        </div>

        <div className="text-slate-400/60 hidden sm:block">
          <Info className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
