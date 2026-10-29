import { Card } from '../types/blackjack';

/**
 * Hi-Lo Card Counting System
 * 2, 3, 4, 5, 6 -> +1
 * 7, 8, 9       -> 0
 * 10, J, Q, K, A -> -1
 */
export function getCardHiLoValue(card: Card): number {
  if (['2', '3', '4', '5', '6'].includes(card.rank)) {
    return 1;
  }
  if (['7', '8', '9'].includes(card.rank)) {
    return 0;
  }
  return -1; // '10', 'J', 'Q', 'K', 'A'
}

/**
 * Calculate True Count = Running Count / Decks remaining
 */
export function calculateTrueCount(runningCount: number, cardsRemaining: number): number {
  const decksRemaining = Math.max(0.5, cardsRemaining / 52);
  const rawTrueCount = runningCount / decksRemaining;
  return Math.round(rawTrueCount * 10) / 10;
}

export interface CountAnalysis {
  runningCount: number;
  trueCount: number;
  advantage: 'hot' | 'neutral' | 'cold';
  label: string;
  advice: string;
}

export function analyzeCount(runningCount: number, cardsRemaining: number): CountAnalysis {
  const trueCount = calculateTrueCount(runningCount, cardsRemaining);

  if (trueCount >= 2.0) {
    return {
      runningCount,
      trueCount,
      advantage: 'hot',
      label: 'Deck is Hot 🔥',
      advice: 'High concentration of 10s and Aces remains. High player advantage — consider increasing bet size!',
    };
  } else if (trueCount <= -1.5) {
    return {
      runningCount,
      trueCount,
      advantage: 'cold',
      label: 'Deck is Cold ❄️',
      advice: 'Many high cards have been dealt. House has higher edge — stick to minimum bets.',
    };
  } else {
    return {
      runningCount,
      trueCount,
      advantage: 'neutral',
      label: 'Neutral Count ⚖️',
      advice: 'Standard house edge. Play base unit bet.',
    };
  }
}
