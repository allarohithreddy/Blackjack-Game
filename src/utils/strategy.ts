import { Card, Hand, StrategyAdvice } from '../types/blackjack';
import { BASIC_STRATEGY, DealerUpcardKey } from '../constants/strategyChart';
import { calculateHandScore } from './hand';

function getDealerUpcardKey(card: Card): DealerUpcardKey {
  if (card.rank === 'A') return 'A';
  if (['10', 'J', 'Q', 'K'].includes(card.rank)) return '10';
  return card.rank as DealerUpcardKey;
}

export function getBasicStrategyAdvice(
  playerHand: Hand,
  dealerUpcard: Card | null,
  canDouble: boolean,
  canSplit: boolean,
  canSurrender: boolean
): StrategyAdvice | null {
  if (!dealerUpcard || playerHand.cards.length < 2) {
    return null;
  }

  const dealerKey = getDealerUpcardKey(dealerUpcard);
  const score = calculateHandScore(playerHand.cards);

  if (score.isBust || score.total >= 21) {
    return null;
  }

  // 1. Check Pair Splitting (if exactly 2 cards and can split)
  if (playerHand.cards.length === 2 && canSplit) {
    const r1 = playerHand.cards[0].rank;
    const r2 = playerHand.cards[1].rank;
    const pairRankKey = (r1 === r2) ? r1 : ((playerHand.cards[0].value === 10 && playerHand.cards[1].value === 10) ? '10' : null);

    if (pairRankKey && BASIC_STRATEGY.pairs[pairRankKey]) {
      const pairMove = BASIC_STRATEGY.pairs[pairRankKey][dealerKey];
      if (pairMove === 'P') {
        return {
          action: 'SPLIT',
          explanation: pairRankKey === 'A'
            ? 'Always split Aces! It turns one hand into two chances at 21.'
            : pairRankKey === '8'
            ? 'Always split 8s! A hard 16 is the worst hand in blackjack; splitting gives two fresh hands starting at 8.'
            : `Split pair of ${pairRankKey}s against Dealer's ${dealerKey}.`,
        };
      }
    }
  }

  // 2. Check Soft Hands (Aces counted as 11)
  if (score.isSoft && score.total >= 13 && score.total <= 20) {
    const softMove = BASIC_STRATEGY.soft[score.total]?.[dealerKey];
    if (softMove === 'D') {
      if (canDouble) {
        return {
          action: 'DOUBLE',
          explanation: `Double down on Soft ${score.total} against dealer's vulnerable ${dealerKey}.`,
        };
      } else {
        return {
          action: 'HIT',
          explanation: `Double unavailable. Hit Soft ${score.total} with no risk of busting.`,
        };
      }
    } else if (softMove === 'Ds') {
      if (canDouble) {
        return {
          action: 'DOUBLE',
          explanation: `Double Soft ${score.total} vs dealer ${dealerKey} for high win equity.`,
        };
      } else {
        return {
          action: 'STAND',
          explanation: `Stand on Soft ${score.total} against dealer ${dealerKey}.`,
        };
      }
    } else if (softMove === 'S') {
      return {
        action: 'STAND',
        explanation: `Stand on Soft ${score.total}. You already have a strong holding.`,
      };
    } else {
      return {
        action: 'HIT',
        explanation: `Hit Soft ${score.total}. You cannot bust with an extra card.`,
      };
    }
  }

  // 3. Hard Totals
  const total = score.total;
  if (total <= 8) {
    return {
      action: 'HIT',
      explanation: `Always hit low hard totals (${total}). No risk of busting.`,
    };
  }

  if (total >= 17) {
    return {
      action: 'STAND',
      explanation: `Stand on hard ${total}. High risk of busting if you take another card.`,
    };
  }

  const hardMove = BASIC_STRATEGY.hard[total]?.[dealerKey] || 'H';

  if (hardMove === 'Rh') {
    if (canSurrender) {
      return {
        action: 'SURRENDER',
        explanation: `Surrender hard ${total} vs dealer ${dealerKey} to reclaim 50% of your bet.`,
      };
    } else {
      return {
        action: 'HIT',
        explanation: `Dealer ${dealerKey} is strong; hit hard ${total} to improve odds.`,
      };
    }
  }

  if (hardMove === 'D') {
    if (canDouble) {
      return {
        action: 'DOUBLE',
        explanation: `Double down! You have strong advantage with ${total} vs dealer ${dealerKey}.`,
      };
    } else {
      return {
        action: 'HIT',
        explanation: `Double unavailable. Hit hard ${total} to catch a 10.`,
      };
    }
  }

  if (hardMove === 'S') {
    return {
      action: 'STAND',
      explanation: `Stand on ${total}. Dealer shows ${dealerKey} and has high bust probability.`,
    };
  }

  return {
    action: 'HIT',
    explanation: `Hit hard ${total} against dealer ${dealerKey}.`,
  };
}
