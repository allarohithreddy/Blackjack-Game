import React from 'react';
import { Sparkles, Shield, AlertCircle } from 'lucide-react';

interface ActionDialogProps {
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
  currentScore: string;
  currentBet: number;
  strategyHint?: string;
}

export const ActionDialog: React.FC<ActionDialogProps> = ({
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
  currentScore,
  currentBet,
  strategyHint,
}) => {
  // If Insurance is currently offered
  if (isInsuranceOffer) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400 animate-deal-card text-zinc-900 z-30">
        {/* Header */}
        <div className="bg-indigo-900 px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Insurance Offer</span>
          </div>
          <span className="text-xs bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded-full">
            Cost: ${insuranceCost}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Dealer is showing an Ace. Protect your hand against Dealer Blackjack (Pays 2:1).
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onAcceptInsurance}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Take Insurance (${insuranceCost})
            </button>
            <button
              type="button"
              onClick={onDeclineInsurance}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-deal-card text-zinc-900 z-30 select-none">
      {/* Header Bar matching Reference Image */}
      <div className="bg-indigo-900 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">👑</span>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs tracking-wide uppercase">Your Turn</span>
            <span className="text-[10px] text-indigo-200">Score: {currentScore} • Bet: ${currentBet}</span>
          </div>
        </div>

        {strategyHint && (
          <span className="flex items-center gap-1 bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
            <Sparkles className="w-3 h-3" />
            <span>Hint: {strategyHint}</span>
          </span>
        )}
      </div>

      {/* 2x3 Action Grid (Exact layout from reference) */}
      <div className="grid grid-cols-3 divide-x divide-y divide-slate-200 bg-white">
        {/* HIT */}
        <button
          type="button"
          onClick={onHit}
          className="p-3 text-center transition hover:bg-emerald-50 active:bg-emerald-100 flex flex-col items-center justify-center cursor-pointer group"
        >
          <span className="text-xs font-black text-slate-800 group-hover:text-emerald-700 capitalize">
            hit
          </span>
          <span className="text-[9px] text-slate-400 font-mono">[H]</span>
        </button>

        {/* STAND */}
        <button
          type="button"
          onClick={onStand}
          className="p-3 text-center transition hover:bg-rose-50 active:bg-rose-100 flex flex-col items-center justify-center cursor-pointer group"
        >
          <span className="text-xs font-black text-slate-800 group-hover:text-rose-700 capitalize">
            stand
          </span>
          <span className="text-[9px] text-slate-400 font-mono">[S]</span>
        </button>

        {/* DOUBLE */}
        <button
          type="button"
          disabled={!canDouble}
          onClick={onDouble}
          className={`p-3 text-center transition flex flex-col items-center justify-center ${
            canDouble
              ? 'hover:bg-amber-50 active:bg-amber-100 cursor-pointer group'
              : 'opacity-35 cursor-not-allowed bg-slate-50'
          }`}
        >
          <span
            className={`text-xs font-black capitalize ${
              canDouble ? 'text-slate-800 group-hover:text-amber-700' : 'text-slate-400'
            }`}
          >
            double
          </span>
          <span className="text-[9px] text-slate-400 font-mono">[D]</span>
        </button>

        {/* SPLIT */}
        <button
          type="button"
          disabled={!canSplit}
          onClick={onSplit}
          className={`p-3 text-center transition flex flex-col items-center justify-center ${
            canSplit
              ? 'hover:bg-blue-50 active:bg-blue-100 cursor-pointer group'
              : 'opacity-35 cursor-not-allowed bg-slate-50'
          }`}
        >
          <span
            className={`text-xs font-black capitalize ${
              canSplit ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-400'
            }`}
          >
            split
          </span>
          <span className="text-[9px] text-slate-400 font-mono">[P]</span>
        </button>

        {/* INSURANCE (Disabled in standard turn) */}
        <div className="p-3 text-center flex flex-col items-center justify-center opacity-30 bg-slate-50 cursor-not-allowed">
          <span className="text-xs font-bold text-slate-400 capitalize">
            insurance
          </span>
          <span className="text-[9px] text-slate-400">Ace only</span>
        </div>

        {/* SURRENDER */}
        <button
          type="button"
          disabled={!canSurrender}
          onClick={onSurrender}
          className={`p-3 text-center transition flex flex-col items-center justify-center ${
            canSurrender
              ? 'hover:bg-zinc-100 active:bg-zinc-200 cursor-pointer group'
              : 'opacity-35 cursor-not-allowed bg-slate-50'
          }`}
        >
          <span
            className={`text-xs font-bold capitalize ${
              canSurrender ? 'text-slate-700 group-hover:text-black' : 'text-slate-400'
            }`}
          >
            surrender
          </span>
          <span className="text-[9px] text-slate-400 font-mono">[R]</span>
        </button>
      </div>
    </div>
  );
};
