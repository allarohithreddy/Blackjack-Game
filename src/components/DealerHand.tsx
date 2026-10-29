import React from 'react';
import { Card as CardType } from '../types/blackjack';
import { calculateHandScore } from '../utils/hand';
import { Card } from './Card';
import { ShieldAlert } from 'lucide-react';

interface DealerHandProps {
  cards: CardType[];
  isDealerTurn: boolean;
  roundOver: boolean;
}

export const DealerHand: React.FC<DealerHandProps> = ({ cards, isDealerTurn, roundOver }) => {
  const score = calculateHandScore(cards);
  const allRevealed = cards.every((c) => c.isFaceUp);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Hand Header & Score Badge */}
      <div className="flex items-center gap-2">
        <span className="font-casino text-xs sm:text-sm tracking-widest text-slate-300 uppercase font-bold">
          Dealer
        </span>

        {cards.length > 0 && (
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
              score.isBlackjack
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : score.isBust
                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                : 'bg-black/50 text-slate-200 border-white/10'
            }`}
          >
            {allRevealed ? (
              score.displayScore
            ) : (
              <span>Showing {cards[0]?.isFaceUp ? cards[0].value : '?'}</span>
            )}
          </div>
        )}

        {isDealerTurn && !roundOver && (
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Dealer playing...</span>
          </div>
        )}
      </div>

      {/* Cards Area */}
      <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-[120px] sm:min-h-[150px] px-4 py-1">
        {cards.map((card, idx) => (
          <div
            key={card.id || `dealer-${idx}`}
            className="transform transition-transform duration-300 hover:-translate-y-2"
          >
            <Card card={card} index={idx} isDealer />
          </div>
        ))}
      </div>
    </div>
  );
};
