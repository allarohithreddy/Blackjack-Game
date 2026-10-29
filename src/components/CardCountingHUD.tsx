import React, { useState } from 'react';
import { analyzeCount } from '../utils/cardCounting';
import { Calculator, ChevronDown, ChevronUp, Flame, Snowflake, Scale } from 'lucide-react';

interface CardCountingHUDProps {
  runningCount: number;
  cardsRemaining: number;
  enabled: boolean;
}

export const CardCountingHUD: React.FC<CardCountingHUDProps> = ({
  runningCount,
  cardsRemaining,
  enabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!enabled) return null;

  const analysis = analyzeCount(runningCount, cardsRemaining);

  const getAdvantageStyles = () => {
    switch (analysis.advantage) {
      case 'hot':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
        };
      case 'cold':
        return {
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
          icon: <Snowflake className="w-3.5 h-3.5 text-sky-400" />,
        };
      default:
        return {
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          icon: <Scale className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const styles = getAdvantageStyles();

  return (
    <div className="w-full max-w-xl mx-auto px-3 animate-fade-in">
      <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-xl text-xs">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <span className="font-casino font-bold uppercase tracking-wider text-[11px] text-amber-300">
              Hi-Lo Counter
            </span>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400 text-[10px]">RC:</span>
              <span
                className={`font-black ${
                  runningCount > 0
                    ? 'text-emerald-400'
                    : runningCount < 0
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {runningCount > 0 ? `+${runningCount}` : runningCount}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400 text-[10px]">TC:</span>
              <span
                className={`font-black ${
                  analysis.trueCount > 0
                    ? 'text-emerald-400'
                    : analysis.trueCount < 0
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {analysis.trueCount > 0 ? `+${analysis.trueCount}` : analysis.trueCount}
              </span>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles.badge}`}
            >
              {styles.icon}
              <span>{analysis.label}</span>
            </div>

            {/* Toggle Details */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              title="Toggle Counting Coach Guide"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Advice & Explanation */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
            <p className="font-medium text-amber-200/90">{analysis.advice}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded">
              <span>Low (2–6): <strong className="text-emerald-400">+1</strong></span>
              <span>Neutral (7–9): <strong className="text-slate-300">0</strong></span>
              <span>High (10–A): <strong className="text-rose-400">-1</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
