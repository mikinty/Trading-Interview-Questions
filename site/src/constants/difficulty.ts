import { Difficulty } from '@/types/game.types';

export interface DifficultyConfig {
  findmarket: {
    initialCash: number;
    maxRounds: number;
    tolerance: [number, number]; // [min, max] range for bid-ask spread
    priceMultiplier: number;
  };
  cardsum: {
    initialCash: number;
    numPlayers: number; // Total players including user
    opponentSkill: 'random' | 'approximate' | 'optimal';
    tradingVolume: number; // How much opponents are willing to trade
  };
  craps: {
    initialCash: number;
    opponentSkill: 'random' | 'approximate' | 'optimal';
    marketWidth: number; // How tight markets need to be for fills
  };
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 8,
      tolerance: [15, 30],
      priceMultiplier: 1,
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 2,
      opponentSkill: 'random',
      tradingVolume: 5,
    },
    craps: {
      initialCash: 5000,
      opponentSkill: 'random',
      marketWidth: 20,
    },
  },
  [Difficulty.Medium]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 6,
      tolerance: [10, 20],
      priceMultiplier: 1.5,
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 3,
      opponentSkill: 'approximate',
      tradingVolume: 10,
    },
    craps: {
      initialCash: 5000,
      opponentSkill: 'approximate',
      marketWidth: 10,
    },
  },
  [Difficulty.Hard]: {
    findmarket: {
      initialCash: 50000,
      maxRounds: 4,
      tolerance: [5, 15],
      priceMultiplier: 2,
    },
    cardsum: {
      initialCash: 10000,
      numPlayers: 4,
      opponentSkill: 'optimal',
      tradingVolume: 20,
    },
    craps: {
      initialCash: 5000,
      opponentSkill: 'optimal',
      marketWidth: 5,
    },
  },
};
