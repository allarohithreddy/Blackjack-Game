import React from 'react';
import { Sparkles, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameBannerProps {
  roundOver: boolean;
  roundMessage: string | null;
  roundPayout: number;
  netProfit: number;
  onNextRound: () => void;
  isReshuffling: boolean;
}

export const GameBanner: React.FC<GameBannerProps> = ({
  roundOver,
  roundMessage,
  roundPayout,
  netProfit,
  onNextRound,
  isReshuffling,
}) => {
  if (isReshuffling) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-950/80 border border-amber-500/60 text-amber-300 rounded-full shadow-lg text-xs font-semibold animate-pulse">
        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
        <span>Reshuffling shoe (penetration threshold reached)...</span>
      </div>
    );
  }

  if (!roundOver || !roundMessage) {
    return null;
  }

  const isWin = netProfit > 0;
  const isLoss = netProfit < 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 max-w-md mx-auto px-3 animate-deal-card">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-xl backdrop-blur-md ${
          isWin
            ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-200'
            : isLoss
            ? 'bg-rose-950/90 border-rose-500/70 text-rose-200'
            : 'bg-zinc-900/90 border-zinc-600/70 text-slate-200'
        }`}
      >
        {isWin ? (
          <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
        ) : isLoss ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        ) : (
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
        )}

        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
            {roundMessage}
          </span>
          {roundPayout > 0 && (
            <span className="text-xs font-semibold text-amber-400">
              Payout: ${roundPayout.toLocaleString()} {isWin ? `(+$${netProfit.toLocaleString()})` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Button to quickly play next round */}
      <button
        type="button"
        onClick={onNextRound}
        className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-zinc-950 font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Next Hand (Space)</span>
      </button>
    </div>
  );
};
