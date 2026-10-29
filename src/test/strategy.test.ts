import { describe, it, expect } from 'vitest';
import { getBasicStrategyAdvice } from '../utils/strategy';
import { Card, Hand } from '../types/blackjack';

function makeCard(rank: Card['rank'], suit: Card['suit'] = 'spades'): Card {
  let val = 10;
  if (rank === 'A') val = 11;
  else if (['J', 'Q', 'K'].includes(rank)) val = 10;
  else val = parseInt(rank, 10);

  return {
    id: `test-${rank}-${suit}`,
    rank,
    suit,
    value: val,
    isFaceUp: true,
  };
}

describe('Basic Strategy Engine', () => {
  it('advises SPLIT on pair of Aces against any upcard', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('A', 'hearts'), makeCard('A', 'spades')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('6');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, true, true, true);

    expect(advice).toBeDefined();
    expect(advice?.action).toBe('SPLIT');
  });

  it('advises SPLIT on pair of 8s against 10', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('8', 'hearts'), makeCard('8', 'diamonds')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('10');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, true, true, true);

    expect(advice?.action).toBe('SPLIT');
  });

  it('advises DOUBLE on 11 against Dealer 6', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('5'), makeCard('6')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('6');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, true, false, false);

    expect(advice?.action).toBe('DOUBLE');
  });

  it('advises STAND on hard 17 against Dealer Ace', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('10'), makeCard('7')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('A');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, false, false, false);

    expect(advice?.action).toBe('STAND');
  });

  it('advises HIT on hard 12 against Dealer 2 (since 2 is not a strong bust card for dealer)', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('10'), makeCard('2')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('2');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, false, false, false);

    expect(advice?.action).toBe('HIT');
  });

  it('advises STAND on hard 12 against Dealer 4, 5, or 6', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('10'), makeCard('2')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerUpcard = makeCard('5');
    const advice = getBasicStrategyAdvice(hand, dealerUpcard, false, false, false);

    expect(advice?.action).toBe('STAND');
  });
});
