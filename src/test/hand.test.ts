import { describe, it, expect } from 'vitest';
import {
  calculateHandScore,
  canSplitHand,
  canDoubleHand,
  canSurrenderHand,
  evaluateHandOutcome,
} from '../utils/hand';
import { Card, Hand } from '../types/blackjack';

function makeCard(rank: Card['rank'], suit: Card['suit'] = 'spades', isFaceUp = true): Card {
  let val = 10;
  if (rank === 'A') val = 11;
  else if (['J', 'Q', 'K'].includes(rank)) val = 10;
  else val = parseInt(rank, 10);

  return {
    id: `test-${rank}-${suit}`,
    rank,
    suit,
    value: val,
    isFaceUp,
  };
}

describe('Blackjack Hand Calculations', () => {
  it('calculates simple hard totals accurately', () => {
    const cards = [makeCard('10'), makeCard('7')];
    const score = calculateHandScore(cards);
    expect(score.total).toBe(17);
    expect(score.isSoft).toBe(false);
    expect(score.isBust).toBe(false);
    expect(score.isBlackjack).toBe(false);
  });

  it('calculates soft totals with Ace counted as 11', () => {
    const cards = [makeCard('A'), makeCard('6')];
    const score = calculateHandScore(cards);
    expect(score.total).toBe(17);
    expect(score.isSoft).toBe(true);
    expect(score.isBust).toBe(false);
    expect(score.displayScore).toBe('17 (Soft)');
  });

  it('adjusts Ace from 11 to 1 when hand would otherwise bust', () => {
    const cards = [makeCard('A'), makeCard('6'), makeCard('10')];
    const score = calculateHandScore(cards);
    // 11 + 6 + 10 = 27 -> Ace becomes 1 -> 1 + 6 + 10 = 17
    expect(score.total).toBe(17);
    expect(score.isSoft).toBe(false); // No ace remains as 11
    expect(score.isBust).toBe(false);
  });

  it('handles multiple Aces gracefully', () => {
    const cards = [makeCard('A'), makeCard('A'), makeCard('9')];
    // 11 + 1 + 9 = 21
    const score = calculateHandScore(cards);
    expect(score.total).toBe(21);
    expect(score.isSoft).toBe(true);
    expect(score.isBlackjack).toBe(false); // Not natural 21 (3 cards)
  });

  it('identifies natural Blackjack (2 cards totaling 21)', () => {
    const cards = [makeCard('A'), makeCard('K')];
    const score = calculateHandScore(cards);
    expect(score.total).toBe(21);
    expect(score.isBlackjack).toBe(true);
    expect(score.displayScore).toBe('Blackjack! 21');
  });

  it('does NOT count 3-card 21 as natural Blackjack', () => {
    const cards = [makeCard('7'), makeCard('7'), makeCard('7')];
    const score = calculateHandScore(cards);
    expect(score.total).toBe(21);
    expect(score.isBlackjack).toBe(false);
  });

  it('detects bust correctly (> 21)', () => {
    const cards = [makeCard('10'), makeCard('6'), makeCard('7')];
    const score = calculateHandScore(cards);
    expect(score.total).toBe(23);
    expect(score.isBust).toBe(true);
  });
});

describe('Player Action Validation', () => {
  it('allows split when cards match rank and bankroll is sufficient', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('8', 'hearts'), makeCard('8', 'spades')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    expect(canSplitHand(hand, 100)).toBe(true);
    expect(canSplitHand(hand, 40)).toBe(false); // insufficient bankroll
  });

  it('allows split for different face cards with value 10', () => {
    const hand: Hand = {
      id: 'h1',
      cards: [makeCard('K', 'hearts'), makeCard('Q', 'spades')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    expect(canSplitHand(hand, 100)).toBe(true);
  });

  it('disallows double if bankroll is insufficient or hand has > 2 cards', () => {
    const hand2Cards: Hand = {
      id: 'h1',
      cards: [makeCard('5'), makeCard('6')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    expect(canDoubleHand(hand2Cards, 50)).toBe(true);
    expect(canDoubleHand(hand2Cards, 40)).toBe(false);

    const hand3Cards: Hand = {
      id: 'h2',
      cards: [makeCard('3'), makeCard('3'), makeCard('5')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    expect(canDoubleHand(hand3Cards, 100)).toBe(false);
  });

  it('validates surrender eligibility', () => {
    const freshHand: Hand = {
      id: 'h1',
      cards: [makeCard('10'), makeCard('6')],
      bet: 50,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    expect(canSurrenderHand(freshHand)).toBe(true);

    const splitHand: Hand = {
      ...freshHand,
      isSplitHand: true,
    };
    expect(canSurrenderHand(splitHand)).toBe(false);
  });
});

describe('Hand Outcome Evaluation', () => {
  it('awards 3:2 payout (2.5x total multiplier) for natural Blackjack', () => {
    const playerHand: Hand = {
      id: 'p1',
      cards: [makeCard('A'), makeCard('J')],
      bet: 100,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerHand: Hand = {
      id: 'd1',
      cards: [makeCard('10'), makeCard('9')],
      bet: 0,
      status: 'standing',
      isDoubled: false,
      isSplitHand: false,
    };

    const outcome = evaluateHandOutcome(playerHand, dealerHand);
    expect(outcome.outcome).toBe('blackjack');
    expect(outcome.payoutMultiplier).toBe(2.5); // $100 bet returns $250 ($150 net profit)
  });

  it('pushes when both player and dealer have Blackjack', () => {
    const playerHand: Hand = {
      id: 'p1',
      cards: [makeCard('A'), makeCard('J')],
      bet: 100,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerHand: Hand = {
      id: 'd1',
      cards: [makeCard('A'), makeCard('K')],
      bet: 0,
      status: 'standing',
      isDoubled: false,
      isSplitHand: false,
    };

    const outcome = evaluateHandOutcome(playerHand, dealerHand);
    expect(outcome.outcome).toBe('push');
    expect(outcome.payoutMultiplier).toBe(1.0); // original bet returned
  });

  it('wins 1:1 when dealer busts and player does not', () => {
    const playerHand: Hand = {
      id: 'p1',
      cards: [makeCard('10'), makeCard('8')],
      bet: 100,
      status: 'standing',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerHand: Hand = {
      id: 'd1',
      cards: [makeCard('10'), makeCard('6'), makeCard('8')], // 24 bust
      bet: 0,
      status: 'busted',
      isDoubled: false,
      isSplitHand: false,
    };

    const outcome = evaluateHandOutcome(playerHand, dealerHand);
    expect(outcome.outcome).toBe('win');
    expect(outcome.payoutMultiplier).toBe(2.0); // Returns $200 ($100 profit)
  });

  it('reclaims 50% on surrender', () => {
    const playerHand: Hand = {
      id: 'p1',
      cards: [makeCard('10'), makeCard('6')],
      bet: 100,
      status: 'surrendered',
      isDoubled: false,
      isSplitHand: false,
    };
    const dealerHand: Hand = {
      id: 'd1',
      cards: [makeCard('10'), makeCard('9')],
      bet: 0,
      status: 'standing',
      isDoubled: false,
      isSplitHand: false,
    };

    const outcome = evaluateHandOutcome(playerHand, dealerHand);
    expect(outcome.outcome).toBe('surrender');
    expect(outcome.payoutMultiplier).toBe(0.5); // Returns $50
  });
});
