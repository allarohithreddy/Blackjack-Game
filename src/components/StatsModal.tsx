import React from 'react';
import { GameStats } from '../types/blackjack';
import { X, Trophy, TrendingUp, Flame, RotateCcw } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const totalDecisiveHands = stats.handsWon + stats.handsLost;
  const winRate =
    totalDecisiveHands > 0 ? ((stats.handsWon / totalDecisiveHands) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-slate-100 flex flex-col space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-casino font-bold text-lg text-amber-300 tracking-wider">
              Player Statistics
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Hands Played */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Hands Played
            </span>
            <span className="text-xl font-black text-slate-200 mt-1">{stats.handsPlayed}</span>
          </div>

          {/* Win Rate */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Win Rate</span>
            <span className="text-xl font-black text-emerald-400 mt-1">{winRate}%</span>
          </div>

          {/* Blackjacks */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Blackjacks</span>
            <span className="text-xl font-black text-amber-400 mt-1">{stats.blackjacks}</span>
          </div>

          {/* Net Profit */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Net Profit</span>
            <span
              className={`text-xl font-black mt-1 ${
                stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {stats.netProfit >= 0 ? `+$${stats.netProfit}` : `-$${Math.abs(stats.netProfit)}`}
            </span>
          </div>

          {/* Win Streak */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              Streak
            </span>
            <span className="text-xl font-black text-orange-400 mt-1">
              {stats.currentStreak} (Best: {stats.bestWinStreak})
            </span>
          </div>

          {/* Highest Bankroll */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              Peak
            </span>
            <span className="text-xl font-black text-amber-300 mt-1">
              ${stats.highestBankroll.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Hands Won:</span>
            <span className="font-bold text-emerald-400">{stats.handsWon}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Hands Lost:</span>
            <span className="font-bold text-rose-400">{stats.handsLost}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Pushes (Ties):</span>
            <span className="font-bold text-slate-300">{stats.handsPushed}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Total Wagered:</span>
            <span className="font-bold text-slate-200">${stats.totalWagered.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Statistics</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
