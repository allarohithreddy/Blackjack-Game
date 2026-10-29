import React from 'react';
import { HandResultHistory } from '../types/blackjack';
import { X, History, Trash2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HandResultHistory[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="font-casino font-bold text-lg text-amber-300 tracking-wider">
              Hand History
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

        {/* History List */}
        <div className="overflow-y-auto my-3 space-y-2 pr-1 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No hands played yet in this session. Deal a hand to start tracking history!
            </div>
          ) : (
            history.map((item) => {
              const isProfit = item.profit > 0;
              const isLoss = item.profit < 0;

              return (
                <div
                  key={item.id}
                  className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                          item.playerOutcome === 'blackjack'
                            ? 'bg-amber-500 text-zinc-950 font-black'
                            : item.playerOutcome === 'win'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : item.playerOutcome === 'loss'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-zinc-800 text-slate-300 border border-zinc-700'
                        }`}
                      >
                        {item.playerOutcome}
                      </span>
                      <span className="text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-slate-300 mt-1">
                      <span>Player: </span>
                      <span className="font-bold text-white">{item.playerScore}</span>
                      <span className="text-slate-500"> vs </span>
                      <span>Dealer: </span>
                      <span className="font-bold text-white">{item.dealerScore}</span>
                      {item.playerHandsCount > 1 && (
                        <span className="text-[10px] text-amber-400 ml-1.5 font-semibold">
                          (Split)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <span className="text-slate-400 text-[11px]">Bet: ${item.bet}</span>
                    <span
                      className={`font-black text-sm ${
                        isProfit
                          ? 'text-emerald-400'
                          : isLoss
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isProfit ? `+$${item.profit}` : isLoss ? `-$${Math.abs(item.profit)}` : '$0'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
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
