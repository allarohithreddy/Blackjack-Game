# ♠️ Blackjack Pro (Royal Casino)

A production-grade, feature-rich **Blackjack** web application built with **React 18**, **TypeScript**, and **Tailwind CSS**. Designed to assess product thinking, modular code structure, and real-world frontend feature development.

![Blackjack Pro](https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features & Product Highlights

### 1. Realistic Casino Rules & Game Mechanics
- **Standard Casino Payouts**: Natural 21 Blackjack pays **3:2**, regular wins pay **1:1**, insurance pays **2:1**, and late surrender refunds **50%**.
- **Player Actions**:
  - **Hit**: Draw additional cards until 21 or bust.
  - **Stand**: Hold total score and pass turn to the dealer.
  - **Double Down**: Double the wager, draw exactly 1 card, and auto-stand.
  - **Split Pairs**: Split matching ranks or 10-value cards into two playable hands with independent bets and gameplay.
  - **Insurance**: Offered automatically when the dealer's upcard is an Ace; guards against dealer Blackjack.
  - **Surrender**: Forfeit initial 2 cards to preserve 50% of the wager on weak holdings.
- **Configurable Shoe & Penetration**: 1, 2, 4, 6 (Standard), or 8-deck shoe with automatic Fisher-Yates reshuffling when shoe penetration exceeds 75%.
- **Configurable Dealer Rule**: Toggle between standard **S17** (Dealer stands on Soft 17) and **H17** (Dealer hits Soft 17).

### 2. High-Caliber Product Thinking
- **Built-in Basic Strategy Advisor**: Real-time mathematical advisor that calculates and displays the mathematically optimal move (Hit, Stand, Double, Split, Surrender) for the active hand against the dealer's upcard, complete with educational explanations.
- **Interactive Chip Rack**: Realistic casino chip denominations ($5, $25, $50, $100, $500) with quick actions (`Clear Bet`, `2x Bet`, `All-In`, and `Re-Bet & Deal`).
- **Zero-Dependency Web Audio Synthesizer**: Pure Web Audio API sound engine generating authentic chip clinks, card snaps, win chimes, blackjack fanfare, and bust alerts. Fully works offline with volume and mute controls.
- **Celebration Effects**: Confetti bursts on natural Blackjacks and big wins.
- **Local Persistence & ATM Reload**: Bankroll, comprehensive game statistics, session history, and game preferences survive browser refreshes. Bankroll can be reloaded at any time if balance drops low.
- **Keyboard Shortcuts**: Designed for rapid play:
  - `H`: Hit
  - `S`: Stand
  - `D`: Double Down
  - `P`: Split
  - `R`: Surrender
  - `Space`: Deal Hand / Next Hand
  - `C`: Clear Bet

---

## 🏛️ Code Architecture & Clean Structure

```
src/
├── types/
│   └── blackjack.ts         # Strictly typed interfaces (Card, Hand, Phase, Stats, Strategy)
├── constants/
│   ├── rules.ts             # Chip denominations, payouts, bankroll defaults
│   └── strategyChart.ts     # Complete standard Blackjack Basic Strategy matrix
├── utils/
│   ├── deck.ts              # Multi-deck shoe creation, Fisher-Yates shuffle, drawCard
│   ├── hand.ts              # Soft/hard total valuation, blackjack/bust checks, splits
│   ├── sound.ts             # Synthesized pure Web Audio API sound effects
│   ├── strategy.ts          # Optimal decision evaluator & educational advisor
│   └── storage.ts           # LocalStorage persistence helpers with fallback
├── components/
│   ├── Card.tsx             # 3D animated playing cards with custom suits and card back
│   ├── Chip.tsx             # Tactile 3D casino chip component
│   ├── DealerHand.tsx       # Dealer cards display and status badge
│   ├── PlayerHand.tsx       # Active split indicator, badges, and card stack
│   ├── BettingArea.tsx      # Betting spot, chip rack, and betting controls
│   ├── ActionControls.tsx   # Hit, Stand, Double, Split, Surrender, and Insurance dialog
│   ├── StrategyAdvisor.tsx  # Dynamic advice card with educational explanation
│   ├── GameHeader.tsx       # Bankroll, shoe counter, settings, and modal triggers
│   ├── GameBanner.tsx       # Round announcements, win/loss badges, and payout info
│   ├── StatsModal.tsx       # Win rate, net profit, streak, and performance metrics
│   ├── HistoryModal.tsx     # Session hand history breakdown
│   ├── RulesModal.tsx       # House rules, payouts, and keyboard shortcut reference
│   ├── SettingsModal.tsx    # Deck counts, dealer soft 17 toggle, sound & hint toggles
│   └── TableFelt.tsx        # Royal green felt layout with gold table markings
├── hooks/
│   └── useBlackjack.ts      # Core state machine hook coordinating gameplay & turns
├── test/
│   ├── setup.ts             # Vitest DOM configuration
│   ├── hand.test.ts         # Hand calculations, soft Aces, splits, payouts tests
│   ├── deck.test.ts         # Shoe generation and Fisher-Yates shuffle tests
│   ├── strategy.test.ts     # Basic strategy advisor correctness tests
│   └── components.test.tsx  # React component rendering & interaction tests
├── App.tsx                  # Root application view
├── main.tsx                 # Entrypoint
└── index.css                # Tailwind CSS & 3D card transforms
```

---

## 🧪 Testing & Verification

Comprehensive automated test suite covering:
- **Hand Valuation**: Hard totals, Soft totals with Aces switching between 11 and 1, multiple Aces, bust detection, natural 21 identification.
- **Rule Validations**: Split restrictions (rank matching, bankroll check), Double restrictions.
- **Payout Calculations**: 3:2 Natural Blackjack, 1:1 Standard Win, Push, Surrender (50%).
- **Shoe Management**: 52-card decks, 6-deck shoes, Fisher-Yates shuffle randomness.
- **Strategy Advisor**: Accurate moves for hard totals, soft totals, and pair splits against all dealer upcards.
- **Component Tests**: Card rendering (front/back), Chip clicks, BettingArea interaction.

To execute tests:
```bash
npm test
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v22.15)
- npm v9+

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Run test suite
npm test
```

---

## 🎮 Product & Technical Decisions

1. **State Machine Hook (`useBlackjack.ts`)**:
   Instead of spreading turn state across unrelated components, the game uses a deterministic phase state machine (`BETTING` → `DEALING` → `INSURANCE` → `PLAYER_TURN` → `DEALER_TURN` → `ROUND_OVER`), preventing race conditions and illegal card actions.

2. **Split Hand Support**:
   Splitting requires maintaining an array of player hands with an `activeHandIndex`. The hook automatically handles transitioning focus from Hand 1 to Hand 2, adjusting payouts per hand, and applying special Split Ace restrictions.

3. **Pure Web Audio API**:
   Instead of bundling external `.mp3` or `.wav` files that can fail to load or have latency, synthesized audio tones generate instant, lightweight audio responses for chip bets, card flicks, and win fanfares.
