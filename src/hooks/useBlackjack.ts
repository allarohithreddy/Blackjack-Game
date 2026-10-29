import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Card,
  GamePhase,
  GameSettings,
  GameStats,
  Hand,
  HandResultHistory,
  StrategyAdvice,
} from '../types/blackjack';
import {
  createShoe,
  drawCard,
} from '../utils/deck';
import {
  calculateHandScore,
  canDoubleHand,
  canSplitHand,
  canSurrenderHand,
  evaluateHandOutcome,
} from '../utils/hand';
import { getBasicStrategyAdvice } from '../utils/strategy';
import { getCardHiLoValue } from '../utils/cardCounting';
import { evaluatePerfectPairs } from '../utils/sideBets';
import { sound } from '../utils/sound';
import {
  loadBankroll,
  saveBankroll,
  loadStats,
  saveStats,
  loadHistory,
  saveHistory,
  loadSettings,
  saveSettings,
  DEFAULT_STATS,
} from '../utils/storage';
import {
  MIN_BET,
  MAX_BET,
  DEFAULT_INITIAL_BANKROLL,
  RESHUFFLE_PENETRATION_THRESHOLD,
} from '../constants/rules';

export function useBlackjack() {
  // Persistent state
  const [bankroll, setBankroll] = useState<number>(() => loadBankroll());
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [history, setHistory] = useState<HandResultHistory[]>(() => loadHistory());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  // Game state
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [shoe, setShoe] = useState<Card[]>(() => createShoe(settings.deckCount));
  const [totalCardsInShoe, setTotalCardsInShoe] = useState<number>(settings.deckCount * 52);
  const [runningCount, setRunningCount] = useState<number>(0);

  // Betting state
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [lastBet, setLastBet] = useState<number>(0);
  const [sideBet, setSideBet] = useState<number>(0);
  const [lastSideBet, setLastSideBet] = useState<number>(0);
  const [insuranceBet, setInsuranceBet] = useState<number>(0);
  const [sideBetMessage, setSideBetMessage] = useState<string | null>(null);
  const [sideBetProfit, setSideBetProfit] = useState<number>(0);

  // Hands state
  const [playerHands, setPlayerHands] = useState<Hand[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState<number>(0);
  const [dealerHand, setDealerHand] = useState<Hand>({
    id: 'dealer-hand',
    cards: [],
    bet: 0,
    status: 'betting',
    isDoubled: false,
    isSplitHand: false,
  });

  // UI & Settlement notifications
  const [roundMessage, setRoundMessage] = useState<string | null>(null);
  const [roundPayout, setRoundPayout] = useState<number>(0);
  const [roundNetProfit, setRoundNetProfit] = useState<number>(0);
  const [isReshuffling, setIsReshuffling] = useState<boolean>(false);

  // Sync settings with audio engine
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Save changes to storage
  useEffect(() => {
    saveBankroll(bankroll);
  }, [bankroll]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Helper to trigger confetti on big wins
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#eab308', '#22c55e', '#ffffff'],
      });
    } catch {
      // safe fallback if confetti unavailable
    }
  }, []);

  // Check and handle shoe penetration
  const ensureShoeCapacity = useCallback(
    (currentShoe: Card[]) => {
      const threshold = totalCardsInShoe * RESHUFFLE_PENETRATION_THRESHOLD;
      if (currentShoe.length <= threshold) {
        setIsReshuffling(true);
        const newShoe = createShoe(settings.deckCount);
        setTotalCardsInShoe(settings.deckCount * 52);
        setRunningCount(0);
        setTimeout(() => setIsReshuffling(false), 1200);
        return newShoe;
      }
      return currentShoe;
    },
    [totalCardsInShoe, settings.deckCount]
  );

  // Reshuffle shoe explicitly
  const reshuffleShoe = useCallback(() => {
    setIsReshuffling(true);
    const newShoe = createShoe(settings.deckCount);
    setShoe(newShoe);
    setTotalCardsInShoe(settings.deckCount * 52);
    setRunningCount(0);
    setTimeout(() => setIsReshuffling(false), 800);
  }, [settings.deckCount]);

  // Reset Bankroll
  const resetBankroll = useCallback(() => {
    setBankroll(DEFAULT_INITIAL_BANKROLL);
    setCurrentBet(0);
  }, []);

  // Reset Stats
  const resetStats = useCallback(() => {
    const freshStats: GameStats = {
      ...DEFAULT_STATS,
      highestBankroll: bankroll,
    };
    setStats(freshStats);
  }, [bankroll]);

  // Clear History
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Betting Actions
  const addChip = useCallback(
    (chipValue: number, isSideBet: boolean = false) => {
      if (phase !== 'BETTING' && phase !== 'ROUND_OVER') return;
      if (bankroll < chipValue) return;

      if (isSideBet) {
        if (sideBet + chipValue > 250) return;
        sound.playChip();
        setBankroll((prev) => prev - chipValue);
        setSideBet((prev) => prev + chipValue);
      } else {
        if (currentBet + chipValue > MAX_BET) return;
        sound.playChip();
        setBankroll((prev) => prev - chipValue);
        setCurrentBet((prev) => prev + chipValue);
      }
    },
    [phase, bankroll, currentBet, sideBet]
  );

  const clearBet = useCallback(() => {
    if (phase !== 'BETTING' && phase !== 'ROUND_OVER') return;
    if (currentBet === 0) return;

    sound.playClick();
    setBankroll((prev) => prev + currentBet);
    setCurrentBet(0);
  }, [phase, currentBet]);

  const clearSideBet = useCallback(() => {
    if (phase !== 'BETTING' && phase !== 'ROUND_OVER') return;
    if (sideBet === 0) return;

    sound.playClick();
    setBankroll((prev) => prev + sideBet);
    setSideBet(0);
  }, [phase, sideBet]);

  const doubleCurrentBet = useCallback(() => {
    if (phase !== 'BETTING' && phase !== 'ROUND_OVER') return;
    if (currentBet === 0) return;
    if (bankroll < currentBet) return;
    if (currentBet * 2 > MAX_BET) return;

    sound.playChip();
    setBankroll((prev) => prev - currentBet);
    setCurrentBet((prev) => prev * 2);
  }, [phase, currentBet, bankroll]);

  const allInBet = useCallback(() => {
    if (phase !== 'BETTING' && phase !== 'ROUND_OVER') return;
    if (bankroll <= 0) return;

    const betAmount = Math.min(bankroll, MAX_BET - currentBet);
    if (betAmount <= 0) return;

    sound.playChip();
    setBankroll((prev) => prev - betAmount);
    setCurrentBet((prev) => prev + betAmount);
  }, [phase, bankroll, currentBet]);

  // Start round / Next Round transition
  const prepareNextRound = useCallback(() => {
    setPlayerHands([]);
    setDealerHand({
      id: 'dealer-hand',
      cards: [],
      bet: 0,
      status: 'betting',
      isDoubled: false,
      isSplitHand: false,
    });
    setActiveHandIndex(0);
    setInsuranceBet(0);
    setSideBet(0);
    setSideBetMessage(null);
    setRoundMessage(null);
    setRoundPayout(0);
    setRoundNetProfit(0);
    setPhase('BETTING');
  }, []);

  // DEAL CARDS
  const dealHand = useCallback(() => {
    if (currentBet < MIN_BET) return;

    // Transition to DEALING
    setPhase('DEALING');
    setRoundMessage(null);
    setRoundPayout(0);
    setRoundNetProfit(0);
    setLastBet(currentBet);
    setLastSideBet(sideBet);

    // Prepare shoe
    let activeShoe = ensureShoeCapacity(shoe);

    // Deal sequence: Player 1, Dealer 1 (up), Player 2, Dealer 2 (hole card)
    const pCard1 = drawCard(activeShoe, true);
    activeShoe = pCard1.remainingShoe;

    const dCard1 = drawCard(activeShoe, true);
    activeShoe = dCard1.remainingShoe;

    const pCard2 = drawCard(activeShoe, true);
    activeShoe = pCard2.remainingShoe;

    const dCard2 = drawCard(activeShoe, false); // Hole card face-down
    activeShoe = dCard2.remainingShoe;

    setShoe(activeShoe);

    // Update Hi-Lo count for visible dealt cards
    const initialHiLo =
      getCardHiLoValue(pCard1.card) +
      getCardHiLoValue(dCard1.card) +
      getCardHiLoValue(pCard2.card);
    setRunningCount((prev) => prev + initialHiLo);

    // Evaluate Perfect Pairs Side Bet
    if (sideBet > 0) {
      const pairsEval = evaluatePerfectPairs(pCard1.card, pCard2.card);
      if (pairsEval.outcome !== 'loss') {
        const profit = sideBet * pairsEval.multiplier;
        const totalReturn = sideBet + profit;
        setBankroll((prev) => prev + totalReturn);
        setSideBetProfit(profit);
        sound.playWin();
        triggerConfetti();
        setSideBetMessage(`${pairsEval.label} (+${profit})`);
      } else {
        setSideBetProfit(-sideBet);
        setSideBetMessage(null);
      }
    } else {
      setSideBetProfit(0);
      setSideBetMessage(null);
    }

    const initialPlayerCards = [pCard1.card, pCard2.card];
    const initialDealerCards = [dCard1.card, dCard2.card];

    const initialPlayerHand: Hand = {
      id: `hand-player-0`,
      cards: initialPlayerCards,
      bet: currentBet,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };

    const initialDealerHand: Hand = {
      id: 'dealer-hand',
      cards: initialDealerCards,
      bet: 0,
      status: 'playing',
      isDoubled: false,
      isSplitHand: false,
    };

    setPlayerHands([initialPlayerHand]);
    setDealerHand(initialDealerHand);
    setActiveHandIndex(0);

    sound.playCard();

    // Check deal outcomes
    const dealDelay = settings.fastDealing ? 400 : 700;

    setTimeout(() => {
      const dealerUpcard = dCard1.card;
      const playerInitialScore = calculateHandScore(initialPlayerCards);

      // 1. Insurance offer: Dealer upcard is Ace
      if (dealerUpcard.rank === 'A' && bankroll >= Math.floor(currentBet / 2)) {
        setPhase('INSURANCE');
        return;
      }

      // 2. Natural Blackjack check
      if (playerInitialScore.isBlackjack) {
        // Dealer checks hole card
        const dealerFullScore = calculateHandScore([dCard1.card, { ...dCard2.card, isFaceUp: true }]);
        
        // Reveal hole card
        setDealerHand((prev) => ({
          ...prev,
          cards: prev.cards.map((c) => ({ ...c, isFaceUp: true })),
        }));

        if (dealerFullScore.isBlackjack) {
          // Push!
          initialPlayerHand.status = 'push';
          setPlayerHands([initialPlayerHand]);
          settleRound([initialPlayerHand], {
            ...initialDealerHand,
            cards: [{ ...dCard1.card }, { ...dCard2.card, isFaceUp: true }],
          }, 0);
        } else {
          // Player Natural Blackjack win!
          initialPlayerHand.status = 'blackjack';
          setPlayerHands([initialPlayerHand]);
          settleRound([initialPlayerHand], {
            ...initialDealerHand,
            cards: [{ ...dCard1.card }, { ...dCard2.card, isFaceUp: true }],
          }, 0);
        }
        return;
      }

      // 3. Normal play begins
      setPhase('PLAYER_TURN');
    }, dealDelay);
  }, [currentBet, shoe, bankroll, settings.fastDealing, ensureShoeCapacity]);

  // Rebet and immediate Deal
  const rebetAndDeal = useCallback(() => {
    if (lastBet === 0 || bankroll < lastBet) return;
    prepareNextRound();
    setBankroll((prev) => prev - lastBet);
    setCurrentBet(lastBet);
    // Timeout to ensure state settles before deal
    setTimeout(() => {
      dealHand();
    }, 50);
  }, [lastBet, bankroll, prepareNextRound, dealHand]);

  // INSURANCE DECISIONS
  const acceptInsurance = useCallback(() => {
    const cost = Math.floor(currentBet / 2);
    if (bankroll < cost) return;

    sound.playChip();
    setBankroll((prev) => prev - cost);
    setInsuranceBet(cost);

    // Check dealer hole card for blackjack
    const dealerHoleCard = dealerHand.cards[1];
    const isDealerBlackjack = ['10', 'J', 'Q', 'K'].includes(dealerHoleCard.rank);

    if (isDealerBlackjack) {
      // Reveal dealer hole card
      setDealerHand((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, isFaceUp: true })),
      }));

      const playerHand = playerHands[0];
      const playerScore = calculateHandScore(playerHand.cards);

      if (playerScore.isBlackjack) {
        playerHand.status = 'push';
      } else {
        playerHand.status = 'lost';
      }
      setPlayerHands([playerHand]);
      settleRound([playerHand], {
        ...dealerHand,
        cards: dealerHand.cards.map((c) => ({ ...c, isFaceUp: true })),
      }, cost);
    } else {
      // Insurance lost, continue hand
      sound.playClick();
      setPhase('PLAYER_TURN');
    }
  }, [currentBet, bankroll, dealerHand, playerHands]);

  const declineInsurance = useCallback(() => {
    sound.playClick();
    // Check if dealer has blackjack anyway
    const dealerHoleCard = dealerHand.cards[1];
    const isDealerBlackjack = ['10', 'J', 'Q', 'K'].includes(dealerHoleCard.rank);

    if (isDealerBlackjack) {
      setDealerHand((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, isFaceUp: true })),
      }));
      const playerHand = playerHands[0];
      const playerScore = calculateHandScore(playerHand.cards);
      if (playerScore.isBlackjack) {
        playerHand.status = 'push';
      } else {
        playerHand.status = 'lost';
      }
      setPlayerHands([playerHand]);
      settleRound([playerHand], {
        ...dealerHand,
        cards: dealerHand.cards.map((c) => ({ ...c, isFaceUp: true })),
      }, 0);
    } else {
      setPhase('PLAYER_TURN');
    }
  }, [dealerHand, playerHands]);

  // ROUND SETTLEMENT & STATS RECORDING
  const settleRound = useCallback(
    (finalPlayerHands: Hand[], finalDealerHand: Hand, insBet: number) => {
      setPhase('ROUND_OVER');

      let totalPayout = 0;
      let totalWagered = insBet;
      let netProfit = -insBet;
      let handsWonCount = 0;
      let handsLostCount = 0;
      let handsPushedCount = 0;
      let blackjacksCount = 0;
      let outcomeResult: 'win' | 'loss' | 'push' | 'blackjack' | 'surrender' = 'loss';

      const updatedHands: Hand[] = [];

      for (const hand of finalPlayerHands) {
        totalWagered += hand.bet;
        const evaluation = evaluateHandOutcome(hand, finalDealerHand);
        const handPayout = Math.floor(hand.bet * evaluation.payoutMultiplier);
        totalPayout += handPayout;

        let status = hand.status;
        if (hand.status !== 'surrendered') {
          if (evaluation.outcome === 'blackjack') {
            status = 'blackjack';
            handsWonCount++;
            blackjacksCount++;
            outcomeResult = 'blackjack';
          } else if (evaluation.outcome === 'win') {
            status = hand.isDoubled ? 'double_won' : 'won';
            handsWonCount++;
            if (outcomeResult !== 'blackjack') outcomeResult = 'win';
          } else if (evaluation.outcome === 'push') {
            status = hand.isDoubled ? 'double_push' : 'push';
            handsPushedCount++;
            if (outcomeResult !== 'blackjack' && outcomeResult !== 'win') outcomeResult = 'push';
          } else {
            status = hand.isDoubled ? 'double_lost' : 'lost';
            handsLostCount++;
          }
        } else {
          outcomeResult = 'surrender';
        }

        updatedHands.push({ ...hand, status });
      }

      // Insurance payout (2:1 if dealer had blackjack)
      const dealerScore = calculateHandScore(finalDealerHand.cards);
      if (insBet > 0 && dealerScore.isBlackjack) {
        const insurancePayout = insBet * 3; // return insBet + 2x insBet
        totalPayout += insurancePayout;
      }

      netProfit = totalPayout - totalWagered;

      setPlayerHands(updatedHands);
      setBankroll((prev) => prev + totalPayout);
      setRoundPayout(totalPayout);
      setRoundNetProfit(netProfit);

      // Play outcome audio
      if (outcomeResult === 'blackjack') {
        sound.playBlackjack();
        triggerConfetti();
        setRoundMessage('Blackjack! Pays 3 to 2');
      } else if (netProfit > 0) {
        sound.playWin();
        if (netProfit >= 200) triggerConfetti();
        setRoundMessage(`You Won! (+$${netProfit})`);
      } else if (netProfit === 0 && totalPayout > 0) {
        sound.playPush();
        setRoundMessage('Push - Bets Returned');
      } else {
        sound.playBust();
        setRoundMessage('Dealer Wins');
      }

      // Update statistics
      setStats((prev) => {
        const newProfit = prev.netProfit + netProfit;
        const isOverallWin = netProfit > 0;
        const currentStreak = isOverallWin ? prev.currentStreak + 1 : 0;
        const bestWinStreak = Math.max(prev.bestWinStreak, currentStreak);
        const newBankroll = bankroll + totalPayout;
        const highestBankroll = Math.max(prev.highestBankroll, newBankroll);

        return {
          handsPlayed: prev.handsPlayed + 1,
          handsWon: prev.handsWon + handsWonCount,
          handsLost: prev.handsLost + handsLostCount,
          handsPushed: prev.handsPushed + handsPushedCount,
          blackjacks: prev.blackjacks + blackjacksCount,
          totalWagered: prev.totalWagered + totalWagered,
          netProfit: newProfit,
          currentStreak,
          bestWinStreak,
          highestBankroll,
        };
      });

      // Record Hand History
      const pScore = calculateHandScore(updatedHands[0]?.cards || []).total;
      const dScore = calculateHandScore(finalDealerHand.cards).total;

      const historyEntry: HandResultHistory = {
        id: `hand-${Date.now()}`,
        timestamp: Date.now(),
        bet: totalWagered,
        payout: totalPayout,
        profit: netProfit,
        playerScore: pScore,
        dealerScore: dScore,
        playerOutcome: outcomeResult,
        playerHandsCount: updatedHands.length,
        playerCards: updatedHands[0]?.cards || [],
        dealerCards: finalDealerHand.cards || [],
        sideBet: sideBet,
        sideBetProfit: sideBetProfit,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 29)]);
    },
    [bankroll, sideBet, sideBetProfit, triggerConfetti]
  );

  // DEALER TURN EXECUTION
  const executeDealerTurn = useCallback(
    (currentHands: Hand[]) => {
      setPhase('DEALER_TURN');

      // First, reveal the dealer's hidden hole card and add to count
      const holeCard = dealerHand.cards.find((c) => !c.isFaceUp);
      if (holeCard) {
        setRunningCount((prev) => prev + getCardHiLoValue(holeCard));
      }

      let revealedCards = dealerHand.cards.map((c) => ({ ...c, isFaceUp: true }));
      let activeShoe = [...shoe];

      setDealerHand((prev) => ({
        ...prev,
        cards: revealedCards,
      }));

      sound.playCard();

      // Check if all player hands busted or surrendered; if so dealer doesn't need to draw
      const allBustedOrSurrendered = currentHands.every(
        (h) => calculateHandScore(h.cards).isBust || h.status === 'surrendered'
      );

      if (allBustedOrSurrendered) {
        setTimeout(() => {
          settleRound(currentHands, { ...dealerHand, cards: revealedCards }, insuranceBet);
        }, 500);
        return;
      }

      // Dealer drawing loop with intervals
      const drawDelay = settings.fastDealing ? 350 : 650;

      const dealerDrawInterval = setInterval(() => {
        const score = calculateHandScore(revealedCards);

        // Check dealer stand rules:
        // Stand on 17+ (or hit soft 17 if dealerHitsSoft17 is enabled)
        const shouldHit =
          score.total < 17 || (settings.dealerHitsSoft17 && score.isSoft && score.total === 17);

        if (shouldHit && !score.isBust) {
          const drawn = drawCard(activeShoe, true);
          activeShoe = drawn.remainingShoe;
          revealedCards = [...revealedCards, drawn.card];

          setShoe(activeShoe);
          setRunningCount((prev) => prev + getCardHiLoValue(drawn.card));
          setDealerHand((prev) => ({
            ...prev,
            cards: revealedCards,
          }));
          sound.playCard();
        } else {
          // Dealer done
          clearInterval(dealerDrawInterval);
          setTimeout(() => {
            settleRound(currentHands, { ...dealerHand, cards: revealedCards }, insuranceBet);
          }, 450);
        }
      }, drawDelay);
    },
    [dealerHand, shoe, settings.dealerHitsSoft17, settings.fastDealing, insuranceBet, settleRound]
  );

  // Advance to next split hand or dealer turn
  const advanceTurn = useCallback(
    (updatedHands: Hand[]) => {
      const nextIndex = activeHandIndex + 1;
      if (nextIndex < updatedHands.length) {
        setActiveHandIndex(nextIndex);
      } else {
        executeDealerTurn(updatedHands);
      }
    },
    [activeHandIndex, executeDealerTurn]
  );

  // PLAYER ACTION: HIT
  const hit = useCallback(() => {
    if (phase !== 'PLAYER_TURN') return;
    const currentHand = playerHands[activeHandIndex];
    if (!currentHand) return;

    let activeShoe = ensureShoeCapacity(shoe);
    const drawn = drawCard(activeShoe, true);
    activeShoe = drawn.remainingShoe;
    setShoe(activeShoe);
    setRunningCount((prev) => prev + getCardHiLoValue(drawn.card));

    const newCards = [...currentHand.cards, drawn.card];
    const newScore = calculateHandScore(newCards);

    sound.playCard();

    const updatedHand: Hand = {
      ...currentHand,
      cards: newCards,
      status: newScore.isBust ? 'busted' : 'playing',
    };

    const updatedHands = playerHands.map((h, i) => (i === activeHandIndex ? updatedHand : h));
    setPlayerHands(updatedHands);

    if (newScore.isBust) {
      sound.playBust();
      // Delay slightly before advancing
      setTimeout(() => {
        advanceTurn(updatedHands);
      }, 500);
    } else if (newScore.total === 21) {
      // Automatically stand on 21
      setTimeout(() => {
        advanceTurn(updatedHands);
      }, 500);
    }
  }, [phase, playerHands, activeHandIndex, shoe, ensureShoeCapacity, advanceTurn]);

  // PLAYER ACTION: STAND
  const stand = useCallback(() => {
    if (phase !== 'PLAYER_TURN') return;
    const currentHand = playerHands[activeHandIndex];
    if (!currentHand) return;

    sound.playClick();

    const updatedHand: Hand = {
      ...currentHand,
      status: 'standing',
    };

    const updatedHands = playerHands.map((h, i) => (i === activeHandIndex ? updatedHand : h));
    setPlayerHands(updatedHands);

    advanceTurn(updatedHands);
  }, [phase, playerHands, activeHandIndex, advanceTurn]);

  // PLAYER ACTION: DOUBLE DOWN
  const doubleDown = useCallback(() => {
    if (phase !== 'PLAYER_TURN') return;
    const currentHand = playerHands[activeHandIndex];
    if (!currentHand || !canDoubleHand(currentHand, bankroll)) return;

    // Deduct double bet
    sound.playChip();
    setBankroll((prev) => prev - currentHand.bet);

    let activeShoe = ensureShoeCapacity(shoe);
    const drawn = drawCard(activeShoe, true);
    activeShoe = drawn.remainingShoe;
    setShoe(activeShoe);
    setRunningCount((prev) => prev + getCardHiLoValue(drawn.card));

    const newCards = [...currentHand.cards, drawn.card];
    const newScore = calculateHandScore(newCards);

    sound.playCard();

    const updatedHand: Hand = {
      ...currentHand,
      cards: newCards,
      bet: currentHand.bet * 2,
      isDoubled: true,
      status: newScore.isBust ? 'busted' : 'standing',
    };

    const updatedHands = playerHands.map((h, i) => (i === activeHandIndex ? updatedHand : h));
    setPlayerHands(updatedHands);

    if (newScore.isBust) {
      sound.playBust();
    }

    // Double receives exactly one card and then automatically stands
    setTimeout(() => {
      advanceTurn(updatedHands);
    }, 600);
  }, [phase, playerHands, activeHandIndex, bankroll, shoe, ensureShoeCapacity, advanceTurn]);

  // PLAYER ACTION: SPLIT
  const split = useCallback(() => {
    if (phase !== 'PLAYER_TURN') return;
    const currentHand = playerHands[activeHandIndex];
    if (!currentHand || !canSplitHand(currentHand, bankroll)) return;

    sound.playChip();
    // Deduct matching bet
    setBankroll((prev) => prev - currentHand.bet);

    let activeShoe = ensureShoeCapacity(shoe);

    // Card for hand 1
    const cardForH1 = drawCard(activeShoe, true);
    activeShoe = cardForH1.remainingShoe;

    // Card for hand 2
    const cardForH2 = drawCard(activeShoe, true);
    activeShoe = cardForH2.remainingShoe;

    setShoe(activeShoe);
    setRunningCount((prev) => prev + getCardHiLoValue(cardForH1.card) + getCardHiLoValue(cardForH2.card));

    const isSplitAces = currentHand.cards[0].rank === 'A';

    const hand1: Hand = {
      id: `hand-player-0-split`,
      cards: [currentHand.cards[0], cardForH1.card],
      bet: currentHand.bet,
      status: isSplitAces ? 'standing' : 'playing',
      isDoubled: false,
      isSplitHand: true,
    };

    const hand2: Hand = {
      id: `hand-player-1-split`,
      cards: [currentHand.cards[1], cardForH2.card],
      bet: currentHand.bet,
      status: isSplitAces ? 'standing' : 'playing',
      isDoubled: false,
      isSplitHand: true,
    };

    sound.playCard();

    const newPlayerHands = [hand1, hand2];
    setPlayerHands(newPlayerHands);

    // Special rule: Split Aces receive 1 card each and then auto-stand!
    if (isSplitAces) {
      setTimeout(() => {
        executeDealerTurn(newPlayerHands);
      }, 700);
    }
  }, [phase, playerHands, activeHandIndex, bankroll, shoe, ensureShoeCapacity, executeDealerTurn]);

  // PLAYER ACTION: SURRENDER
  const surrender = useCallback(() => {
    if (phase !== 'PLAYER_TURN') return;
    const currentHand = playerHands[activeHandIndex];
    if (!currentHand || !canSurrenderHand(currentHand)) return;

    sound.playClick();

    const updatedHand: Hand = {
      ...currentHand,
      status: 'surrendered',
    };

    const updatedHands = playerHands.map((h, i) => (i === activeHandIndex ? updatedHand : h));
    setPlayerHands(updatedHands);

    // Reveal dealer hole card
    setDealerHand((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => ({ ...c, isFaceUp: true })),
    }));

    settleRound(updatedHands, dealerHand, insuranceBet);
  }, [phase, playerHands, activeHandIndex, dealerHand, insuranceBet, settleRound]);

  // Basic Strategy Advisor Calculation
  const activeHand = playerHands[activeHandIndex] || null;
  const dealerUpcard = dealerHand.cards.find((c) => c.isFaceUp) || null;

  const currentAdvice: StrategyAdvice | null =
    phase === 'PLAYER_TURN' && activeHand && dealerUpcard
      ? getBasicStrategyAdvice(
          activeHand,
          dealerUpcard,
          canDoubleHand(activeHand, bankroll),
          canSplitHand(activeHand, bankroll),
          canSurrenderHand(activeHand)
        )
      : null;

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys if typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (phase === 'BETTING' || phase === 'ROUND_OVER') {
        if (e.code === 'Space') {
          e.preventDefault();
          if (phase === 'ROUND_OVER') {
            prepareNextRound();
          } else if (currentBet >= MIN_BET) {
            dealHand();
          }
        } else if (key === 'c') {
          clearBet();
        }
      } else if (phase === 'PLAYER_TURN') {
        if (key === 'h') {
          e.preventDefault();
          hit();
        } else if (key === 's') {
          e.preventDefault();
          stand();
        } else if (key === 'd') {
          e.preventDefault();
          if (activeHand && canDoubleHand(activeHand, bankroll)) {
            doubleDown();
          }
        } else if (key === 'p') {
          e.preventDefault();
          if (activeHand && canSplitHand(activeHand, bankroll)) {
            split();
          }
        } else if (key === 'r') {
          e.preventDefault();
          if (activeHand && canSurrenderHand(activeHand)) {
            surrender();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    phase,
    currentBet,
    activeHand,
    bankroll,
    hit,
    stand,
    doubleDown,
    split,
    surrender,
    dealHand,
    clearBet,
    prepareNextRound,
  ]);

  return {
    // State
    bankroll,
    stats,
    history,
    settings,
    phase,
    cardsRemaining: shoe.length,
    totalCardsInShoe,
    currentBet,
    lastBet,
    sideBet,
    lastSideBet,
    sideBetMessage,
    sideBetProfit,
    insuranceBet,
    runningCount,
    playerHands,
    activeHandIndex,
    dealerHand,
    roundMessage,
    roundPayout,
    roundNetProfit,
    isReshuffling,
    currentAdvice,

    // Permissions
    canDouble: activeHand ? canDoubleHand(activeHand, bankroll) : false,
    canSplit: activeHand ? canSplitHand(activeHand, bankroll) : false,
    canSurrender: activeHand ? canSurrenderHand(activeHand) : false,

    // Actions
    addChip,
    clearBet,
    clearSideBet,
    doubleCurrentBet,
    allInBet,
    dealHand,
    rebetAndDeal,
    prepareNextRound,
    hit,
    stand,
    doubleDown,
    split,
    surrender,
    acceptInsurance,
    declineInsurance,
    reshuffleShoe,
    resetBankroll,
    resetStats,
    clearHistory,
    updateSettings,
  };
}
