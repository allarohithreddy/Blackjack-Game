import React, { useState } from 'react';
import { useBlackjack } from './hooks/useBlackjack';
import { GameHeader } from './components/GameHeader';
import { TableFelt } from './components/TableFelt';
import { DealerHand } from './components/DealerHand';
import { PlayerHand } from './components/PlayerHand';
import { BettingArea } from './components/BettingArea';
import { ActionControls } from './components/ActionControls';
import { StrategyAdvisor } from './components/StrategyAdvisor';
import { GameBanner } from './components/GameBanner';
import { StatsModal } from './components/StatsModal';
import { HistoryModal } from './components/HistoryModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const bj = useBlackjack();

  // Modals visibility state
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isPlayerTurn = bj.phase === 'PLAYER_TURN';
  const isDealerTurn = bj.phase === 'DEALER_TURN';
  const isRoundOver = bj.phase === 'ROUND_OVER';
  const isBetting = bj.phase === 'BETTING';
  const isInsurance = bj.phase === 'INSURANCE';

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* HEADER NAVIGATION */}
      <GameHeader
        bankroll={bj.bankroll}
        cardsRemaining={bj.cardsRemaining}
        totalCards={bj.totalCardsInShoe}
        soundEnabled={bj.settings.soundEnabled}
        hintsEnabled={bj.settings.hintsEnabled}
        onToggleSound={() => bj.updateSettings({ soundEnabled: !bj.settings.soundEnabled })}
        onToggleHints={() => bj.updateSettings({ hintsEnabled: !bj.settings.hintsEnabled })}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReloadBankroll={bj.resetBankroll}
      />

      {/* CASINO TABLE FELT */}
      <TableFelt>
        {/* TOP SECTION: DEALER HAND */}
        <div className="w-full flex justify-center py-2">
          {bj.dealerHand.cards.length > 0 ? (
            <DealerHand
              cards={bj.dealerHand.cards}
              isDealerTurn={isDealerTurn}
              roundOver={isRoundOver}
            />
          ) : (
            <div className="h-[120px] sm:h-[150px] flex items-center justify-center">
              <span className="font-casino text-xs sm:text-sm tracking-widest text-slate-400/40 uppercase font-bold">
                Dealer Area
              </span>
            </div>
          )}
        </div>

        {/* MIDDLE SECTION: STRATEGY ADVICE, ROUND BANNER, ANNOUNCEMENTS */}
        <div className="w-full flex flex-col items-center justify-center my-auto space-y-3 py-2 z-20">
          <StrategyAdvisor
            advice={bj.currentAdvice}
            enabled={bj.settings.hintsEnabled}
          />

          <GameBanner
            roundOver={isRoundOver}
            roundMessage={bj.roundMessage}
            roundPayout={bj.roundPayout}
            netProfit={bj.roundNetProfit}
            onNextRound={bj.prepareNextRound}
            isReshuffling={bj.isReshuffling}
          />
        </div>

        {/* BOTTOM SECTION: PLAYER HANDS & ACTION CONTROLS OR BETTING AREA */}
        <div className="w-full flex flex-col items-center justify-center space-y-4 pb-4">
          {/* PLAYER CARDS DISPLAY */}
          {bj.playerHands.length > 0 && (
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
          )}

          {/* DYNAMIC ACTION AREA */}
          {isBetting ? (
            <BettingArea
              currentBet={bj.currentBet}
              bankroll={bj.bankroll}
              lastBet={bj.lastBet}
              onAddChip={bj.addChip}
              onClearBet={bj.clearBet}
              onDoubleBet={bj.doubleCurrentBet}
              onAllIn={bj.allInBet}
              onDeal={bj.dealHand}
              onRebetAndDeal={bj.rebetAndDeal}
              isDealing={bj.phase === 'DEALING'}
            />
          ) : (
            <div className="w-full flex justify-center">
              <ActionControls
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
                disabled={!isPlayerTurn && !isInsurance}
              />
            </div>
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
