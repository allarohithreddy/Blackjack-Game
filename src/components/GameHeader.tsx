import React from 'react';
import {
  Volume2,
  VolumeX,
  Lightbulb,
  LightbulbOff,
  BarChart3,
  History,
  BookOpen,
  Settings,
  PlusCircle,
  Layers,
} from 'lucide-react';

interface GameHeaderProps {
  bankroll: number;
  cardsRemaining: number;
  totalCards: number;
  soundEnabled: boolean;
  hintsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHints: () => void;
  onOpenStats: () => void;
  onOpenHistory: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onReloadBankroll: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  bankroll,
  cardsRemaining,
  totalCards,
  soundEnabled,
  hintsEnabled,
  onToggleSound,
  onToggleHints,
  onOpenStats,
  onOpenHistory,
  onOpenRules,
  onOpenSettings,
  onReloadBankroll,
}) => {
  const shoePercentage = Math.round((cardsRemaining / totalCards) * 100);

  return (
    <header className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-amber-900/30 px-3 py-2.5 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xl">
      {/* Brand & Table Shoe Counter */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 text-lg sm:text-xl">♠</span>
            <h1 className="font-casino font-black tracking-widest text-sm sm:text-lg bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              BLACKJACK PRO
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <span className="flex items-center gap-1" title="Cards remaining in shoe">
              <Layers className="w-3 h-3 text-amber-500/80" />
              <span>Shoe: {cardsRemaining} / {totalCards} ({shoePercentage}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center Bankroll Display */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 border border-amber-500/30 rounded-2xl px-3 sm:px-4 py-1.5 shadow-inner">
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-bold">
            Bankroll
          </span>
          <span className="text-sm sm:text-lg font-black text-amber-300 drop-shadow">
            ${bankroll.toLocaleString()}
          </span>
        </div>
        {bankroll < 50 && (
          <button
            type="button"
            onClick={onReloadBankroll}
            className="p-1 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition ml-1"
            title="Reload Bankroll ($1,000)"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Icons Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Hints Toggle */}
        <button
          type="button"
          onClick={onToggleHints}
          className={`p-2 rounded-xl border transition ${
            hintsEnabled
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(234,179,8,0.2)]'
              : 'bg-zinc-900 text-slate-500 border-zinc-800 hover:text-slate-300'
          }`}
          title={hintsEnabled ? 'Disable Strategy Advisor' : 'Enable Strategy Advisor'}
        >
          {hintsEnabled ? <Lightbulb className="w-4 h-4" /> : <LightbulbOff className="w-4 h-4" />}
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition ${
            soundEnabled
              ? 'bg-zinc-800 text-slate-200 border-zinc-700 hover:bg-zinc-700'
              : 'bg-zinc-900 text-rose-400 border-zinc-800'
          }`}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Stats Modal */}
        <button
          type="button"
          onClick={onOpenStats}
          className="p-2 rounded-xl bg-zinc-900 text-slate-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition"
          title="Player Statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        {/* History Modal */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="p-2 rounded-xl bg-zinc-900 text-slate-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition"
          title="Hand History"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Rules Modal */}
        <button
          type="button"
          onClick={onOpenRules}
          className="p-2 rounded-xl bg-zinc-900 text-slate-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition"
          title="House Rules & Payouts"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Settings Modal */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-zinc-900 text-slate-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition"
          title="Game Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
