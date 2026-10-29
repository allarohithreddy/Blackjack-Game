import React from 'react';
import { Card as CardType, HandStatus } from '../types/blackjack';
import { calculateHandScore } from '../utils/hand';
import { Card } from './Card';

interface TableSeatProps {
  name: string;
  avatar: string;
  bankroll: number;
  bet: number;
  cards: CardType[];
  status?: HandStatus;
  isTurn?: boolean;
  isDealer?: boolean;
  isUser?: boolean;
  onEmojiClick?: () => void;
}

export const TableSeat: React.FC<TableSeatProps> = ({
  name,
  avatar,
  bankroll,
  bet,
  cards,
  isTurn = false,
  isDealer = false,
  isUser = false,
  onEmojiClick,
}) => {
  const score = calculateHandScore(cards);

  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${isTurn ? 'scale-105' : ''}`}>
      {/* Player Avatar & Nametag */}
      <div className="relative flex items-center gap-2 mb-1 z-10">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg border-2 transition-all ${
            isTurn
              ? 'border-amber-400 bg-amber-950/80 ring-4 ring-amber-400/40 shadow-amber-500/50'
              : isUser
              ? 'border-amber-400/70 bg-black/60 shadow-md'
              : 'border-white/20 bg-black/50'
          }`}
        >
          <span>{avatar}</span>
        </div>

        {/* Nametag & Bankroll Badge */}
        <div className="flex flex-col bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[11px] text-white truncate max-w-[80px]">
              {name}
            </span>
            {isTurn && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <span className="text-[10px] text-amber-300/90 font-mono font-bold">
            ${bankroll.toLocaleString()}
          </span>
        </div>

        {/* Optional Emoji button for human player like reference */}
        {isUser && onEmojiClick && (
          <button
            type="button"
            onClick={onEmojiClick}
            className="p-1 rounded-lg bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition shadow cursor-pointer"
            title="Send Emoji"
          >
            😀
          </button>
        )}
      </div>

      {/* Bet Chip Badge */}
      {bet > 0 && (
        <div className="flex items-center gap-1 bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border border-amber-300 animate-bounce-short mb-1 z-10">
          <span>Bet: ${bet}</span>
        </div>
      )}

      {/* Cards Dealt in Front of Seat */}
      {cards.length > 0 && (
        <div className="flex flex-col items-center">
          {/* Hand Score Badge */}
          <div className="mb-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow transition ${
                score.isBlackjack
                  ? 'bg-amber-500 text-black'
                  : score.isBust
                  ? 'bg-red-600 text-white'
                  : 'bg-black/70 text-slate-200 border border-white/10'
              }`}
            >
              {isDealer && !cards.every((c) => c.isFaceUp)
                ? `Showing ${cards[0]?.value || '?'}`
                : score.displayScore}
            </span>
          </div>

          {/* Cards Stack */}
          <div className="flex items-center justify-center -space-x-10 sm:-space-x-12">
            {cards.map((card, idx) => (
              <div
                key={card.id || `${name}-${idx}`}
                className="transform transition-transform duration-300 hover:-translate-y-2"
              >
                <Card card={card} index={idx} isDealer={isDealer} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
