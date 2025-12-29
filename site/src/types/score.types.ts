import { Difficulty, GameScore } from './game.types';

export interface DifficultyStats {
  games: number;
  avgScore: number;
  bestScore: number;
}

export interface ScoreHistory {
  scores: GameScore[];
  stats: {
    totalGames: number;
    averageScore: number;
    bestScore: number;
    byDifficulty: Record<Difficulty, DifficultyStats>;
  };
}
