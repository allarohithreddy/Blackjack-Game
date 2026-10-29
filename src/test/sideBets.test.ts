import { describe, it, expect } from 'vitest';
import { evaluatePerfectPairs } from '../utils/sideBets';
import { Card } from '../types/blackjack';

function makeCard(rank: Card['rank'], suit: Card['suit']): Card {
  let val = 10;
  if (rank === 'A') val = 11;
  else if (['J', 'Q', 'K'].includes(rank)) val = 10;
  else val = parseInt(rank, 10);

  return { id: `test-${rank}-${suit}`, rank, suit, value: val, isFaceUp: true };
}

describe('Perfect Pairs Side Bet Evaluation', () => {
  it('awards 25:1 for Perfect Pair (same rank and same suit)', () => {
    const card1 = makeCard('K', 'spades');
    const card2 = makeCard('K', 'spades');
    const evalResult = evaluatePerfectPairs(card1, card2);

    expect(evalResult.outcome).toBe('perfect_pair');
    expect(evalResult.multiplier).toBe(25);
  });

  it('awards 12:1 for Colored Pair (same rank and same color)', () => {
    const card1 = makeCard('8', 'hearts');
    const card2 = makeCard('8', 'diamonds');
    const evalResult = evaluatePerfectPairs(card1, card2);

    expect(evalResult.outcome).toBe('colored_pair');
    expect(evalResult.multiplier).toBe(12);
  });

  it('awards 6:1 for Mixed Pair (same rank and different color)', () => {
    const card1 = makeCard('10', 'clubs');
    const card2 = makeCard('10', 'hearts');
    const evalResult = evaluatePerfectPairs(card1, card2);

    expect(evalResult.outcome).toBe('mixed_pair');
    expect(evalResult.multiplier).toBe(6);
  });

  it('returns loss (0 multiplier) for non-matching cards', () => {
    const card1 = makeCard('9', 'spades');
    const card2 = makeCard('J', 'spades');
    const evalResult = evaluatePerfectPairs(card1, card2);

    expect(evalResult.outcome).toBe('loss');
    expect(evalResult.multiplier).toBe(0);
  });
});
