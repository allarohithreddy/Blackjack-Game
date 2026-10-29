import { GameSettings, GameStats, HandResultHistory } from '../types/blackjack';
import { DEFAULT_INITIAL_BANKROLL } from '../constants/rules';

const STORAGE_KEYS = {
  BANKROLL: 'bj_bankroll',
  STATS: 'bj_stats',
  HISTORY: 'bj_history',
  SETTINGS: 'bj_settings',
};

export const DEFAULT_STATS: GameStats = {
  handsPlayed: 0,
  handsWon: 0,
  handsLost: 0,
  handsPushed: 0,
  blackjacks: 0,
  totalWagered: 0,
  netProfit: 0,
  currentStreak: 0,
  bestWinStreak: 0,
  highestBankroll: DEFAULT_INITIAL_BANKROLL,
};

export const DEFAULT_SETTINGS: GameSettings = {
  deckCount: 6,
  dealerHitsSoft17: false,
  soundEnabled: true,
  soundVolume: 0.6,
  hintsEnabled: true,
  fastDealing: false,
};

export function loadBankroll(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BANKROLL);
    if (saved !== null) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val >= 0) return val;
    }
  } catch (e) {
    console.warn('Failed to load bankroll from storage', e);
  }
  return DEFAULT_INITIAL_BANKROLL;
}

export function saveBankroll(amount: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BANKROLL, amount.toString());
  } catch (e) {
    console.warn('Failed to save bankroll', e);
  }
}

export function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load stats', e);
  }
  return { ...DEFAULT_STATS };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save stats', e);
  }
}

export function loadHistory(): HandResultHistory[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load history', e);
  }
  return [];
}

export function saveHistory(history: HandResultHistory[]): void {
  try {
    // Keep last 30 hands max
    const trimmed = history.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save history', e);
  }
}

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}
