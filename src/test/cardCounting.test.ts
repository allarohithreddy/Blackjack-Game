import { describe, it, expect } from 'vitest';
import { getCardHiLoValue, calculateTrueCount, analyzeCount } from '../utils/cardCounting';
import { Card } from '../types/blackjack';

function makeCard(rank: Card['rank'], suit: Card['suit'] = 'spades'): Card {
  let val = 10;
  if (rank === 'A') val = 11;
  else if (['J', 'Q', 'K'].includes(rank)) val = 10;
  else val = parseInt(rank, 10);

  return { id: `test-${rank}`, rank, suit, value: val, isFaceUp: true };
}

describe('Hi-Lo Card Counting System', () => {
  it('assigns +1 to low cards (2 through 6)', () => {
    expect(getCardHiLoValue(makeCard('2'))).toBe(1);
    expect(getCardHiLoValue(makeCard('3'))).toBe(1);
    expect(getCardHiLoValue(makeCard('4'))).toBe(1);
    expect(getCardHiLoValue(makeCard('5'))).toBe(1);
    expect(getCardHiLoValue(makeCard('6'))).toBe(1);
  });

  it('assigns 0 to neutral cards (7, 8, 9)', () => {
    expect(getCardHiLoValue(makeCard('7'))).toBe(0);
    expect(getCardHiLoValue(makeCard('8'))).toBe(0);
    expect(getCardHiLoValue(makeCard('9'))).toBe(0);
  });

  it('assigns -1 to high cards (10, J, Q, K, A)', () => {
    expect(getCardHiLoValue(makeCard('10'))).toBe(-1);
    expect(getCardHiLoValue(makeCard('J'))).toBe(-1);
    expect(getCardHiLoValue(makeCard('Q'))).toBe(-1);
    expect(getCardHiLoValue(makeCard('K'))).toBe(-1);
    expect(getCardHiLoValue(makeCard('A'))).toBe(-1);
  });

  it('computes True Count by dividing Running Count by remaining decks', () => {
    // 208 cards left = 4 decks remaining. RC = +8 -> TC = +2.0
    expect(calculateTrueCount(8, 208)).toBe(2.0);
    // 104 cards left = 2 decks. RC = -3 -> TC = -1.5
    expect(calculateTrueCount(-3, 104)).toBe(-1.5);
  });

  it('accurately classifies Hot, Cold, and Neutral deck states', () => {
    const hotAnalysis = analyzeCount(8, 208); // TC = +2.0
    expect(hotAnalysis.advantage).toBe('hot');

    const coldAnalysis = analyzeCount(-6, 208); // TC = -1.5
    expect(coldAnalysis.advantage).toBe('cold');

    const neutralAnalysis = analyzeCount(1, 208); // TC = +0.3
    expect(neutralAnalysis.advantage).toBe('neutral');
  });
});
