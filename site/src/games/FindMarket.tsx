import { useState, useEffect } from 'react';
import { GameLayout } from '@components/layout/GameLayout';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { GameStats } from '@components/game/GameStats';
import { ActionHistory } from '@components/game/ActionHistory';
import { DifficultySelect } from '@components/game/DifficultySelect';
import { ScoreBoard } from '@components/game/ScoreBoard';
import { useDifficulty } from '@hooks/useDifficulty';
import { useScoreHistory } from '@hooks/useScoreHistory';
import { Difficulty } from '@/types/game.types';

export default function FindMarket() {
  const { difficulty, config, changeDifficulty } = useDifficulty('findmarket');
  const { addScore } = useScoreHistory('findmarket');

  // Type assertion for game-specific config
  const gameConfig = config as typeof config & {
    maxRounds: number;
    tolerance: [number, number];
    priceMultiplier: number;
  };

  const [gameNumber, setGameNumber] = useState(0);
  const [round, setRound] = useState(1);
  const [cash, setCash] = useState(gameConfig.initialCash);
  const [stock, setStock] = useState(0);
  const [bid, setBid] = useState<number | null>(null);
  const [ask, setAsk] = useState<number | null>(null);
  const [sizeAsk, setSizeAsk] = useState<number | null>(null);
  const [sizeBid, setSizeBid] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [actions, setActions] = useState<string[]>([]);

  const [target, setTarget] = useState<number | null>(null);
  const [lowerRange, setLowerRange] = useState<number | null>(null);
  const [upperRange, setUpperRange] = useState<number | null>(null);
  const [priceBid, setPriceBid] = useState<number | null>(null);
  const [priceAsk, setPriceAsk] = useState<number | null>(null);

  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const setupGame = () => {
    // Generate target price based on difficulty
    const numIter = 3;
    const multiplier = 100 * gameConfig.priceMultiplier;
    const [minTolerance, maxTolerance] = gameConfig.tolerance;
    const tolerance = Math.ceil(
      minTolerance + Math.random() * (maxTolerance - minTolerance)
    );
    let tempTarget = 0;
    for (let i = 1; i <= numIter; i++) {
      tempTarget += Math.random() * multiplier * i;
    }
    tempTarget = Math.ceil(tempTarget);

    setTarget(tempTarget);
    setLowerRange(0);
    setUpperRange((multiplier * numIter * (numIter + 1)) / 2 + 30);
    setPriceBid(tempTarget - tolerance);
    setPriceAsk(tempTarget + tolerance);

    // Reset game state
    setCash(gameConfig.initialCash);
    setStock(0);
    setRound(1);
    setActions([]);
    setMessage('');
    setBid(null);
    setAsk(null);
    setSizeAsk(null);
    setSizeBid(null);
    setFinalPrice(null);
  };

  useEffect(setupGame, [gameNumber, gameConfig]);

  const resetRound = () => {
    setMessage('');
  };

  const resetGame = () => {
    setGameNumber(gameNumber + 1);
  };

  const playFinalRound = () => {
    if (round !== gameConfig.maxRounds + 1) {
      return;
    } else if (finalPrice == null) {
      setMessage('Please input a non-empty final price guess');
      return;
    }

    const priceDiff = (target ?? 0) - finalPrice;
    const portfolioValue = cash + stock * (target ?? 0);

    setMessage(
      `The actual price was $${target}. You were off by $${Math.abs(
        priceDiff
      )}. Your final portfolio value is $${cash} + ${stock} × $${target} = $${portfolioValue.toLocaleString()}.`
    );
    setRound(round + 1);

    // Save score
    addScore({
      id: `findmarket-${Date.now()}`,
      gameType: 'findmarket',
      timestamp: Date.now(),
      difficulty,
      finalScore: portfolioValue,
      rounds: gameConfig.maxRounds,
      metadata: {
        targetPrice: target,
        finalGuess: finalPrice,
        positionsHeld: stock,
        accuracy: Math.abs(priceDiff),
      },
    });
  };

  const playRound = () => {
    if (bid == null || ask == null || sizeAsk == null || sizeBid == null) {
      setMessage('Please input a non-empty bid/ask with sizes');
      return;
    } else if (bid >= ask) {
      setMessage('Your bid must be less than your ask price');
      return;
    }

    const newActions: string[] = [];
    let newCash = cash;
    let newStock = stock;

    if (priceBid !== null && bid >= priceBid) {
      newCash -= sizeBid * bid;
      newStock += sizeBid;
      newActions.push(`✓ ${sizeBid} buys filled @$${bid}`);
    } else {
      newActions.push(`✗ No bids filled (bid too low)`);
    }

    if (priceAsk !== null && ask <= priceAsk) {
      newCash += sizeAsk * ask;
      newStock -= sizeAsk;
      newActions.push(`✓ ${sizeAsk} sells filled @$${ask}`);
    } else {
      newActions.push(`✗ No sells filled (ask too high)`);
    }

    setCash(newCash);
    setStock(newStock);
    resetRound();
    setActions([...newActions, ...actions]);
    setRound(round + 1);

    // Clear inputs
    setBid(null);
    setAsk(null);
    setSizeAsk(null);
    setSizeBid(null);
  };

  const isGameOver = round > gameConfig.maxRounds + 1;

  return (
    <GameLayout
      title="Find the Market"
      description="Use bid-ask spreads to find the market price as accurately as possible while managing your position."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <GameStats
            cash={cash}
            positions={stock}
            round={Math.min(round, gameConfig.maxRounds + 1)}
            maxRounds={gameConfig.maxRounds}
          />

          <Card>
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 mb-3">
              Settings
            </h3>
            <DifficultySelect
              value={difficulty}
              onChange={(d: Difficulty) => {
                changeDifficulty(d);
                resetGame();
              }}
              disabled={round > 1}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {round > 1
                ? 'Difficulty locked during game'
                : 'Change difficulty and start new game'}
            </p>
          </Card>

          <ScoreBoard gameType="findmarket" />
        </aside>

        {/* Main game area */}
        <main className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Price Range
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${lowerRange?.toLocaleString()} - $
                  {upperRange?.toLocaleString()}
                </div>
              </div>

              {round <= gameConfig.maxRounds && !isGameOver && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Round {round} - Make Your Market
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Bid (Buy Price)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={bid ?? ''}
                          onChange={(val) => setBid(Number(val) || null)}
                        />
                        <Input
                          type="number"
                          placeholder="Size"
                          value={sizeBid ?? ''}
                          onChange={(val) => setSizeBid(Number(val) || null)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Ask (Sell Price)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={ask ?? ''}
                          onChange={(val) => setAsk(Number(val) || null)}
                        />
                        <Input
                          type="number"
                          placeholder="Size"
                          value={sizeAsk ?? ''}
                          onChange={(val) => setSizeAsk(Number(val) || null)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={playRound} className="w-full">
                    Submit Round {round}
                  </Button>
                </div>
              )}

              {round === gameConfig.maxRounds + 1 && !isGameOver && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Final Round - Guess the Fair Price
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on your trading, what do you think the actual market
                    price is?
                  </p>
                  <Input
                    type="number"
                    placeholder="Your final price guess"
                    value={finalPrice ?? ''}
                    onChange={(val) => setFinalPrice(Number(val) || null)}
                  />
                  <Button onClick={playFinalRound} className="w-full">
                    Submit Final Guess
                  </Button>
                </div>
              )}

              {isGameOver && (
                <div className="text-center space-y-4 py-6">
                  <div className="text-2xl font-bold text-success">
                    Game Complete!
                  </div>
                  <div className="text-lg text-foreground">
                    Final Score: $
                    {(cash + stock * (target ?? 0)).toLocaleString()}
                  </div>
                  <Button onClick={resetGame} variant="primary">
                    Play Again
                  </Button>
                </div>
              )}

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    isGameOver
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={resetGame}
                  variant="secondary"
                  className="flex-1"
                >
                  Restart Game
                </Button>
              </div>
            </div>
          </Card>

          <ActionHistory actions={actions} maxHeight="max-h-64" />
        </main>
      </div>
    </GameLayout>
  );
}
