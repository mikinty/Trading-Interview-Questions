import { useState, useEffect } from 'react';
import { GameLayout } from '@components/layout/GameLayout';
import { Button } from '@components/ui/Button';
import { Card as UICard } from '@components/ui/Card';
import { GameStats } from '@components/game/GameStats';
import { ActionHistory } from '@components/game/ActionHistory';
import { DifficultySelect } from '@components/game/DifficultySelect';
import { ScoreBoard } from '@components/game/ScoreBoard';
import { useDifficulty } from '@hooks/useDifficulty';
import { useScoreHistory } from '@hooks/useScoreHistory';
import { Difficulty } from '@/types/game.types';

enum GamePhase {
  Betting = 'betting',
  Rolling = 'rolling',
  Result = 'result',
}

interface BetOption {
  id: string;
  label: string;
  probability: number; // True probability (0-1)
  payout: number; // Current payout multiplier
  category: 'sum' | 'parity' | 'die';
}

const BET_INCREMENT = 100;
const STARTING_CASH = 10000;

// Calculate true probabilities
const SUM_PROBABILITIES: Record<number, number> = {
  2: 1 / 36,
  3: 2 / 36,
  4: 3 / 36,
  5: 4 / 36,
  6: 5 / 36,
  7: 6 / 36,
  8: 5 / 36,
  9: 4 / 36,
  10: 3 / 36,
  11: 2 / 36,
  12: 1 / 36,
};

const DIE_PROBABILITY = 11 / 36; // P(at least one die shows X)

export default function Craps() {
  const { difficulty, config, changeDifficulty } = useDifficulty('craps');
  const { addScore } = useScoreHistory('craps');

  // Type assertion for game-specific config
  const gameConfig = config as typeof config & {
    timerSeconds: number | null; // null = infinite
    minTimer?: number;
    maxTimer?: number;
    marketType: 'random' | 'mixed' | 'bear'; // bear = all bad payouts
  };

  const [phase, setPhase] = useState<GamePhase>(GamePhase.Betting);
  const [cash, setCash] = useState(STARTING_CASH);
  const [round, setRound] = useState(1);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [betOptions, setBetOptions] = useState<BetOption[]>([]);
  const [bets, setBets] = useState<Record<string, number>>({}); // optionId -> amount
  const [actions, setActions] = useState<string[]>([]);
  const [gameNumber, setGameNumber] = useState(0);

  // Generate betting options with payouts
  const generateBetOptions = (): BetOption[] => {
    const options: BetOption[] = [];

    // Sum bets (2-12)
    for (let sum = 2; sum <= 12; sum++) {
      const prob = SUM_PROBABILITIES[sum] ?? 0;
      const fairPayout = 1 / prob;
      let payout = fairPayout;

      if (gameConfig.marketType === 'random') {
        // Easy: random payouts, some good, some bad
        payout = fairPayout * (0.7 + Math.random() * 0.6); // 0.7x to 1.3x of fair
      } else if (gameConfig.marketType === 'mixed') {
        // Medium: mostly bad, occasional good
        payout = Math.random() < 0.3 ? fairPayout * (1.05 + Math.random() * 0.15) : fairPayout * (0.6 + Math.random() * 0.35);
      } else {
        // Hard: all bad payouts
        payout = fairPayout * (0.5 + Math.random() * 0.4); // 0.5x to 0.9x of fair
      }

      options.push({
        id: `sum-${sum}`,
        label: `Sum ${sum}`,
        probability: prob,
        payout: Math.round(payout * 10) / 10,
        category: 'sum',
      });
    }

    // Even/Odd
    const evenOddProb = 0.5;
    const evenOddFair = 2;
    let evenPayout = evenOddFair;
    let oddPayout = evenOddFair;

    if (gameConfig.marketType === 'random') {
      evenPayout = evenOddFair * (0.8 + Math.random() * 0.4);
      oddPayout = evenOddFair * (0.8 + Math.random() * 0.4);
    } else if (gameConfig.marketType === 'mixed') {
      evenPayout = Math.random() < 0.3 ? evenOddFair * (1.05 + Math.random() * 0.1) : evenOddFair * (0.7 + Math.random() * 0.25);
      oddPayout = Math.random() < 0.3 ? evenOddFair * (1.05 + Math.random() * 0.1) : evenOddFair * (0.7 + Math.random() * 0.25);
    } else {
      evenPayout = evenOddFair * (0.6 + Math.random() * 0.3);
      oddPayout = evenOddFair * (0.6 + Math.random() * 0.3);
    }

    options.push(
      {
        id: 'even',
        label: 'Even',
        probability: evenOddProb,
        payout: Math.round(evenPayout * 10) / 10,
        category: 'parity',
      },
      {
        id: 'odd',
        label: 'Odd',
        probability: evenOddProb,
        payout: Math.round(oddPayout * 10) / 10,
        category: 'parity',
      }
    );

    // Die face bets (1-6)
    for (let face = 1; face <= 6; face++) {
      const prob = DIE_PROBABILITY;
      const fairPayout = 1 / prob;
      let payout = fairPayout;

      if (gameConfig.marketType === 'random') {
        payout = fairPayout * (0.7 + Math.random() * 0.6);
      } else if (gameConfig.marketType === 'mixed') {
        payout = Math.random() < 0.3 ? fairPayout * (1.05 + Math.random() * 0.15) : fairPayout * (0.6 + Math.random() * 0.35);
      } else {
        payout = fairPayout * (0.5 + Math.random() * 0.4);
      }

      options.push({
        id: `die-${face}`,
        label: `Die ${face}`,
        probability: prob,
        payout: Math.round(payout * 10) / 10,
        category: 'die',
      });
    }

    return options;
  };

  // Initialize game
  useEffect(() => {
    setBetOptions(generateBetOptions());
    setBets({});
    setRound(1);
    setCash(STARTING_CASH);
    setPhase(GamePhase.Betting);
    setActions([]);
  }, [gameNumber, difficulty]);

  // Timer logic
  useEffect(() => {
    if (phase !== GamePhase.Betting || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleRoll();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  // Start betting phase
  const startBettingPhase = () => {
    setBetOptions(generateBetOptions());
    setBets({});
    setPhase(GamePhase.Betting);

    // Set timer based on difficulty
    if (gameConfig.timerSeconds === null) {
      setTimeLeft(null); // Infinite time
    } else if (gameConfig.minTimer !== undefined && gameConfig.maxTimer !== undefined) {
      // Random timer for hard mode
      const randomTime = Math.floor(Math.random() * (gameConfig.maxTimer - gameConfig.minTimer + 1)) + gameConfig.minTimer;
      setTimeLeft(randomTime);
    } else {
      setTimeLeft(gameConfig.timerSeconds);
    }
  };

  // Initialize first betting phase
  useEffect(() => {
    if (round === 1) {
      startBettingPhase();
    }
  }, [round, gameNumber]);

  const adjustBet = (optionId: string, delta: number) => {
    const currentBet = bets[optionId] ?? 0;
    const newBet = Math.max(0, currentBet + delta);
    const totalBets = Object.values(bets).reduce((sum, amount) => sum + amount, 0) - currentBet + newBet;

    if (totalBets > cash) {
      return; // Can't bet more than current cash
    }

    if (newBet === 0) {
      const newBets = { ...bets };
      delete newBets[optionId];
      setBets(newBets);
    } else {
      setBets({ ...bets, [optionId]: newBet });
    }
  };

  const getTotalBetAmount = (): number => {
    return Object.values(bets).reduce((sum, amount) => sum + amount, 0);
  };

  const handleRoll = () => {
    setPhase(GamePhase.Rolling);

    // Roll dice
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDice([die1, die2]);

    const sum = die1 + die2;
    const isEven = sum % 2 === 0;

    const newActions: string[] = [];
    newActions.push(`🎲 Rolled ${die1} + ${die2} = ${sum} (${isEven ? 'Even' : 'Odd'})`);

    let netPL = 0;
    const totalBetAmount = getTotalBetAmount();

    // Evaluate each bet
    Object.entries(bets).forEach(([optionId, amount]) => {
      const option = betOptions.find((opt) => opt.id === optionId);
      if (!option) return;

      let won = false;

      if (option.category === 'sum') {
        const targetSum = parseInt(optionId.split('-')[1] ?? '0');
        won = sum === targetSum;
      } else if (option.category === 'parity') {
        won = (optionId === 'even' && isEven) || (optionId === 'odd' && !isEven);
      } else if (option.category === 'die') {
        const targetFace = parseInt(optionId.split('-')[1] ?? '0');
        won = die1 === targetFace || die2 === targetFace;
      }

      if (won) {
        const winnings = amount * option.payout;
        netPL += winnings - amount; // Net profit (winnings minus stake)
        newActions.push(`✓ ${option.label} won: $${amount} × ${option.payout}x = $${winnings.toFixed(0)} (+$${(winnings - amount).toFixed(0)})`);
      } else {
        netPL -= amount;
        newActions.push(`✗ ${option.label} lost: -$${amount}`);
      }
    });

    if (totalBetAmount === 0) {
      newActions.push('No bets placed this round');
    } else {
      newActions.push(`Round ${round} P&L: ${netPL >= 0 ? '+' : ''}$${netPL.toFixed(0)}`);
    }

    const newCash = cash + netPL;
    setCash(newCash);
    setActions([...newActions, ...actions]);

    // Check if game over
    if (newCash <= 0) {
      newActions.push('💀 Game Over - Out of cash!');
      setPhase(GamePhase.Result);

      addScore({
        id: `craps-${Date.now()}`,
        gameType: 'craps',
        timestamp: Date.now(),
        difficulty,
        finalScore: 0,
        rounds: round,
        metadata: {
          reason: 'bankrupt',
        },
      });
    } else {
      // Continue to next round
      setTimeout(() => {
        setRound(round + 1);
        startBettingPhase();
      }, 3000);
    }
  };

  const endGame = () => {
    setPhase(GamePhase.Result);

    addScore({
      id: `craps-${Date.now()}`,
      gameType: 'craps',
      timestamp: Date.now(),
      difficulty,
      finalScore: cash,
      rounds: round,
      metadata: {
        reason: 'voluntary_end',
      },
    });
  };

  const resetGame = () => {
    setGameNumber(gameNumber + 1);
  };

  return (
    <GameLayout
      title="Craps Betting Board"
      description="Identify +EV bets quickly before time runs out!"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <GameStats
            cash={cash}
            positions={0}
            round={round}
            maxRounds={round}
            additionalStats={{
              'Total Bets': `$${getTotalBetAmount()}`,
              'Time Left': timeLeft === null ? '∞' : `${timeLeft}s`,
            }}
          />

          <UICard>
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 mb-3">
              Settings
            </h3>
            <DifficultySelect
              value={difficulty}
              onChange={(d: Difficulty) => {
                changeDifficulty(d);
                resetGame();
              }}
              disabled={phase !== GamePhase.Result && round > 1}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {gameConfig.timerSeconds === null
                ? 'Infinite time, random payouts'
                : gameConfig.minTimer
                ? `${gameConfig.minTimer}-${gameConfig.maxTimer}s timer, bear market`
                : `${gameConfig.timerSeconds}s timer, mixed market`}
            </div>
          </UICard>

          <ScoreBoard gameType="craps" />
        </aside>

        {/* Main game area */}
        <main className="lg:col-span-2 space-y-6">
          {/* Dice Display */}
          {phase !== GamePhase.Betting && (
            <UICard>
              <h3 className="font-semibold text-foreground mb-4">Dice Roll</h3>
              <div className="flex gap-4 items-center justify-center py-6">
                {dice.map((die, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 bg-white dark:bg-gray-100 border-2 border-gray-400 rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold text-gray-800"
                  >
                    {die}
                  </div>
                ))}
                <div className="text-4xl font-bold text-primary">
                  = {dice[0] + dice[1]}
                </div>
              </div>
            </UICard>
          )}

          {/* Betting Board */}
          {phase === GamePhase.Betting && (
            <UICard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Place Your Bets - Round {round}
                  </h3>
                  {timeLeft !== null && (
                    <div
                      className={`text-2xl font-bold ${
                        timeLeft <= 3 ? 'text-danger animate-pulse' : 'text-primary'
                      }`}
                    >
                      {timeLeft}s
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Payouts shown are for $100 bets. Use +/- to adjust your bet amount.
                </p>

                {/* Sum Bets */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Sum Bets
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {betOptions
                      .filter((opt) => opt.category === 'sum')
                      .map((option) => (
                        <div
                          key={option.id}
                          className="p-3 border-2 border-border bg-card rounded-lg"
                        >
                          <div className="text-xs font-semibold text-center mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm font-bold text-center text-primary mb-2">
                            ${Math.round(100 * option.payout)}
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => adjustBet(option.id, -BET_INCREMENT)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold"
                            >
                              -
                            </button>
                            <div className="text-xs font-semibold min-w-[40px] text-center">
                              ${bets[option.id] ?? 0}
                            </div>
                            <button
                              onClick={() => adjustBet(option.id, BET_INCREMENT)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Even/Odd Bets */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Parity Bets
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {betOptions
                      .filter((opt) => opt.category === 'parity')
                      .map((option) => (
                        <div
                          key={option.id}
                          className="p-4 border-2 border-border bg-card rounded-lg"
                        >
                          <div className="text-sm font-semibold text-center mb-1">
                            {option.label}
                          </div>
                          <div className="text-lg font-bold text-center text-primary mb-2">
                            ${Math.round(100 * option.payout)}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => adjustBet(option.id, -BET_INCREMENT)}
                              className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-lg font-bold"
                            >
                              -
                            </button>
                            <div className="text-sm font-semibold min-w-[60px] text-center">
                              ${bets[option.id] ?? 0}
                            </div>
                            <button
                              onClick={() => adjustBet(option.id, BET_INCREMENT)}
                              className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-lg font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Die Face Bets */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Die Face Bets (at least one die)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {betOptions
                      .filter((opt) => opt.category === 'die')
                      .map((option) => (
                        <div
                          key={option.id}
                          className="p-3 border-2 border-border bg-card rounded-lg"
                        >
                          <div className="text-xs font-semibold text-center mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm font-bold text-center text-primary mb-2">
                            ${Math.round(100 * option.payout)}
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => adjustBet(option.id, -BET_INCREMENT)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold"
                            >
                              -
                            </button>
                            <div className="text-xs font-semibold min-w-[40px] text-center">
                              ${bets[option.id] ?? 0}
                            </div>
                            <button
                              onClick={() => adjustBet(option.id, BET_INCREMENT)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button onClick={handleRoll} className="flex-1">
                    Roll Dice ({getTotalBetAmount() === 0 ? 'Skip Round' : `Bet $${getTotalBetAmount()}`})
                  </Button>
                  <Button onClick={endGame} variant="secondary">
                    Cash Out
                  </Button>
                </div>
              </div>
            </UICard>
          )}

          {/* Game Over */}
          {phase === GamePhase.Result && (
            <UICard>
              <div className="text-center space-y-4 py-6">
                <div className="text-2xl font-bold text-success">Game Complete!</div>
                <div className="text-lg text-foreground">
                  Final Cash: ${cash.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rounds Played: {round}
                </div>
                <Button onClick={resetGame} variant="primary" className="w-full">
                  Play Again
                </Button>
              </div>
            </UICard>
          )}

          <ActionHistory actions={actions} maxHeight="max-h-96" />
        </main>
      </div>
    </GameLayout>
  );
}
