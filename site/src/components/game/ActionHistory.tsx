import { Card } from '@components/ui/Card';

interface ActionHistoryProps {
  actions: string[];
  maxHeight?: string;
}

export function ActionHistory({
  actions,
  maxHeight = 'max-h-48',
}: ActionHistoryProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 mb-3">
        Action History
      </h3>
      <div className={`${maxHeight} overflow-y-auto space-y-1`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className="text-sm text-gray-700 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            {action}
          </div>
        ))}
      </div>
    </Card>
  );
}
