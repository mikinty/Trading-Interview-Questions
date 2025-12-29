import { Card, Deck, Rank, Suit } from '@/types/cards.types';

/**
 * Create a standard 52-card deck
 */
export function createDeck(): Deck {
  const cards: Card[] = [];
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = [
    Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six,
    Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
  ];

  // Map ranks to values for card sum game
  const rankValues: Record<Rank, number> = {
    [Rank.Ace]: 1,
    [Rank.Two]: 2,
    [Rank.Three]: 3,
    [Rank.Four]: 4,
    [Rank.Five]: 5,
    [Rank.Six]: 6,
    [Rank.Seven]: 7,
    [Rank.Eight]: 8,
    [Rank.Nine]: 9,
    [Rank.Ten]: 10,
    [Rank.Jack]: 11,
    [Rank.Queen]: 12,
    [Rank.King]: 13,
  };

  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({
        suit,
        rank,
        value: rankValues[rank],
      });
    }
  }

  return { cards };
}

/**
 * Shuffle a deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Deck): Deck {
  const shuffled = [...deck.cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const swap = shuffled[j];
    if (temp && swap) {
      shuffled[i] = swap;
      shuffled[j] = temp;
    }
  }
  return { cards: shuffled };
}

/**
 * Deal cards to players and community
 */
export function dealCards(
  deck: Deck,
  numPlayers: number,
  cardsPerPlayer: number = 2,
  communityCards: number = 5
): {
  playerHands: Card[][];
  community: Card[];
  remaining: Card[];
} {
  const shuffled = shuffleDeck(deck);
  const cards = [...shuffled.cards];

  const playerHands: Card[][] = [];
  for (let i = 0; i < numPlayers; i++) {
    playerHands.push(cards.splice(0, cardsPerPlayer));
  }

  const community = cards.splice(0, communityCards);
  const remaining = cards;

  return { playerHands, community, remaining };
}

/**
 * Calculate sum of card values
 */
export function calculateSum(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.value, 0);
}

/**
 * Calculate expected value for unknown cards
 */
export function calculateExpectedValue(
  knownCards: Card[],
  numUnknownCards: number,
  deck?: Deck
): number {
  const allCards = deck?.cards || createDeck().cards;
  const knownValues = new Set(knownCards.map(c => `${c.suit}-${c.rank}`));

  // Filter out known cards from the deck
  const unknownCards = allCards.filter(
    card => !knownValues.has(`${card.suit}-${card.rank}`)
  );

  if (unknownCards.length === 0) return 0;

  // Calculate average value of remaining cards
  const totalValue = unknownCards.reduce((sum, card) => sum + card.value, 0);
  const avgValue = totalValue / unknownCards.length;

  return knownCards.reduce((sum, card) => sum + card.value, 0) + (avgValue * numUnknownCards);
}
