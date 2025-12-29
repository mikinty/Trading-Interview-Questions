import { GameScore } from '@/types/game.types';
import { ScoreHistory } from '@/types/score.types';
import { calculateStats } from './scoring';

const STORAGE_KEY = 'trading-games-scores';
const MAX_SCORES = 100;

/**
 * Save a game score to localStorage
 */
export function saveScore(score: GameScore): void {
  const history = getScoreHistory();
  history.scores.push(score);

  // Keep only last MAX_SCORES scores
  if (history.scores.length > MAX_SCORES) {
    history.scores = history.scores.slice(-MAX_SCORES);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.scores));
}

/**
 * Get score history from localStorage
 */
export function getScoreHistory(gameType?: string): ScoreHistory {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { scores: [], stats: calculateStats([]) };
    }

    const parsed: GameScore[] = JSON.parse(stored);
    let scores = Array.isArray(parsed) ? parsed : [];

    // Filter by game type if specified
    if (gameType) {
      scores = scores.filter(s => s.gameType === gameType);
    }

    return {
      scores,
      stats: calculateStats(scores),
    };
  } catch (error) {
    console.error('Error loading score history:', error);
    return { scores: [], stats: calculateStats([]) };
  }
}

/**
 * Clear all scores from localStorage
 */
export function clearScoreHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get best score for a game type
 */
export function getBestScore(gameType: string): number | null {
  const history = getScoreHistory(gameType);
  if (history.scores.length === 0) return null;
  return history.stats.bestScore;
}
