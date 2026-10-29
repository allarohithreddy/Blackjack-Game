import React, { useState } from 'react';
import { CHIP_VALUES, MIN_BET, MAX_BET } from '../constants/rules';
import { Chip } from './Chip';
import { Play, RotateCcw, XCircle, ArrowUpCircle, Sparkles } from 'lucide-react';

interface BettingAreaProps {
  currentBet: number;
  sideBet?: number;
  bankroll: number;
  lastBet: number;
  onAddChip: (val: number, isSideBet?: boolean) => void;
  onClearBet: () => void;
  onClearSideBet?: () => void;
  onDoubleBet: () => void;
  onAllIn: () => void;
  onDeal: () => void;
  onRebetAndDeal?: () => void;
  isDealing: boolean;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
  currentBet,
  sideBet = 0,
  bankroll,
  lastBet,
  onAddChip,
  onClearBet,
  onClearSideBet,
  onDoubleBet,
  onAllIn,
  onDeal,
  onRebetAndDeal,
  isDealing,
}) => {
  const [activeTarget, setActiveTarget] = useState<'main' | 'side'>('main');

  const canDeal = currentBet >= MIN_BET && !isDealing;
  const canDouble = currentBet > 0 && bankroll >= currentBet && currentBet * 2 <= MAX_BET;
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
  const placedSideChips = getChipBreakdown(sideBet);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-4 px-3">
      {/* Table Betting Spots (Side Bet & Main Bet) */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
        {/* OPTIONAL SIDE BET SPOT: PERFECT PAIRS */}
        <div className="flex flex-col items-center">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTarget(activeTarget === 'side' ? 'main' : 'side')}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer ${
              activeTarget === 'side'
                ? 'border-purple-400 bg-purple-950/30 ring-2 ring-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : sideBet > 0
                ? 'border-purple-500/70 bg-purple-950/20'
                : 'border-purple-400/30 bg-black/20 hover:border-purple-400/50'
            }`}
          >
            {sideBet > 0 ? (
              <div className="flex flex-col items-center justify-center animate-bounce-short">
                <div className="flex -space-x-3 mb-1">
                  {placedSideChips.slice(0, 2).map((c) => (
                    <Chip key={c.value} value={c.value} size="sm" count={c.count} />
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold text-purple-300">
                  Pairs Bet
                </span>
                <span className="text-sm sm:text-base font-black text-purple-200">
                  ${sideBet}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-400 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pairs</span>
                </div>
                <span className="text-[9px] text-slate-400 block leading-tight">
                  Pays up to 25:1
                </span>
                <span className="text-[9px] text-purple-400/80 font-medium block mt-1">
                  {activeTarget === 'side' ? '● Adding Chips' : '+ Click to Bet'}
                </span>
              </div>
            )}
          </div>
          {sideBet > 0 && onClearSideBet && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSideBet();
              }}
              className="mt-1 text-[10px] text-purple-300/70 hover:text-purple-200 underline cursor-pointer"
            >
              Clear Pairs
            </button>
          )}
        </div>

        {/* MAIN TABLE BETTING CIRCLE */}
        <div className="flex flex-col items-center">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTarget('main')}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer ${
              activeTarget === 'main' && currentBet > 0
                ? 'border-amber-400 bg-amber-950/20 ring-2 ring-amber-400/30 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
                : currentBet > 0
                ? 'border-amber-500/60 bg-amber-950/15'
                : activeTarget === 'main'
                ? 'border-amber-400/60 bg-black/30'
                : 'border-white/20 bg-black/20 hover:border-amber-400/40'
            }`}
          >
            {currentBet > 0 ? (
              <div className="flex flex-col items-center justify-center animate-bounce-short">
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
                <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider block">
                  Place Main Bet
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block">
                  Min ${MIN_BET} • Max ${MAX_BET}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Selector Pill */}
      <div className="flex items-center gap-2 text-xs font-semibold bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="text-slate-400 text-[11px]">Bet Target:</span>
        <button
          type="button"
          onClick={() => setActiveTarget('main')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            activeTarget === 'main'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Main Bet
        </button>
        <button
          type="button"
          onClick={() => setActiveTarget('side')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            activeTarget === 'side'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Pairs Side Bet
        </button>
      </div>

      {/* Chip Rack */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-xl">
        {CHIP_VALUES.map((val) => {
          const isAffordable = bankroll >= val;
          return (
            <Chip
              key={val}
              value={val}
              size="md"
              disabled={!isAffordable || isDealing}
              onClick={() => onAddChip(val, activeTarget === 'side')}
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
          <span>Clear Main</span>
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
          <span className="text-xs opacity-60 ml-0.5 font-mono hidden sm:inline">(Space)</span>
        </button>
      </div>
    </div>
  );
};
