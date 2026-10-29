import { describe, it, expect } from 'vitest';
import { createSingleDeck, createShoe, shuffleDeck, drawCard } from '../utils/deck';

describe('Deck and Shoe Management', () => {
  it('creates a standard 52-card deck', () => {
    const deck = createSingleDeck();
    expect(deck).toHaveLength(52);

    const suits = new Set(deck.map((c) => c.suit));
    expect(suits.size).toBe(4);

    const ranks = new Set(deck.map((c) => c.rank));
    expect(ranks.size).toBe(13);
  });

  it('creates a 6-deck shoe with 312 cards', () => {
    const shoe = createShoe(6);
    expect(shoe).toHaveLength(312);
  });

  it('shuffles cards effectively with Fisher-Yates', () => {
    const original = createSingleDeck();
    const shuffled = shuffleDeck(original);

    expect(shuffled).toHaveLength(52);
    // Highly improbable to maintain exact order after shuffle
    const matches = original.filter((card, idx) => card.id === shuffled[idx].id);
    expect(matches.length).toBeLessThan(10);
  });

  it('draws cards properly and reduces shoe count', () => {
    const shoe = createShoe(2); // 104 cards
    const { card, remainingShoe } = drawCard(shoe, true);

    expect(card).toBeDefined();
    expect(card.isFaceUp).toBe(true);
    expect(remainingShoe).toHaveLength(103);
  });
});
