import { Card as CardType, Suit } from '@/types/cards.types';

interface PlayingCardProps {
  card: CardType;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayingCard({
  card,
  faceDown = false,
  size = 'md',
}: PlayingCardProps) {
  const sizeClasses = {
    sm: 'w-12 h-16 text-sm',
    md: 'w-16 h-24 text-base',
    lg: 'w-20 h-30 text-lg',
  };

  const isRed =
    card.suit === Suit.Hearts || card.suit === Suit.Diamonds;
  const colorClass = isRed ? 'text-red-600' : 'text-gray-900';

  const suitSymbols = {
    [Suit.Hearts]: '♥',
    [Suit.Diamonds]: '♦',
    [Suit.Clubs]: '♣',
    [Suit.Spades]: '♠',
  };

  if (faceDown) {
    return (
      <div
        className={`
          ${sizeClasses[size]}
          bg-gradient-to-br from-blue-600 to-blue-800
          border-2 border-blue-900
          rounded-lg
          flex items-center justify-center
          shadow-md
        `}
      >
        <div className="text-white text-2xl">🂠</div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-gray-100
        border-2 border-gray-300 dark:border-gray-400
        rounded-lg
        p-1
        shadow-md
        flex flex-col items-center justify-between
      `}
    >
      <div className={`font-bold ${colorClass}`}>
        <div>{card.rank}</div>
        <div className="text-center">{suitSymbols[card.suit]}</div>
      </div>
      <div className={`text-2xl ${colorClass}`}>{suitSymbols[card.suit]}</div>
      <div className={`font-bold ${colorClass} transform rotate-180`}>
        <div className="text-center">{suitSymbols[card.suit]}</div>
        <div>{card.rank}</div>
      </div>
    </div>
  );
}
