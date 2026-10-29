import { Card, Rank, Suit } from '../types/blackjack';

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function getRankValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

/**
 * Creates a standard 52-card deck
 */
export function createSingleDeck(deckIndex: number = 0): Card[] {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `deck-${deckIndex}-${suit}-${rank}-${Math.random().toString(36).substring(2, 7)}`,
        suit,
        rank,
        value: getRankValue(rank),
        isFaceUp: true,
      });
    }
  }
  return cards;
}

/**
 * Creates a shoe containing `deckCount` decks
 */
export function createShoe(deckCount: number = 6): Card[] {
  let shoe: Card[] = [];
  for (let i = 0; i < deckCount; i++) {
    shoe = shoe.concat(createSingleDeck(i));
  }
  return shuffleDeck(shoe);
}

/**
 * Modern Fisher-Yates shuffle algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draw cards from shoe. If shoe has fewer cards than requested, reshuffle.
 */
export function drawCard(shoe: Card[], faceUp: boolean = true): { card: Card; remainingShoe: Card[] } {
  if (shoe.length === 0) {
    const freshShoe = createShoe(6);
    const card = { ...freshShoe[0], isFaceUp: faceUp };
    return { card, remainingShoe: freshShoe.slice(1) };
  }

  const card = { ...shoe[0], isFaceUp: faceUp };
  return { card, remainingShoe: shoe.slice(1) };
}
