import React from 'react';
import { X, BookOpen, Keyboard } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-casino font-bold text-lg text-amber-300 tracking-wider">
              Rules & Table Payouts
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto my-3 space-y-4 pr-1 text-xs text-slate-300 leading-relaxed flex-1">
          {/* Payouts Section */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
            <h3 className="font-casino font-bold text-amber-400 text-sm tracking-wider uppercase">
              Table Payouts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-200">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Natural Blackjack:</span>
                <span className="font-black text-amber-400">3 : 2</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Standard Win:</span>
                <span className="font-bold text-emerald-400">1 : 1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Insurance:</span>
                <span className="font-bold text-blue-400">2 : 1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Surrender:</span>
                <span className="font-bold text-slate-400">Reclaims 50%</span>
              </div>
            </div>
          </div>

          {/* Core Rules */}
          <div className="space-y-2">
            <h3 className="font-casino font-bold text-amber-400 text-sm tracking-wider uppercase">
              Objective & Card Values
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Beat the dealer by getting a hand total closer to 21 without exceeding 21.</li>
              <li><strong className="text-white">Cards 2 to 10:</strong> Valued at face value.</li>
              <li><strong className="text-white">Face Cards (J, Q, K):</strong> Valued at 10.</li>
              <li><strong className="text-white">Aces:</strong> Valued as 11 or 1 (whichever benefits your hand most).</li>
              <li><strong className="text-white">Dealer Play:</strong> Dealer reveals hidden hole card and must draw until score reaches at least 17.</li>
            </ul>
          </div>

          {/* Player Actions */}
          <div className="space-y-2">
            <h3 className="font-casino font-bold text-amber-400 text-sm tracking-wider uppercase">
              Player Decisions
            </h3>
            <div className="space-y-2">
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-emerald-400">Hit:</span> Draw an additional card to increase your total.
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-rose-400">Stand:</span> End your turn and keep your current hand total.
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-amber-400">Double Down:</span> Double your original bet, draw exactly one additional card, and stand.
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-blue-400">Split:</span> If dealt two cards of matching rank or value, split them into two independent playable hands with matching bets.
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-zinc-300">Surrender:</span> Forfeit the hand immediately and retrieve half your original bet.
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="font-bold text-sky-400">Insurance:</span> Offered if dealer shows an Ace. Bet half your initial bet; pays 2:1 if dealer has Blackjack.
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-casino font-bold text-amber-400 text-sm tracking-wider uppercase">
              <Keyboard className="w-4 h-4" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">H</kbd>
                <span>Hit</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">S</kbd>
                <span>Stand</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">D</kbd>
                <span>Double</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">P</kbd>
                <span>Split</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">R</kbd>
                <span>Surrender</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono text-amber-300">Space</kbd>
                <span>Deal / Next</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
