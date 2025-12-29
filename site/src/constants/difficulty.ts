import { Difficulty } from '@/types/game.types';

export interface DifficultyConfig {
  findmarket: {
    initialCash: number;
    maxRounds: number;
    tolerance: [number, number]; // [min, max] range for bid-ask spread
    priceMultiplier: number;
    priceMovement: 'static' | 'random' | 'adversarial'; // How the target price moves
    rangeVariation: number; // Randomness in upper/lower range bounds
    description: string; // Description of difficulty behavior
  };
  cardsum: {
    initialCash: number;
    numPlayers: number; // Total players including user
    opponentSkill: 'random' | 'approximate' | 'optimal';
    tradingVolume: number; // How much opponents are willing to trade
  };
  craps: {
    initialCash: number;
    timerSeconds: number | null; // null = infinite, number = countdown timer
    minTimer?: number; // For random timer (hard mode)
    maxTimer?: number; // For random timer (hard mode)
    marketType: 'random' | 'mixed' | 'bear'; // bear = all bad payouts
  };
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 12,
      tolerance: [15, 30],
      priceMultiplier: 1,
      priceMovement: 'static',
      rangeVariation: 50,
      description: 'Target price stays constant. Good for learning the mechanics.',
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 2,
      opponentSkill: 'random',
      tradingVolume: 5,
    },
    craps: {
      initialCash: 10000,
      timerSeconds: null, // Infinite time
      marketType: 'random', // Some good, some bad payouts
    },
  },
  [Difficulty.Medium]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 12,
      tolerance: [10, 20],
      priceMultiplier: 1.5,
      priceMovement: 'random',
      rangeVariation: 100,
      description: 'Target price moves randomly each round, independent of your bids/asks.',
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 4,
      opponentSkill: 'approximate',
      tradingVolume: 10,
    },
    craps: {
      initialCash: 10000,
      timerSeconds: 10, // 10 second timer
      marketType: 'mixed', // Mostly bad, occasional good payouts
    },
  },
  [Difficulty.Hard]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 12,
      tolerance: [5, 15],
      priceMultiplier: 2,
      priceMovement: 'adversarial',
      rangeVariation: 150,
      description: 'Target price moves adversarially to exploit wide or one-sided markets.',
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 4,
      opponentSkill: 'optimal',
      tradingVolume: 20,
    },
    craps: {
      initialCash: 10000,
      timerSeconds: 5, // Base timer (will be overridden by random)
      minTimer: 2, // Random timer range
      maxTimer: 5,
      marketType: 'bear', // All bad payouts (bear market)
    },
  },
};
