import { Card } from '@/types/cards.types';
import { PlayingCard } from './PlayingCard';

interface HandProps {
  cards: Card[];
  label?: string;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Hand({ cards, label, faceDown = false, size = 'md' }: HandProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {cards.map((card, index) => (
          <PlayingCard key={index} card={card} faceDown={faceDown} size={size} />
        ))}
      </div>
    </div>
  );
}
