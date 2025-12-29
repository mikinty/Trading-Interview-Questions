import { useState, useCallback } from 'react';
import { Difficulty } from '@/types/game.types';
import { DIFFICULTY_CONFIGS } from '@constants/difficulty';

type GameType = 'findmarket' | 'cardsum' | 'craps';

export function useDifficulty(gameType: GameType) {
  const [difficulty, setDifficultyState] = useState<Difficulty>(() => {
    const saved = localStorage.getItem(`difficulty-${gameType}`);
    if (saved && Object.values(Difficulty).includes(saved as Difficulty)) {
      return saved as Difficulty;
    }
    return Difficulty.Medium;
  });

  const config = DIFFICULTY_CONFIGS[difficulty][gameType];

  const changeDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficultyState(newDifficulty);
      localStorage.setItem(`difficulty-${gameType}`, newDifficulty);
    },
    [gameType]
  );

  return {
    difficulty,
    config,
    changeDifficulty,
  };
}
