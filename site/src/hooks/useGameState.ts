import { useState, useCallback } from 'react';
import { BaseGameState, GameScore } from '@/types/game.types';
import { useScoreHistory } from './useScoreHistory';
import { useDifficulty } from './useDifficulty';

export function useGameState<T extends BaseGameState>(
  initialState: T,
  gameType: 'findmarket' | 'cardsum' | 'craps'
) {
  const [state, setState] = useState<T>(initialState);
  const { addScore } = useScoreHistory(gameType);
  const { difficulty, config } = useDifficulty(gameType);

  const reset = useCallback(() => {
    setState({
      ...initialState,
      gameNumber: state.gameNumber + 1,
      difficulty,
    } as T);
  }, [initialState, state.gameNumber, difficulty]);

  const saveGame = useCallback(
    (finalScore: number, metadata?: Record<string, unknown>) => {
      const score: GameScore = {
        id: `${gameType}-${Date.now()}`,
        gameType,
        timestamp: Date.now(),
        difficulty: state.difficulty,
        finalScore,
        rounds: state.round,
        metadata,
      };
      addScore(score);
    },
    [gameType, state.difficulty, state.round, addScore]
  );

  return {
    state,
    setState,
    reset,
    saveGame,
    difficulty,
    config,
  };
}
