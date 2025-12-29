import { useState, useCallback } from 'react';
import { GameScore } from '@/types/game.types';
import { ScoreHistory } from '@/types/score.types';
import { getScoreHistory, saveScore as saveScoreToStorage, clearScoreHistory } from '@utils/localStorage';
import { calculateStats } from '@utils/scoring';

export function useScoreHistory(gameType?: string) {
  const [history, setHistory] = useState<ScoreHistory>(() =>
    getScoreHistory(gameType)
  );

  const addScore = useCallback(
    (score: GameScore) => {
      saveScoreToStorage(score);
      setHistory(getScoreHistory(gameType));
    },
    [gameType]
  );

  const clearHistory = useCallback(() => {
    clearScoreHistory();
    setHistory({ scores: [], stats: calculateStats([]) });
  }, []);

  const refresh = useCallback(() => {
    setHistory(getScoreHistory(gameType));
  }, [gameType]);

  return { history, addScore, clearHistory, refresh };
}
