import { useState, useEffect } from 'react';
import { GameLayout } from '@components/layout/GameLayout';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card as UICard } from '@components/ui/Card';
import { GameStats } from '@components/game/GameStats';
import { ActionHistory } from '@components/game/ActionHistory';
import { DifficultySelect } from '@components/game/DifficultySelect';
import { ScoreBoard } from '@components/game/ScoreBoard';
import { Hand } from '@components/cards/Hand';
import { PlayingCard } from '@components/cards/PlayingCard';
import { useDifficulty } from '@hooks/useDifficulty';
import { useScoreHistory } from '@hooks/useScoreHistory';
import { Difficulty } from '@/types/game.types';
import { Card } from '@/types/cards.types';
import {
  createDeck,
  dealCards,
  calculateSum,
  calculateExpectedValue,
} from '@utils/cards';

const MAX_ROUNDS = 6;

export default function CardSum() {
  const { difficulty, config, changeDifficulty } = useDifficulty('cardsum');
  const { addScore } = useScoreHistory('cardsum');

  // Type assertion for game-specific config
  const gameConfig = config as typeof config & {
    numPlayers: number;
    opponentSkill: 'random' | 'approximate' | 'optimal';
    tradingVolume: number;
  };

  const [gameNumber, setGameNumber] = useState(0);
  const [round, setRound] = useState(0);
  const [cash, setCash] = useState(gameConfig.initialCash);
  const [longPositions, setLongPositions] = useState(0);

  const [userHand, setUserHand] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [opponentHands, setOpponentHands] = useState<Card[][]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  const [bid, setBid] = useState<number | null>(null);
  const [ask, setAsk] = useState<number | null>(null);
  const [sizeBid, setSizeBid] = useState<number>(1);
  const [sizeAsk, setSizeAsk] = useState<number>(1);

  const [message, setMessage] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [actualSum, setActualSum] = useState(0);

  const setupGame = () => {
    const deck = createDeck();
    const { playerHands, community } = dealCards(deck, gameConfig.numPlayers);

    setUserHand(playerHands[0] ?? []);
    setOpponentHands(playerHands.slice(1));
    setCommunityCards(community);

    // Calculate actual sum
    const allCards = playerHands.flat().concat(community);
    const sum = calculateSum(allCards);
    setActualSum(sum);

    // Reset game state
    setCash(gameConfig.initialCash);
    setLongPositions(0);
    setRound(0);
    setRevealedCount(0);
    setActions([]);
    setMessage('');
    setBid(null);
    setAsk(null);
    setSizeBid(1);
    setSizeAsk(1);
  };

  useEffect(setupGame, [gameNumber, gameConfig.numPlayers]);

  const resetGame = () => {
    setGameNumber(gameNumber + 1);
  };

  // Calculate user's EV estimate
  const calculateUserEV = () => {
    const knownCards = [...userHand, ...communityCards.slice(0, revealedCount)];
    const numUnknown =
      (gameConfig.numPlayers - 1) * 2 + (communityCards.length - revealedCount);
    return Math.round(calculateExpectedValue(knownCards, numUnknown));
  };

  // Opponent AI: Calculate their EV and decide whether to trade
  const evaluateOpponentTrades = (
    userBid: number,
    userAsk: number,
    sizeBid: number,
    sizeAsk: number
  ): { buyFills: number; sellFills: number } => {
    let totalBuyFills = 0;
    let totalSellFills = 0;

    opponentHands.forEach((hand) => {
      const knownCards = [...hand, ...communityCards.slice(0, revealedCount)];
      const numUnknown =
        gameConfig.numPlayers * 2 -
        hand.length +
        (communityCards.length - revealedCount) -
        userHand.length;
      const opponentEV = calculateExpectedValue(knownCards, numUnknown);

      // Opponent trading logic based on difficulty
      const edge = gameConfig.opponentSkill === 'optimal' ? 2 : gameConfig.opponentSkill === 'approximate' ? 5 : 10;

      // If user's ask is below opponent's EV (cheap), opponents buy
      if (userAsk < opponentEV - edge) {
        const volume =
          gameConfig.opponentSkill === 'random'
            ? Math.floor(Math.random() * gameConfig.tradingVolume)
            : Math.min(
                Math.floor((opponentEV - userAsk) / 10),
                gameConfig.tradingVolume
              );
        totalBuyFills += Math.min(volume, sizeAsk);
      }

      // If user's bid is above opponent's EV (expensive), opponents sell
      if (userBid > opponentEV + edge) {
        const volume =
          gameConfig.opponentSkill === 'random'
            ? Math.floor(Math.random() * gameConfig.tradingVolume)
            : Math.min(
                Math.floor((userBid - opponentEV) / 10),
                gameConfig.tradingVolume
              );
        totalSellFills += Math.min(volume, sizeBid);
      }
    });

    return {
      buyFills: Math.min(totalBuyFills, sizeAsk),
      sellFills: Math.min(totalSellFills, sizeBid),
    };
  };

  const playRound = () => {
    if (bid == null || ask == null) {
      setMessage('Please enter both bid and ask prices');
      return;
    }
    if (bid >= ask) {
      setMessage('Bid must be less than ask');
      return;
    }

    const newActions: string[] = [];
    let newCash = cash;
    let newPositions = longPositions;

    // Evaluate opponent trades
    const { buyFills, sellFills } = evaluateOpponentTrades(
      bid,
      ask,
      sizeBid,
      sizeAsk
    );

    // User sells (opponents buy from user's ask)
    if (buyFills > 0) {
      newCash += buyFills * ask;
      newPositions -= buyFills;
      newActions.push(`✓ Sold ${buyFills} contracts @${ask}`);
    }

    // User buys (opponents sell to user's bid)
    if (sellFills > 0) {
      newCash -= sellFills * bid;
      newPositions += sellFills;
      newActions.push(`✓ Bought ${sellFills} contracts @${bid}`);
    }

    if (buyFills === 0 && sellFills === 0) {
      newActions.push('✗ No trades executed (market too wide)');
    }

    setCash(newCash);
    setLongPositions(newPositions);
    setActions([...newActions, ...actions]);

    // Advance to next round
    if (round < MAX_ROUNDS - 1) {
      setRevealedCount(revealedCount + 1);
      setRound(round + 1);
      setMessage('');
      setBid(null);
      setAsk(null);
    } else {
      // Final round - calculate score
      const finalScore = newCash + newPositions * actualSum;
      setMessage(
        `Game Over! Actual sum was ${actualSum}. Your P&L: $${newCash} + ${newPositions} × ${actualSum} = $${finalScore.toLocaleString()}`
      );
      setRound(round + 1);

      // Save score
      addScore({
        id: `cardsum-${Date.now()}`,
        gameType: 'cardsum',
        timestamp: Date.now(),
        difficulty,
        finalScore,
        rounds: MAX_ROUNDS,
        metadata: {
          actualSum,
          longPositions: newPositions,
          expectedValue: calculateUserEV(),
        },
      });
    }
  };

  const isGameOver = round >= MAX_ROUNDS;
  const knownSum =
    calculateSum(userHand) + calculateSum(communityCards.slice(0, revealedCount));

  return (
    <GameLayout
      title="Sum of Cards"
      description="Make markets on the sum of all cards in play. You see your hand, but opponents see theirs too!"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <GameStats
            cash={cash}
            positions={longPositions}
            round={round + 1}
            maxRounds={MAX_ROUNDS}
            additionalStats={{
              'Players': gameConfig.numPlayers,
              'Known Sum': knownSum,
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
              disabled={round > 0}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {round > 0
                ? 'Difficulty locked during game'
                : `${gameConfig.numPlayers} players, ${gameConfig.opponentSkill} AI`}
            </p>
          </UICard>

          <ScoreBoard gameType="cardsum" />
        </aside>

        {/* Main game area */}
        <main className="lg:col-span-2 space-y-6">
          <UICard>
            <h3 className="font-semibold text-foreground mb-4">Your Hand</h3>
            <Hand cards={userHand} size="md" />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sum: {calculateSum(userHand)}
            </div>
          </UICard>

          <UICard>
            <h3 className="font-semibold text-foreground mb-4">
              Community Cards {revealedCount > 0 && `(${revealedCount}/${communityCards.length} revealed)`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {communityCards.map((card, index) => (
                <PlayingCard
                  key={index}
                  card={card}
                  faceDown={index >= revealedCount}
                  size="md"
                />
              ))}
            </div>
            {revealedCount > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Revealed Sum: {calculateSum(communityCards.slice(0, revealedCount))}
              </div>
            )}
          </UICard>

          <UICard>
            <div className="space-y-4">
              {!isGameOver ? (
                <>
                  <h3 className="font-semibold text-foreground">
                    Round {round + 1} - Make Your Market
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ace = 1, Jack = 11, Queen = 12, King = 13
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Bid (You Buy)
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
                          value={sizeBid}
                          onChange={(val) => setSizeBid(Number(val) || 1)}
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Ask (You Sell)
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
                          value={sizeAsk}
                          onChange={(val) => setSizeAsk(Number(val) || 1)}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={playRound} className="w-full">
                    Submit Market for Round {round + 1}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4 py-6">
                  <div className="text-2xl font-bold text-success">
                    Game Complete!
                  </div>
                  <div className="text-lg text-foreground">
                    Final Score: ${(cash + longPositions * actualSum).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Actual sum: {actualSum} | Your positions: {longPositions} | Cash: $
                    {cash.toLocaleString()}
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

              {!isGameOver && (
                <Button onClick={resetGame} variant="secondary" className="w-full">
                  Restart Game
                </Button>
              )}
            </div>
          </UICard>

          <ActionHistory actions={actions} maxHeight="max-h-64" />
        </main>
      </div>
    </GameLayout>
  );
}
