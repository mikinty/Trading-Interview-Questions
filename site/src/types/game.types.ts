export enum GamePhase {
  Setup = 'setup',
  Playing = 'playing',
  Finished = 'finished',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export interface BaseGameState {
  gameNumber: number;
  round: number;
  maxRounds: number;
  cash: number;
  phase: GamePhase;
  difficulty: Difficulty;
  message: string;
  actions: string[];
}

export interface GameScore {
  id: string;
  gameType: 'findmarket' | 'cardsum' | 'craps';
  timestamp: number;
  difficulty: Difficulty;
  finalScore: number;
  rounds: number;
  metadata?: Record<string, unknown>;
}

export interface GameHook<T extends BaseGameState> {
  state: T;
  actions: {
    reset: () => void;
    setDifficulty: (difficulty: Difficulty) => void;
  };
}
