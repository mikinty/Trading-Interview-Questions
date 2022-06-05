import * as React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div id="App">
      <h1>Trading Games</h1>
      <div id="games-container">
        <div className="game">
          <Link to="/findmarket" className="game-title">
            Find the Market
          </Link>
          <div className="description">
            We'll give you a big range, but using bid-ask spreads, you have to
            find the market as accurately as possible, while avoiding losses.
          </div>
        </div>
        <div className="game">
          <Link to="/cardsum" className="game-title">
            Sum of Cards
          </Link>
          <div className="description">
            A game where you make a market on what you think the sum of cards in
            play is. The catch is -- you don't see all the cards!
          </div>
        </div>
        <div className="game">
          <Link to="/craps" className="game-title">
            Craps with bonus
          </Link>
          <div className="description">
            Play this classic casino game, except with a bonus stage!
          </div>
        </div>
      </div>
    </div>
  );
}
