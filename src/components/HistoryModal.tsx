import React from 'react';
import { Card as CardType, HandResultHistory } from '../types/blackjack';
import { X, History, Trash2, Sparkles } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HandResultHistory[];
  onClearHistory: () => void;
}

const SUIT_ICONS: Record<string, { symbol: string; color: string }> = {
  hearts: { symbol: '♥', color: 'text-red-500' },
  diamonds: { symbol: '♦', color: 'text-red-500' },
  clubs: { symbol: '♣', color: 'text-slate-200' },
  spades: { symbol: '♠', color: 'text-slate-200' },
};

const MiniCardTag: React.FC<{ card: CardType }> = ({ card }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const suit = SUIT_ICONS[card.suit] || { symbol: '♠', color: 'text-slate-200' };

  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-bold">
      <span className={isRed ? 'text-red-400' : 'text-slate-200'}>{card.rank}</span>
      <span className={suit.color}>{suit.symbol}</span>
    </span>
  );
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl w-full max-w-xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[85vh]">
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
        <div className="overflow-y-auto my-3 space-y-2.5 pr-1 flex-1">
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
                  className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col space-y-2 text-xs"
                >
                  {/* Top row: Outcome and Net profit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
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

                      {item.sideBetProfit && item.sideBetProfit > 0 && (
                        <span className="flex items-center gap-1 bg-purple-950 text-purple-300 border border-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          Pairs Won (+${item.sideBetProfit})
                        </span>
                      )}

                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-right">
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
                      <span className="text-slate-500 text-[10px] block">
                        Bet: ${item.bet}
                      </span>
                    </div>
                  </div>

                  {/* Cards Display Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 gap-2 flex-wrap">
                    {/* Player Cards */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Player ({item.playerScore}):</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.playerCards?.map((c, i) => (
                          <MiniCardTag key={c.id || `p-${i}`} card={c} />
                        ))}
                      </div>
                    </div>

                    {/* Dealer Cards */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Dealer ({item.dealerScore}):</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.dealerCards?.map((c, i) => (
                          <MiniCardTag key={c.id || `d-${i}`} card={c} />
                        ))}
                      </div>
                    </div>
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
