import { Difficulty } from '@/types/game.types';
import { Select } from '@components/ui/Select';

interface DifficultySelectProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export function DifficultySelect({
  value,
  onChange,
  disabled = false,
}: DifficultySelectProps) {
  const options = [
    { value: Difficulty.Easy, label: 'Easy' },
    { value: Difficulty.Medium, label: 'Medium' },
    { value: Difficulty.Hard, label: 'Hard' },
  ];

  return (
    <Select
      label="Difficulty"
      options={options}
      value={value}
      onChange={(val) => onChange(val as Difficulty)}
      disabled={disabled}
    />
  );
}
