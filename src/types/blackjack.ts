export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // 2-10, 10 for J/Q/K, 11 for Ace initially
  isFaceUp: boolean;
}

export type HandStatus =
  | 'betting'
  | 'playing'
  | 'standing'
  | 'busted'
  | 'blackjack'
  | 'surrendered'
  | 'push'
  | 'won'
  | 'lost'
  | 'double_won'
  | 'double_lost'
  | 'double_push';

export interface Hand {
  id: string;
  cards: Card[];
  bet: number;
  status: HandStatus;
  isDoubled: boolean;
  isSplitHand: boolean;
}

export interface TablePlayer {
  id: string;
  name: string;
  avatar: string;
  bankroll: number;
  currentBet: number;
  cards: Card[];
  status: HandStatus;
  isTurn: boolean;
}

export type GamePhase =
  | 'BETTING'        // Placing bets
  | 'DEALING'        // Initial card deal animation
  | 'BOT1_TURN'      // Seat 1 plays
  | 'PLAYER_TURN'    // Human player makes decisions
  | 'BOT2_TURN'      // Seat 2 plays
  | 'INSURANCE'      // Dealer shows Ace, player chooses insurance
  | 'DEALER_TURN'    // Dealer reveals hole card and draws to >=17
  | 'ROUND_OVER';    // Results evaluated, ready for next round

export type StrategyAction = 'H' | 'S' | 'D' | 'Ds' | 'P' | 'Rh';

export interface StrategyAdvice {
  action: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';
  explanation: string;
}

export type SideBetOutcome = 'perfect_pair' | 'colored_pair' | 'mixed_pair' | 'loss' | null;

export interface HandResultHistory {
  id: string;
  timestamp: number;
  bet: number;
  payout: number;
  profit: number;
  playerScore: number;
  dealerScore: number;
  playerOutcome: 'win' | 'loss' | 'push' | 'blackjack' | 'surrender';
  playerHandsCount: number;
  playerCards: Card[];
  dealerCards: Card[];
  sideBet?: number;
  sideBetProfit?: number;
}

export interface GameStats {
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsPushed: number;
  blackjacks: number;
  totalWagered: number;
  netProfit: number;
  currentStreak: number;
  bestWinStreak: number;
  highestBankroll: number;
}

export type TableTheme = 'emerald' | 'royal-blue' | 'burgundy' | 'midnight';

export interface GameSettings {
  deckCount: number; // 1, 2, 4, 6, 8
  dealerHitsSoft17: boolean; // default false (dealer stands on soft 17)
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  hintsEnabled: boolean; // Basic strategy advisor
  cardCountingEnabled: boolean; // Hi-Lo card counting HUD
  tableTheme: TableTheme; // Table felt color
  fastDealing: boolean;
  multiplayerBots: boolean; // Enable AI players seated at table (like reference)
}
