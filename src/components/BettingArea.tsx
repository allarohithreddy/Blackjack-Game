import React from 'react';
import { CHIP_VALUES, MIN_BET, MAX_BET } from '../constants/rules';
import { Chip } from './Chip';
import { Play, RotateCcw, XCircle, ArrowUpCircle } from 'lucide-react';

interface BettingAreaProps {
  currentBet: number;
  bankroll: number;
  lastBet: number;
  onAddChip: (val: number) => void;
  onClearBet: () => void;
  onDoubleBet: () => void;
  onAllIn: () => void;
  onDeal: () => void;
  onRebetAndDeal?: () => void;
  isDealing: boolean;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
  currentBet,
  bankroll,
  lastBet,
  onAddChip,
  onClearBet,
  onDoubleBet,
  onAllIn,
  onDeal,
  onRebetAndDeal,
  isDealing,
}) => {
  const canDeal = currentBet >= MIN_BET && !isDealing;
  const canDouble = currentBet > 0 && bankroll >= currentBet && (currentBet * 2) <= MAX_BET;
  const canRebet = lastBet > 0 && bankroll >= lastBet && currentBet === 0;

  // Compute chip breakdown for the current bet circle
  const getChipBreakdown = (amount: number) => {
    let rem = amount;
    const chips: { value: number; count: number }[] = [];
    const sortedVals = [...CHIP_VALUES].sort((a, b) => b - a);

    for (const val of sortedVals) {
      if (rem >= val) {
        const count = Math.floor(rem / val);
        chips.push({ value: val, count });
        rem %= val;
      }
    }
    return chips;
  };

  const placedChips = getChipBreakdown(currentBet);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-4 px-3">
      {/* Table Betting Circle & Placed Bet */}
      <div className="relative flex flex-col items-center justify-center">
        <div
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed ${
            currentBet > 0
              ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
              : 'border-white/20 bg-black/20'
          } flex flex-col items-center justify-center p-2 transition-all duration-300`}
        >
          {currentBet > 0 ? (
            <div className="flex flex-col items-center justify-center animate-bounce-short">
              {/* Overlapping chips display */}
              <div className="flex -space-x-4 mb-2">
                {placedChips.slice(0, 3).map((c) => (
                  <Chip key={c.value} value={c.value} size="sm" count={c.count} />
                ))}
              </div>
              <span className="text-xs uppercase tracking-widest text-amber-300/80 font-bold">
                Current Bet
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow">
                ${currentBet.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="text-center p-3">
              <span className="text-xs sm:text-sm font-medium text-slate-300/80 block uppercase tracking-wider">
                Place Bet
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block">
                Min ${MIN_BET} • Max ${MAX_BET}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chip Rack */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-xl">
        {CHIP_VALUES.map((val) => {
          const isAffordable = bankroll >= val && (currentBet + val) <= MAX_BET;
          return (
            <Chip
              key={val}
              value={val}
              size="md"
              disabled={!isAffordable || isDealing}
              onClick={() => onAddChip(val)}
            />
          );
        })}
      </div>

      {/* Bet Adjustments & Deal Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {/* Clear Bet */}
        <button
          type="button"
          disabled={currentBet === 0 || isDealing}
          onClick={onClearBet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
          title="Clear current bet (Hotkey: C)"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        {/* Double Bet */}
        <button
          type="button"
          disabled={!canDouble || isDealing}
          onClick={onDoubleBet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
          title="Double current bet"
        >
          <ArrowUpCircle className="w-3.5 h-3.5" />
          <span>2x Bet</span>
        </button>

        {/* All-in */}
        <button
          type="button"
          disabled={bankroll <= 0 || isDealing}
          onClick={onAllIn}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
          title="Bet entire bankroll"
        >
          <span>All-In</span>
        </button>

        {/* Re-bet & Deal */}
        {canRebet && onRebetAndDeal && (
          <button
            type="button"
            disabled={isDealing}
            onClick={onRebetAndDeal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
            title={`Rebet $${lastBet} and deal`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Rebet (${lastBet})</span>
          </button>
        )}

        {/* Main Deal Button */}
        <button
          type="button"
          disabled={!canDeal}
          onClick={onDeal}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition shadow-lg ${
            canDeal
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 hover:brightness-110 active:scale-95 shadow-amber-500/20 animate-pulse-subtle cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Deal Hand</span>
        </button>
      </div>
    </div>
  );
};
