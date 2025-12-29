import { useState } from 'react';
import { GameLayout } from '@components/layout/GameLayout';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card as UICard } from '@components/ui/Card';
import { GameStats } from '@components/game/GameStats';
import { ActionHistory } from '@components/game/ActionHistory';
import { DifficultySelect } from '@components/game/DifficultySelect';
import { ScoreBoard } from '@components/game/ScoreBoard';
import { useDifficulty } from '@hooks/useDifficulty';
import { useScoreHistory } from '@hooks/useScoreHistory';
import { Difficulty } from '@/types/game.types';

enum CrapsPhase {
  Betting = 'betting',
  ComeOut = 'comeout',
  Trading = 'trading',
  Point = 'point',
  Resolved = 'resolved',
}

export default function Craps() {
  const { difficulty, config, changeDifficulty } = useDifficulty('craps');
  const { addScore } = useScoreHistory('craps');

  // Type assertion for game-specific config
  const gameConfig = config as typeof config & {
    opponentSkill: 'random' | 'approximate' | 'optimal';
    marketWidth: number;
  };

  const [phase, setPhase] = useState<CrapsPhase>(CrapsPhase.Betting);
  const [cash, setCash] = useState(gameConfig.initialCash);
  const [initialBet, setInitialBet] = useState<number>(100);
  const [point, setPoint] = useState<number | null>(null);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  // Trading state
  const [bid, setBid] = useState<number | null>(null);
  const [ask, setAsk] = useState<number | null>(null);
  const [longContracts, setLongContracts] = useState(0);

  const [actions, setActions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [gameNumber, setGameNumber] = useState(0);

  // Calculate probability of making point
  const calculatePointProbability = (pointValue: number): number => {
    const pointWays: Record<number, number> = {
      4: 3,
      5: 4,
      6: 5,
      8: 5,
      9: 4,
      10: 3,
    };
    const sevenWays = 6;
    const ways = pointWays[pointValue] || 0;
    return Math.round((ways / (ways + sevenWays)) * 100);
  };

  const rollDice = (): [number, number] => {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return [die1, die2];
  };

  const evaluateOpponentTrade = (
    userBid: number,
    userAsk: number,
    trueProb: number
  ): { buyFills: number; sellFills: number } => {
    const edge = gameConfig.opponentSkill === 'optimal' ? 2 : gameConfig.opponentSkill === 'approximate' ? 5 : 15;

    let buyFills = 0;
    let sellFills = 0;

    // Opponents buy if ask is below fair value
    if (userAsk < trueProb - edge) {
      const volume =
        gameConfig.opponentSkill === 'random'
          ? Math.floor(Math.random() * 10) + 1
          : Math.min(Math.floor((trueProb - userAsk) / 5) + 1, 10);
      buyFills = volume;
    }

    // Opponents sell if bid is above fair value
    if (userBid > trueProb + edge) {
      const volume =
        gameConfig.opponentSkill === 'random'
          ? Math.floor(Math.random() * 10) + 1
          : Math.min(Math.floor((userBid - trueProb) / 5) + 1, 10);
      sellFills = volume;
    }

    return { buyFills, sellFills };
  };

  const startGame = () => {
    if (initialBet <= 0 || initialBet > cash) {
      setMessage('Invalid bet amount');
      return;
    }

    setCash(cash - initialBet);
    setPhase(CrapsPhase.ComeOut);
    setActions([`Placed initial bet: $${initialBet}`]);
    setMessage('Rolling come-out...');

    // Auto-roll come-out after short delay
    setTimeout(rollComeOut, 500);
  };

  const rollComeOut = () => {
    const [die1, die2] = rollDice();
    const sum = die1 + die2;
    setDice([die1, die2]);
    setRollHistory([sum]);

    const newActions = [...actions];

    if (sum === 7 || sum === 11) {
      // Natural win
      const winnings = initialBet * 2;
      setCash(cash + winnings);
      newActions.push(`🎲 Rolled ${sum} - Natural Win! +$${winnings}`);
      setActions(newActions);
      setMessage(`You won $${winnings}!`);
      setPhase(CrapsPhase.Resolved);

      // Save score
      addScore({
        id: `craps-${Date.now()}`,
        gameType: 'craps',
        timestamp: Date.now(),
        difficulty,
        finalScore: cash + winnings,
        rounds: 1,
        metadata: {
          result: 'natural_win',
          initialBet,
        },
      });
    } else if (sum === 2 || sum === 3 || sum === 12) {
      // Craps - lose
      newActions.push(`🎲 Rolled ${sum} - Craps! Lost $${initialBet}`);
      setActions(newActions);
      setMessage(`Craps! You lost $${initialBet}`);
      setPhase(CrapsPhase.Resolved);

      // Save score
      addScore({
        id: `craps-${Date.now()}`,
        gameType: 'craps',
        timestamp: Date.now(),
        difficulty,
        finalScore: cash,
        rounds: 1,
        metadata: {
          result: 'craps',
          initialBet,
        },
      });
    } else {
      // Point established
      setPoint(sum);
      newActions.push(`🎲 Rolled ${sum} - Point established`);
      setActions(newActions);
      setMessage(`Point is ${sum}. Make your market on "will make point"`);
      setPhase(CrapsPhase.Trading);
    }
  };

  const submitMarket = () => {
    if (bid == null || ask == null) {
      setMessage('Please enter both bid and ask');
      return;
    }
    if (bid >= ask) {
      setMessage('Bid must be less than ask');
      return;
    }
    if (bid < 0 || ask > 100) {
      setMessage('Prices must be between 0 and 100');
      return;
    }

    const trueProb = calculatePointProbability(point!);
    const { buyFills, sellFills } = evaluateOpponentTrade(bid, ask, trueProb);

    const newActions = [...actions];
    let newCash = cash;
    let newContracts = longContracts;

    // User sells (opponents buy from user's ask)
    if (buyFills > 0) {
      newCash += buyFills * ask;
      newContracts -= buyFills;
      newActions.push(`✓ Sold ${buyFills} contracts @${ask}`);
    }

    // User buys (opponents sell to user's bid)
    if (sellFills > 0) {
      newCash -= sellFills * bid;
      newContracts += sellFills;
      newActions.push(`✓ Bought ${sellFills} contracts @${bid}`);
    }

    if (buyFills === 0 && sellFills === 0) {
      newActions.push('✗ No trades (market not attractive)');
    }

    setCash(newCash);
    setLongContracts(newContracts);
    setActions(newActions);
    setBid(null);
    setAsk(null);
    setMessage('Market submitted. Rolling dice...');
    setPhase(CrapsPhase.Point);

    // Auto-roll after short delay
    setTimeout(rollForPoint, 500);
  };

  const rollForPoint = () => {
    const [die1, die2] = rollDice();
    const sum = die1 + die2;
    setDice([die1, die2]);
    setRollHistory([...rollHistory, sum]);

    const newActions = [...actions];

    if (sum === point) {
      // Made the point!
      const initialWinnings = initialBet * 2;
      const contractSettlement = longContracts * 100;
      const totalWinnings = initialWinnings + contractSettlement;
      const newCash = cash + totalWinnings;

      newActions.push(`🎲 Rolled ${sum} - Point Made!`);
      newActions.push(`Initial bet payout: +$${initialWinnings}`);
      newActions.push(`Contract settlement: ${longContracts} × 100 = $${contractSettlement}`);
      newActions.push(`Total: +$${totalWinnings}`);

      setCash(newCash);
      setActions(newActions);
      setMessage(`Point made! Total winnings: $${totalWinnings}`);
      setPhase(CrapsPhase.Resolved);

      // Save score
      addScore({
        id: `craps-${Date.now()}`,
        gameType: 'craps',
        timestamp: Date.now(),
        difficulty,
        finalScore: newCash,
        rounds: rollHistory.length + 1,
        metadata: {
          result: 'point_made',
          point,
          initialBet,
          contracts: longContracts,
        },
      });
    } else if (sum === 7) {
      // Seven out!
      const contractSettlement = longContracts * 100;
      const newCash = cash - contractSettlement;

      newActions.push(`🎲 Rolled 7 - Seven Out!`);
      newActions.push(`Lost initial bet: -$${initialBet}`);
      newActions.push(`Contract settlement: ${longContracts} × 0 = $${-contractSettlement}`);
      newActions.push(`Total loss: $${initialBet + contractSettlement}`);

      setCash(newCash);
      setActions(newActions);
      setMessage(`Seven out! Total loss: $${initialBet + contractSettlement}`);
      setPhase(CrapsPhase.Resolved);

      // Save score
      addScore({
        id: `craps-${Date.now()}`,
        gameType: 'craps',
        timestamp: Date.now(),
        difficulty,
        finalScore: newCash,
        rounds: rollHistory.length + 1,
        metadata: {
          result: 'seven_out',
          point,
          initialBet,
          contracts: longContracts,
        },
      });
    } else {
      // Continue rolling
      newActions.push(`🎲 Rolled ${sum} - Keep rolling`);
      setActions(newActions);
      setMessage(`Rolled ${sum}. Make another market or roll again.`);
      setPhase(CrapsPhase.Trading);
    }
  };

  const skipTrading = () => {
    setMessage('Skipping market making. Rolling...');
    setPhase(CrapsPhase.Point);
    setTimeout(rollForPoint, 500);
  };

  const resetGame = () => {
    setPhase(CrapsPhase.Betting);
    setCash(gameConfig.initialCash);
    setInitialBet(100);
    setPoint(null);
    setDice([1, 1]);
    setRollHistory([]);
    setBid(null);
    setAsk(null);
    setLongContracts(0);
    setActions([]);
    setMessage('');
    setGameNumber(gameNumber + 1);
  };

  const probability = point ? calculatePointProbability(point) : 50;

  return (
    <GameLayout
      title="Craps with Bonus"
      description="Play craps with a twist: make markets on whether you'll make your point!"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <GameStats
            cash={cash}
            positions={longContracts}
            round={rollHistory.length}
            maxRounds={rollHistory.length}
            additionalStats={{
              Point: point ?? '-',
              'Win Prob': point ? `${probability}%` : '-',
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
              disabled={phase !== CrapsPhase.Betting && phase !== CrapsPhase.Resolved}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {gameConfig.opponentSkill} opponents, ±{gameConfig.marketWidth} edge
            </p>
          </UICard>

          <ScoreBoard gameType="craps" />
        </aside>

        {/* Main game area */}
        <main className="lg:col-span-2 space-y-6">
          {/* Dice Display */}
          <UICard>
            <h3 className="font-semibold text-foreground mb-4">Dice</h3>
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
            {rollHistory.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Roll history: {rollHistory.join(', ')}
              </div>
            )}
          </UICard>

          {/* Game Controls */}
          <UICard>
            <div className="space-y-4">
              {phase === CrapsPhase.Betting && (
                <>
                  <h3 className="font-semibold text-foreground">Place Your Bet</h3>
                  <Input
                    type="number"
                    label="Initial Bet Amount"
                    value={initialBet}
                    onChange={(val) => setInitialBet(Number(val) || 100)}
                    placeholder="Bet amount"
                  />
                  <Button onClick={startGame} className="w-full">
                    Roll Come-Out
                  </Button>
                </>
              )}

              {phase === CrapsPhase.Trading && point && (
                <>
                  <h3 className="font-semibold text-foreground">
                    Make Market on "Will Make Point {point}"
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contract pays 100 if point is made, 0 if seven-out. True
                    probability: ~{probability}%
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Bid (You Buy)"
                      placeholder="0-100"
                      value={bid ?? ''}
                      onChange={(val) => setBid(Number(val) || null)}
                    />
                    <Input
                      type="number"
                      label="Ask (You Sell)"
                      placeholder="0-100"
                      value={ask ?? ''}
                      onChange={(val) => setAsk(Number(val) || null)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={submitMarket} className="flex-1">
                      Submit Market & Roll
                    </Button>
                    <Button onClick={skipTrading} variant="secondary" className="flex-1">
                      Skip & Roll
                    </Button>
                  </div>
                </>
              )}

              {phase === CrapsPhase.Resolved && (
                <div className="text-center space-y-4 py-6">
                  <div className="text-2xl font-bold text-success">Game Complete!</div>
                  <div className="text-lg text-foreground">
                    Final Cash: ${cash.toLocaleString()}
                  </div>
                  <Button onClick={resetGame} variant="primary" className="w-full">
                    Play Again
                  </Button>
                </div>
              )}

              {message && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200">
                  {message}
                </div>
              )}
            </div>
          </UICard>

          <ActionHistory actions={actions} maxHeight="max-h-96" />
        </main>
      </div>
    </GameLayout>
  );
}
