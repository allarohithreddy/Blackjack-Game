import React from 'react';
import { GameSettings } from '../types/blackjack';
import { X, Settings, RefreshCw } from 'lucide-react';
import { DEFAULT_INITIAL_BANKROLL } from '../constants/rules';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetBankroll: () => void;
  onReshuffleShoe: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetBankroll,
  onReshuffleShoe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="font-casino font-bold text-lg text-amber-300 tracking-wider">
              Game Settings
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

        {/* Settings Options */}
        <div className="space-y-4 text-xs">
          {/* Deck Count */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Decks in Shoe</span>
              <span className="text-[11px] text-slate-400">
                Number of 52-card decks shuffled together
              </span>
            </div>
            <select
              value={settings.deckCount}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                onUpdateSettings({ deckCount: count });
                onReshuffleShoe();
              }}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
            >
              <option value={1}>1 Deck</option>
              <option value={2}>2 Decks</option>
              <option value={4}>4 Decks</option>
              <option value={6}>6 Decks (Standard)</option>
              <option value={8}>8 Decks</option>
            </select>
          </div>

          {/* Dealer Soft 17 Rule */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Dealer Hits Soft 17</span>
              <span className="text-[11px] text-slate-400">
                When enabled, dealer draws on Ace+6 (H17)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ dealerHitsSoft17: !settings.dealerHitsSoft17 })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.dealerHitsSoft17 ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.dealerHitsSoft17 ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Strategy Advisor Hints */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Basic Strategy Hints</span>
              <span className="text-[11px] text-slate-400">
                Show optimal move guidance on table
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ hintsEnabled: !settings.hintsEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.hintsEnabled ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.hintsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Sound Effects</span>
              <span className="text-[11px] text-slate-400">
                Synthesized casino audio & feedback
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fast Dealing */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Fast Deal Animations</span>
              <span className="text-[11px] text-slate-400">
                Speeds up card deal sequence
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ fastDealing: !settings.fastDealing })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.fastDealing ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.fastDealing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Actions Section */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={() => {
                onResetBankroll();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-xl font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Bankroll to ${DEFAULT_INITIAL_BANKROLL}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
