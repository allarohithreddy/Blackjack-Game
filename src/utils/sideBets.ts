import { Card, SideBetOutcome } from '../types/blackjack';

export interface PerfectPairsEvaluation {
  outcome: SideBetOutcome;
  multiplier: number; // Returns net win multiplier (e.g., 25 for 25:1)
  label: string;
}

export function evaluatePerfectPairs(card1: Card, card2: Card): PerfectPairsEvaluation {
  // Must be same rank
  if (card1.rank !== card2.rank) {
    return { outcome: 'loss', multiplier: 0, label: 'No Pair' };
  }

  // Same suit: Perfect Pair (25:1)
  if (card1.suit === card2.suit) {
    return {
      outcome: 'perfect_pair',
      multiplier: 25,
      label: 'Perfect Pair! (Pays 25:1)',
    };
  }

  const isCard1Red = card1.suit === 'hearts' || card1.suit === 'diamonds';
  const isCard2Red = card2.suit === 'hearts' || card2.suit === 'diamonds';

  // Same color (both red or both black): Colored Pair (12:1)
  if (isCard1Red === isCard2Red) {
    return {
      outcome: 'colored_pair',
      multiplier: 12,
      label: 'Colored Pair! (Pays 12:1)',
    };
  }

  // Different color (one red, one black): Mixed Pair (6:1)
  return {
    outcome: 'mixed_pair',
    multiplier: 6,
    label: 'Mixed Pair! (Pays 6:1)',
  };
}
