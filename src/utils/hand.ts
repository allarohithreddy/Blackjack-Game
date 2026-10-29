import { Card, Hand } from '../types/blackjack';

export interface HandScore {
  total: number;
  isSoft: boolean;
  isBust: boolean;
  isBlackjack: boolean;
  displayScore: string;
}

/**
 * Calculates score of a set of cards (accounting for soft/hard Ace values)
 */
export function calculateHandScore(cards: Card[]): HandScore {
  // Only score face-up cards
  const visibleCards = cards.filter((c) => c.isFaceUp);
  if (visibleCards.length === 0) {
    return {
      total: 0,
      isSoft: false,
      isBust: false,
      isBlackjack: false,
      displayScore: '0',
    };
  }

  let total = 0;
  let aceCount = 0;

  for (const card of visibleCards) {
    if (card.rank === 'A') {
      aceCount += 1;
      total += 11;
    } else {
      total += card.value;
    }
  }

  // Adjust Aces from 11 to 1 as needed to avoid busting
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount -= 1;
  }

  const isBust = total > 21;
  const isSoft = aceCount > 0 && total <= 21;
  const isBlackjack = visibleCards.length === 2 && cards.length === 2 && total === 21;

  let displayScore = total.toString();
  if (isBlackjack) {
    displayScore = 'Blackjack! 21';
  } else if (isBust) {
    displayScore = `${total} (Bust)`;
  } else if (isSoft && total < 21) {
    // Soft hand display e.g. "Soft 17"
    displayScore = `${total} (Soft)`;
  }

  return {
    total,
    isSoft,
    isBust,
    isBlackjack,
    displayScore,
  };
}

/**
 * Check if the hand can be split (exactly 2 cards of same rank)
 */
export function canSplitHand(hand: Hand, bankroll: number): boolean {
  if (hand.cards.length !== 2) return false;
  if (bankroll < hand.bet) return false;

  const card1 = hand.cards[0];
  const card2 = hand.cards[1];
  // Same rank (e.g. 8 and 8, or K and K) or same 10-value (10, J, Q, K)
  return card1.rank === card2.rank || (card1.value === 10 && card2.value === 10);
}

/**
 * Check if hand can be doubled (2 cards, sufficient bankroll)
 */
export function canDoubleHand(hand: Hand, bankroll: number): boolean {
  return hand.cards.length === 2 && bankroll >= hand.bet;
}

/**
 * Check if hand can be surrendered (initial 2 cards, not already acted upon)
 */
export function canSurrenderHand(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isSplitHand && !hand.isDoubled;
}

/**
 * Evaluate outcome of a player hand against the dealer hand
 */
export function evaluateHandOutcome(
  playerHand: Hand,
  dealerHand: Hand
): { outcome: 'win' | 'loss' | 'push' | 'blackjack' | 'surrender'; payoutMultiplier: number } {
  if (playerHand.status === 'surrendered') {
    return { outcome: 'surrender', payoutMultiplier: 0.5 };
  }

  const playerScore = calculateHandScore(playerHand.cards);
  const dealerScore = calculateHandScore(dealerHand.cards);

  // Player busted
  if (playerScore.isBust) {
    return { outcome: 'loss', payoutMultiplier: 0 };
  }

  // Player has Blackjack
  if (playerScore.isBlackjack) {
    if (dealerScore.isBlackjack) {
      return { outcome: 'push', payoutMultiplier: 1.0 }; // Return original bet
    }
    // Natural Blackjack 3:2 payout (returns original bet + 1.5x = 2.5x original bet)
    return { outcome: 'blackjack', payoutMultiplier: 2.5 };
  }

  // Dealer has Blackjack (and player does not)
  if (dealerScore.isBlackjack) {
    return { outcome: 'loss', payoutMultiplier: 0 };
  }

  // Dealer busted
  if (dealerScore.isBust) {
    return { outcome: 'win', payoutMultiplier: 2.0 }; // Return bet + 1x win
  }

  // Compare scores
  if (playerScore.total > dealerScore.total) {
    return { outcome: 'win', payoutMultiplier: 2.0 };
  } else if (playerScore.total < dealerScore.total) {
    return { outcome: 'loss', payoutMultiplier: 0 };
  } else {
    // Tie
    return { outcome: 'push', payoutMultiplier: 1.0 };
  }
}
