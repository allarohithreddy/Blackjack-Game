import React from 'react';
import { Card as CardType, Suit } from '../types/blackjack';
import { clsx } from 'clsx';

interface CardProps {
  card: CardType;
  index?: number;
  isDealer?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, { symbol: string; color: string; label: string }> = {
  hearts: { symbol: '♥', color: 'text-red-500', label: 'Hearts' },
  diamonds: { symbol: '♦', color: 'text-red-500', label: 'Diamonds' },
  clubs: { symbol: '♣', color: 'text-slate-800', label: 'Clubs' },
  spades: { symbol: '♠', color: 'text-slate-800', label: 'Spades' },
};

export const Card: React.FC<CardProps> = ({ card, index = 0 }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const suitInfo = SUIT_SYMBOLS[card.suit];

  return (
    <div
      className={clsx(
        'relative w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 rounded-xl shadow-2xl transition-all duration-300',
        'preserve-3d cursor-default select-none animate-deal-card flex-shrink-0'
      )}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* CARD FRONT */}
      {card.isFaceUp ? (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-xl border border-slate-300/80 shadow-[0_4px_16px_rgba(0,0,0,0.35)] p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Top-left rank and suit */}
          <div className="flex flex-col items-center leading-none w-fit">
            <span
              className={clsx(
                'font-extrabold text-sm sm:text-base md:text-lg tracking-tight',
                isRed ? 'text-red-600' : 'text-zinc-900'
              )}
            >
              {card.rank}
            </span>
            <span className={clsx('text-xs sm:text-sm md:text-base font-bold', suitInfo.color)}>
              {suitInfo.symbol}
            </span>
          </div>

          {/* Center Graphic */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {['J', 'Q', 'K'].includes(card.rank) ? (
              <div
                className={clsx(
                  'font-casino font-black text-2xl sm:text-3xl md:text-4xl opacity-20',
                  isRed ? 'text-red-700' : 'text-zinc-800'
                )}
              >
                {card.rank}
              </div>
            ) : card.rank === 'A' ? (
              <div className={clsx('text-3xl sm:text-4xl md:text-5xl opacity-80', suitInfo.color)}>
                {suitInfo.symbol}
              </div>
            ) : (
              <div className={clsx('text-2xl sm:text-3xl md:text-4xl opacity-40', suitInfo.color)}>
                {suitInfo.symbol}
              </div>
            )}
          </div>

          {/* Bottom-right inverted rank and suit */}
          <div className="flex flex-col items-center leading-none w-fit self-end rotate-180">
            <span
              className={clsx(
                'font-extrabold text-sm sm:text-base md:text-lg tracking-tight',
                isRed ? 'text-red-600' : 'text-zinc-900'
              )}
            >
              {card.rank}
            </span>
            <span className={clsx('text-xs sm:text-sm md:text-base font-bold', suitInfo.color)}>
              {suitInfo.symbol}
            </span>
          </div>

          {/* Subtle glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-xl" />
        </div>
      ) : (
        /* CARD BACK (Hole Card) */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-950 via-red-900 to-amber-950 rounded-xl border-2 border-amber-400/70 shadow-2xl p-1.5 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full rounded-lg border border-amber-400/40 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:10px_10px] flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400/80 flex items-center justify-center bg-black/40 shadow-inner">
              <span className="font-casino font-bold text-amber-300 text-xs sm:text-sm tracking-widest">
                BJ
              </span>
            </div>
          </div>
          {/* Edge trim */}
          <div className="absolute inset-1 border border-amber-300/30 rounded-lg pointer-events-none" />
        </div>
      )}
    </div>
  );
};
