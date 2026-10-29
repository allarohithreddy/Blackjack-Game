import React, { useState } from 'react';
import { useBlackjack } from './hooks/useBlackjack';
import { GameHeader } from './components/GameHeader';
import { TableFelt } from './components/TableFelt';
import { DealerHand } from './components/DealerHand';
import { PlayerHand } from './components/PlayerHand';
import { TableSeat } from './components/TableSeat';
import { BettingArea } from './components/BettingArea';
import { ActionDialog } from './components/ActionDialog';
import { CardCountingHUD } from './components/CardCountingHUD';
import { GameBanner } from './components/GameBanner';
import { StatsModal } from './components/StatsModal';
import { HistoryModal } from './components/HistoryModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { calculateHandScore } from './utils/hand';

export const App: React.FC = () => {
  const bj = useBlackjack();

  // Modals visibility state
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userEmoji, setUserEmoji] = useState('🦁');

  const isPlayerTurn = bj.phase === 'PLAYER_TURN';
  const isDealerTurn = bj.phase === 'DEALER_TURN';
  const isRoundOver = bj.phase === 'ROUND_OVER';
  const isBetting = bj.phase === 'BETTING';
  const isInsurance = bj.phase === 'INSURANCE';

  const activeHand = bj.playerHands[bj.activeHandIndex];
  const activeScore = activeHand ? calculateHandScore(activeHand.cards).displayScore : '0';

  const handleEmojiCycle = () => {
    const emojis = ['🦁', '😎', '🔥', '🎉', '🍀', '🚀'];
    const nextIdx = (emojis.indexOf(userEmoji) + 1) % emojis.length;
    setUserEmoji(emojis[nextIdx]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* HEADER NAVIGATION */}
      <GameHeader
        bankroll={bj.bankroll}
        cardsRemaining={bj.cardsRemaining}
        totalCards={bj.totalCardsInShoe}
        soundEnabled={bj.settings.soundEnabled}
        hintsEnabled={bj.settings.hintsEnabled}
        cardCountingEnabled={bj.settings.cardCountingEnabled}
        onToggleSound={() => bj.updateSettings({ soundEnabled: !bj.settings.soundEnabled })}
        onToggleHints={() => bj.updateSettings({ hintsEnabled: !bj.settings.hintsEnabled })}
        onToggleCardCounting={() =>
          bj.updateSettings({ cardCountingEnabled: !bj.settings.cardCountingEnabled })
        }
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReloadBankroll={bj.resetBankroll}
      />

      {/* CASINO TABLE FELT WITH CLEAN MODERN CASINO AMBIENCE */}
      <TableFelt theme={bj.settings.tableTheme}>
        {/* TOP SECTION: DEALER AVATAR & DEALER HAND */}
        <div className="w-full flex flex-col items-center justify-center pt-1 z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 border-2 border-amber-400/80 flex items-center justify-center text-lg shadow-md">
              🎩
            </div>
            <div className="flex flex-col bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/10">
              <span className="font-casino font-bold text-xs text-amber-300 uppercase tracking-wider">
                Dealer
              </span>
            </div>
          </div>

          <DealerHand
            cards={bj.dealerHand.cards}
            isDealerTurn={isDealerTurn}
            roundOver={isRoundOver}
          />
        </div>

        {/* MIDDLE SECTION: SEATED MULTIPLAYER BOTS (MATCHING REFERENCE IMAGE) */}
        {bj.settings.multiplayerBots && (
          <div className="w-full flex items-center justify-between px-2 sm:px-8 -my-2 pointer-events-none z-10">
            {/* Left Seat (Bee) */}
            <div className="pointer-events-auto">
              <TableSeat
                name={bj.bot1.name}
                avatar={bj.bot1.avatar}
                bankroll={bj.bot1.bankroll}
                bet={bj.bot1.cards.length > 0 ? bj.bot1.currentBet : 0}
                cards={bj.bot1.cards}
                status={bj.bot1.status}
              />
            </div>

            {/* Right Seat (Milo) */}
            <div className="pointer-events-auto">
              <TableSeat
                name={bj.bot2.name}
                avatar={bj.bot2.avatar}
                bankroll={bj.bot2.bankroll}
                bet={bj.bot2.cards.length > 0 ? bj.bot2.currentBet : 0}
                cards={bj.bot2.cards}
                status={bj.bot2.status}
              />
            </div>
          </div>
        )}

        {/* CENTER FLOATING DIALOGS: ACTION DIALOG / BETTING AREA / ROUND BANNER */}
        <div className="w-full flex flex-col items-center justify-center my-auto space-y-2 py-1 z-30">
          {/* Card Counting HUD if enabled */}
          <CardCountingHUD
            runningCount={bj.runningCount}
            cardsRemaining={bj.cardsRemaining}
            enabled={bj.settings.cardCountingEnabled}
          />

          {/* Side Bet Announcement */}
          {bj.sideBetMessage && (
            <div className="bg-purple-950/90 border border-purple-500/80 text-purple-200 px-4 py-1.5 rounded-full text-xs font-black shadow-lg animate-bounce-short">
              ✨ {bj.sideBetMessage}
            </div>
          )}

          {/* FLOATING ACTION CARD (MATCHING REFERENCE IMAGE) */}
          {(isPlayerTurn || isInsurance) && activeHand && (
            <ActionDialog
              onHit={bj.hit}
              onStand={bj.stand}
              onDouble={bj.doubleDown}
              onSplit={bj.split}
              onSurrender={bj.surrender}
              canDouble={bj.canDouble}
              canSplit={bj.canSplit}
              canSurrender={bj.canSurrender}
              isInsuranceOffer={isInsurance}
              insuranceCost={Math.floor(bj.currentBet / 2)}
              onAcceptInsurance={bj.acceptInsurance}
              onDeclineInsurance={bj.declineInsurance}
              currentScore={activeScore}
              currentBet={activeHand.bet}
              strategyHint={bj.settings.hintsEnabled ? bj.currentAdvice?.action : undefined}
            />
          )}

          {/* Round Outcome & Next Hand Action */}
          <GameBanner
            roundOver={isRoundOver}
            roundMessage={bj.roundMessage}
            roundPayout={bj.roundPayout}
            netProfit={bj.roundNetProfit}
            onNextRound={bj.prepareNextRound}
            isReshuffling={bj.isReshuffling}
          />
        </div>

        {/* BOTTOM SECTION: PLAYER SEAT, CARDS & BETTING CONTROLS */}
        <div className="w-full flex flex-col items-center justify-center space-y-3 pb-2 z-20">
          {/* PLAYER SEAT & PROMINENT CARDS */}
          {bj.playerHands.length > 0 ? (
            <div className="flex flex-col items-center space-y-2">
              {/* Human Player Seat Nametag (matching reference) */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-950/80 border-2 border-amber-400 flex items-center justify-center text-xl shadow-lg ring-2 ring-amber-400/30">
                  {userEmoji}
                </div>
                <div className="flex flex-col bg-black/75 px-3 py-1 rounded-xl border border-amber-400/30">
                  <span className="font-bold text-xs text-white">You</span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    ${bj.bankroll.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleEmojiCycle}
                  className="p-1 rounded-lg bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition shadow cursor-pointer"
                  title="Cycle Emoji Avatar"
                >
                  Emoji
                </button>
              </div>

              {/* Player Cards (Single or Split) */}
              <div className="flex items-center justify-center gap-4 flex-wrap max-w-4xl mx-auto w-full px-2">
                {bj.playerHands.map((hand, idx) => (
                  <PlayerHand
                    key={hand.id}
                    hand={hand}
                    isActive={idx === bj.activeHandIndex}
                    handIndex={idx}
                    totalHands={bj.playerHands.length}
                    isPlayerTurn={isPlayerTurn}
                    roundOver={isRoundOver}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* BETTING CONTROLS (ONLY DURING BETTING OR ROUND OVER) */}
          {isBetting && (
            <BettingArea
              currentBet={bj.currentBet}
              sideBet={bj.sideBet}
              bankroll={bj.bankroll}
              lastBet={bj.lastBet}
              onAddChip={bj.addChip}
              onClearBet={bj.clearBet}
              onClearSideBet={bj.clearSideBet}
              onDoubleBet={bj.doubleCurrentBet}
              onAllIn={bj.allInBet}
              onDeal={bj.dealHand}
              onRebetAndDeal={bj.rebetAndDeal}
              isDealing={bj.phase === 'DEALING'}
            />
          )}
        </div>
      </TableFelt>

      {/* MODALS */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={bj.stats}
        onResetStats={bj.resetStats}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={bj.history}
        onClearHistory={bj.clearHistory}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={bj.settings}
        onUpdateSettings={bj.updateSettings}
        onResetBankroll={bj.resetBankroll}
        onReshuffleShoe={bj.reshuffleShoe}
      />
    </div>
  );
};

export default App;
