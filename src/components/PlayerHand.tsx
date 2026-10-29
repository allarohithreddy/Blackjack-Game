import React from 'react';
import { Hand } from '../types/blackjack';
import { calculateHandScore } from '../utils/hand';
import { Card } from './Card';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface PlayerHandProps {
  hand: Hand;
  isActive: boolean;
  handIndex: number;
  totalHands: number;
  isPlayerTurn: boolean;
  roundOver: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  isActive,
  handIndex,
  totalHands,
  isPlayerTurn,
  roundOver,
}) => {
  const score = calculateHandScore(hand.cards);

  const getStatusBadge = () => {
    if (hand.status === 'blackjack') {
      return (
        <span className="flex items-center gap-1 bg-amber-500 text-zinc-950 px-2.5 py-0.5 rounded-full text-xs font-black shadow-lg shadow-amber-500/30 animate-bounce-short">
          <Sparkles className="w-3.5 h-3.5" />
          BLACKJACK!
        </span>
      );
    }
    if (hand.status === 'busted' || score.isBust) {
      return (
        <span className="flex items-center gap-1 bg-red-600/90 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
          <X className="w-3.5 h-3.5" />
          BUST
        </span>
      );
    }
    if (hand.status === 'surrendered') {
      return (
        <span className="bg-zinc-700 text-zinc-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
          SURRENDERED
        </span>
      );
    }
    if (roundOver) {
      if (['won', 'double_won'].includes(hand.status)) {
        return (
          <span className="flex items-center gap-1 bg-emerald-500 text-zinc-950 px-2.5 py-0.5 rounded-full text-xs font-black shadow-emerald-500/20">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            WINNER
          </span>
        );
      }
      if (['lost', 'double_lost'].includes(hand.status)) {
        return (
          <span className="bg-red-600/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
            LOST
          </span>
        );
      }
      if (['push', 'double_push'].includes(hand.status)) {
        return (
          <span className="bg-amber-600/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
            PUSH
          </span>
        );
      }
    }
    return (
      <span className="bg-black/50 text-slate-200 border border-white/10 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        {score.displayScore}
      </span>
    );
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
        isActive && isPlayerTurn
          ? 'bg-amber-500/10 border-2 border-amber-400 shadow-[0_0_25px_rgba(234,179,8,0.25)] ring-2 ring-amber-400/20'
          : 'bg-black/20 border border-white/5'
      }`}
    >
      {/* Active Hand Indicator for Split Hands */}
      {isActive && isPlayerTurn && totalHands > 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
          <ArrowRight className="w-3 h-3 animate-pulse" />
          <span>Active Hand</span>
        </div>
      )}

      {/* Hand Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-casino text-xs sm:text-sm text-slate-300 uppercase font-bold tracking-wider">
          {totalHands > 1 ? `Hand #${handIndex + 1}` : 'Player'}
        </span>

        {getStatusBadge()}

        {/* Bet Badge */}
        <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full text-xs font-bold">
          <span>${hand.bet}</span>
          {hand.isDoubled && (
            <span className="bg-amber-400 text-black text-[9px] px-1 rounded uppercase font-black">
              2x
            </span>
          )}
        </div>
      </div>

      {/* Cards Area */}
      <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-[120px] sm:min-h-[150px] px-2 py-1">
        {hand.cards.map((card, idx) => (
          <div
            key={card.id || `player-${handIndex}-${idx}`}
            className="transform transition-transform duration-300 hover:-translate-y-2"
          >
            <Card card={card} index={idx} />
          </div>
        ))}
      </div>
    </div>
  );
};
