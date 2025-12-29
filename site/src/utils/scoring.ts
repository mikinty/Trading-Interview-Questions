import { Difficulty, GameScore } from '@/types/game.types';
import { DifficultyStats, ScoreHistory } from '@/types/score.types';

/**
 * Calculate aggregate statistics from scores
 */
export function calculateStats(scores: GameScore[]): ScoreHistory['stats'] {
  if (scores.length === 0) {
    return {
      totalGames: 0,
      averageScore: 0,
      bestScore: 0,
      byDifficulty: {
        [Difficulty.Easy]: { games: 0, avgScore: 0, bestScore: 0 },
        [Difficulty.Medium]: { games: 0, avgScore: 0, bestScore: 0 },
        [Difficulty.Hard]: { games: 0, avgScore: 0, bestScore: 0 },
      },
    };
  }

  const totalGames = scores.length;
  const totalScore = scores.reduce((sum, s) => sum + s.finalScore, 0);
  const averageScore = totalScore / totalGames;
  const bestScore = Math.max(...scores.map(s => s.finalScore));

  // Calculate stats by difficulty
  const byDifficulty: Record<Difficulty, DifficultyStats> = {
    [Difficulty.Easy]: calculateDifficultyStats(scores, Difficulty.Easy),
    [Difficulty.Medium]: calculateDifficultyStats(scores, Difficulty.Medium),
    [Difficulty.Hard]: calculateDifficultyStats(scores, Difficulty.Hard),
  };

  return {
    totalGames,
    averageScore,
    bestScore,
    byDifficulty,
  };
}

/**
 * Calculate stats for a specific difficulty level
 */
function calculateDifficultyStats(
  scores: GameScore[],
  difficulty: Difficulty
): DifficultyStats {
  const filtered = scores.filter(s => s.difficulty === difficulty);

  if (filtered.length === 0) {
    return { games: 0, avgScore: 0, bestScore: 0 };
  }

  const totalScore = filtered.reduce((sum, s) => sum + s.finalScore, 0);
  const avgScore = totalScore / filtered.length;
  const bestScore = Math.max(...filtered.map(s => s.finalScore));

  return {
    games: filtered.length,
    avgScore,
    bestScore,
  };
}
