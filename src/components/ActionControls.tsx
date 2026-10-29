import React from 'react';
import { Plus, Hand, Coins, GitFork, Flag, Shield } from 'lucide-react';

interface ActionControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  onSurrender: () => void;
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  isInsuranceOffer: boolean;
  insuranceCost: number;
  onAcceptInsurance: () => void;
  onDeclineInsurance: () => void;
  disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onHit,
  onStand,
  onDouble,
  onSplit,
  onSurrender,
  canDouble,
  canSplit,
  canSurrender,
  isInsuranceOffer,
  insuranceCost,
  onAcceptInsurance,
  onDeclineInsurance,
  disabled = false,
}) => {
  // Insurance Dialog
  if (isInsuranceOffer) {
    return (
      <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 rounded-2xl border-2 border-amber-400/80 shadow-2xl max-w-md mx-auto animate-bounce-short text-center">
        <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
          <Shield className="w-5 h-5" />
          <span className="uppercase tracking-wider text-sm">Insurance Offered</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mb-4">
          Dealer shows an Ace. Protect against Dealer Blackjack for{' '}
          <span className="text-amber-400 font-bold">${insuranceCost}</span> (Pays 2:1).
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAcceptInsurance}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/20"
          >
            Take Insurance (${insuranceCost})
          </button>
          <button
            type="button"
            onClick={onDeclineInsurance}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-zinc-600 transition"
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-xl mx-auto px-2">
      {/* HIT BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={onHit}
        className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-700/30 transition disabled:opacity-40 disabled:cursor-not-allowed group"
        title="Draw another card (Hotkey: H)"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Hit</span>
        <span className="hidden sm:inline-block ml-1 opacity-60 text-[10px] bg-black/30 px-1 py-0.5 rounded font-mono">
          [H]
        </span>
      </button>

      {/* STAND BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={onStand}
        className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-rose-700 hover:bg-rose-600 active:scale-95 text-white shadow-lg shadow-rose-800/30 transition disabled:opacity-40 disabled:cursor-not-allowed group"
        title="End turn with current hand (Hotkey: S)"
      >
        <Hand className="w-4 h-4" />
        <span>Stand</span>
        <span className="hidden sm:inline-block ml-1 opacity-60 text-[10px] bg-black/30 px-1 py-0.5 rounded font-mono">
          [S]
        </span>
      </button>

      {/* DOUBLE DOWN BUTTON */}
      <button
        type="button"
        disabled={disabled || !canDouble}
        onClick={onDouble}
        className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 shadow-lg shadow-amber-500/25 transition disabled:opacity-35 disabled:cursor-not-allowed"
        title="Double bet and receive exactly 1 card (Hotkey: D)"
      >
        <Coins className="w-4 h-4" />
        <span>Double</span>
        <span className="hidden sm:inline-block ml-1 opacity-70 text-[10px] bg-black/20 px-1 py-0.5 rounded font-mono">
          [D]
        </span>
      </button>

      {/* SPLIT BUTTON */}
      <button
        type="button"
        disabled={disabled || !canSplit}
        onClick={onSplit}
        className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-700/30 transition disabled:opacity-35 disabled:cursor-not-allowed"
        title="Split matching pair into two hands (Hotkey: P)"
      >
        <GitFork className="w-4 h-4" />
        <span>Split</span>
        <span className="hidden sm:inline-block ml-1 opacity-60 text-[10px] bg-black/30 px-1 py-0.5 rounded font-mono">
          [P]
        </span>
      </button>

      {/* SURRENDER BUTTON */}
      <button
        type="button"
        disabled={disabled || !canSurrender}
        onClick={onSurrender}
        className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 border border-zinc-700 shadow-md transition disabled:opacity-35 disabled:cursor-not-allowed"
        title="Forfeit hand and retrieve 50% of bet (Hotkey: R)"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Surrender</span>
        <span className="hidden sm:inline-block ml-1 opacity-50 text-[10px] bg-black/40 px-1 py-0.5 rounded font-mono">
          [R]
        </span>
      </button>
    </div>
  );
};
