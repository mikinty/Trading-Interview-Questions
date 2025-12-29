import { Link } from 'react-router-dom';
import { Header } from '@components/layout/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
              Trading Games
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Practice market making, probability, and trading skills
            </p>
          </div>

          {/* Game cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Link
              to="/findmarket"
              className="group block p-6 bg-card border-2 border-border rounded-xl hover:shadow-xl hover:border-primary transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                  📈
                </div>
                <h2 className="text-2xl font-bold text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Find the Market
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Use bid-ask spreads to discover the true market price. Balance risk and information across multiple rounds.
              </p>
              <div className="flex items-center text-sm text-primary font-medium">
                Play Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/cardsum"
              className="group block p-6 bg-card border-2 border-border rounded-xl hover:shadow-xl hover:border-primary transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                  🃏
                </div>
                <h2 className="text-2xl font-bold text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Sum of Cards
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Make markets on card sums with hidden information. Calculate expected values and trade against AI opponents.
              </p>
              <div className="flex items-center text-sm text-primary font-medium">
                Play Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/craps"
              className="group block p-6 bg-card border-2 border-border rounded-xl hover:shadow-xl hover:border-primary transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                  🎲
                </div>
                <h2 className="text-2xl font-bold text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Craps Betting Board
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Identify +EV bets quickly under time pressure.
              </p>
              <div className="flex items-center text-sm text-primary font-medium">
                Play Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Info section */}
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Master Trading Concepts Through Practice
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              These interactive games help you develop intuition for market making, probability estimation, and risk management. Track your progress, adjust difficulty levels, and improve your trading skills through hands-on experience.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Part of the{' '}
            <a
              href="https://github.com/mikinty/Trading-Interview-Questions"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Trading Interview Questions
            </a>
            {' '}project
          </p>
        </div>
      </footer>
    </div>
  );
}
