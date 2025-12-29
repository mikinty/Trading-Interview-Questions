import { Card } from '@components/ui/Card';

interface GameStatsProps {
  cash: number;
  positions?: number;
  round: number;
  maxRounds: number;
  additionalStats?: Record<string, string | number>;
}

export function GameStats({
  cash,
  positions,
  round,
  maxRounds,
  additionalStats,
}: GameStatsProps) {
  const cashClass = cash >= 0 ? 'text-success' : 'text-danger';

  return (
    <Card className="space-y-3">
      <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2">
        Game Stats
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Cash:</span>
          <span className={`font-semibold ${cashClass}`}>
            ${cash.toLocaleString()}
          </span>
        </div>

        {positions !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Positions:</span>
            <span className="font-semibold text-foreground">{positions}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Round:</span>
          <span className="font-semibold text-foreground">
            {round} / {maxRounds}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(round / maxRounds) * 100}%` }}
          />
        </div>

        {/* Additional stats */}
        {additionalStats &&
          Object.entries(additionalStats).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{key}:</span>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
      </div>
    </Card>
  );
}
