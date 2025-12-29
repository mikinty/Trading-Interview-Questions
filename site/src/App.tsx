import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-foreground">
          Trading Games
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Practice market making, probability, and trading skills
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/findmarket"
            className="group block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-3 text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Find the Market
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We'll give you a big range, but using bid-ask spreads, you have to
              find the market as accurately as possible, while avoiding losses.
            </p>
          </Link>

          <Link
            to="/cardsum"
            className="group block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-3 text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Sum of Cards
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              A game where you make a market on what you think the sum of cards in
              play is. The catch is -- you don't see all the cards!
            </p>
          </Link>

          <Link
            to="/craps"
            className="group block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-3 text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Craps with Bonus
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Play this classic casino game, except with a bonus stage where you
              can make markets on the outcome!
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
