import { Card } from '@components/ui/Card';
import { useScoreHistory } from '@hooks/useScoreHistory';
import { Difficulty } from '@/types/game.types';

interface ScoreBoardProps {
  gameType: 'findmarket' | 'cardsum' | 'craps';
}

export function ScoreBoard({ gameType }: ScoreBoardProps) {
  const { history } = useScoreHistory(gameType);

  if (history.scores.length === 0) {
    return null;
  }

  const difficultyLabels: Record<Difficulty, string> = {
    [Difficulty.Easy]: 'Easy',
    [Difficulty.Medium]: 'Medium',
    [Difficulty.Hard]: 'Hard',
  };

  return (
    <Card>
      <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 mb-4">
        Score History
      </h3>

      {/* Statistics summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {history.stats.totalGames}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Games
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            ${Math.round(history.stats.bestScore).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Best Score
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            ${Math.round(history.stats.averageScore).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Average
          </div>
        </div>
      </div>

      {/* Recent scores table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">
                Date
              </th>
              <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">
                Difficulty
              </th>
              <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {history.scores
              .slice(-10)
              .reverse()
              .map((score) => (
                <tr
                  key={score.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    {new Date(score.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`
                        px-2 py-0.5 rounded text-xs font-medium
                        ${
                          score.difficulty === Difficulty.Easy
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : score.difficulty === Difficulty.Medium
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }
                      `}
                    >
                      {difficultyLabels[score.difficulty]}
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold text-foreground">
                    ${score.finalScore.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
