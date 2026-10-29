import React from 'react';
import { GameSettings, TableTheme } from '../types/blackjack';
import { X, Settings, RefreshCw, Palette, Calculator } from 'lucide-react';
import { DEFAULT_INITIAL_BANKROLL } from '../constants/rules';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetBankroll: () => void;
  onReshuffleShoe: () => void;
}

const THEME_OPTIONS: { id: TableTheme; label: string; colorClass: string }[] = [
  { id: 'emerald', label: 'Emerald Felt', colorClass: 'bg-emerald-700 border-emerald-400' },
  { id: 'royal-blue', label: 'Monte Carlo Blue', colorClass: 'bg-blue-800 border-blue-400' },
  { id: 'burgundy', label: 'Macau Burgundy', colorClass: 'bg-rose-900 border-rose-400' },
  { id: 'midnight', label: 'Midnight Onyx', colorClass: 'bg-zinc-800 border-zinc-400' },
];

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
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
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
          {/* Table Felt Theme */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Table Felt Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onUpdateSettings({ tableTheme: theme.id })}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                    settings.tableTheme === theme.id
                      ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(234,179,8,0.2)] font-bold text-white'
                      : 'border-white/10 bg-black/40 hover:bg-black/60 text-slate-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border ${theme.colorClass}`} />
                  <span className="text-[11px] truncate">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hi-Lo Card Counting Coach */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                Hi-Lo Card Counting HUD
              </span>
              <span className="text-[11px] text-slate-400">
                Displays real-time Running & True Counts
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ cardCountingEnabled: !settings.cardCountingEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.cardCountingEnabled ? 'bg-amber-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.cardCountingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

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
