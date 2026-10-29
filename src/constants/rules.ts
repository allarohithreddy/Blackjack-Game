export const DEFAULT_INITIAL_BANKROLL = 1000;
export const MIN_BET = 5;
export const MAX_BET = 2500;

export const CHIP_VALUES = [5, 25, 50, 100, 500] as const;

export const CHIP_COLORS: Record<number, { bg: string; border: string; text: string; ring: string }> = {
  5: {
    bg: 'bg-red-600',
    border: 'border-red-400',
    text: 'text-white',
    ring: 'border-dashed border-red-300',
  },
  25: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-400',
    text: 'text-white',
    ring: 'border-dashed border-emerald-300',
  },
  50: {
    bg: 'bg-blue-600',
    border: 'border-blue-400',
    text: 'text-white',
    ring: 'border-dashed border-blue-300',
  },
  100: {
    bg: 'bg-zinc-900',
    border: 'border-amber-400',
    text: 'text-amber-400',
    ring: 'border-dashed border-amber-300',
  },
  500: {
    bg: 'bg-purple-800',
    border: 'border-purple-400',
    text: 'text-white',
    ring: 'border-dashed border-purple-300',
  },
};

export const PAYOUT_RATIOS = {
  BLACKJACK: 1.5,     // 3:2 payout (returns bet + 1.5 * bet = 2.5 * bet)
  STANDARD_WIN: 1.0,  // 1:1 payout (returns bet + 1.0 * bet = 2.0 * bet)
  INSURANCE: 2.0,     // 2:1 payout on insurance bet
  SURRENDER: 0.5,     // Returns 0.5 * bet
};

export const RESHUFFLE_PENETRATION_THRESHOLD = 0.25; // Reshuffle when shoe <= 25% cards
