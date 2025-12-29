import { Link } from 'react-router-dom';
import { Header } from './Header';

interface GameLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function GameLayout({ title, description, children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-primary hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Games
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
