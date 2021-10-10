import React from "react";

/**
 * This is the highest level of the web app.
 */
class App extends React.Component {
  render() {
    return (
      <div id="App">
        <h1>Trading Games</h1>
        <div id="games-container">
          <div className="game">
            <div className="game-title">
              Sum of Cards
            </div>
            <div className="description">
              A game where you make a market on what you think the sum of cards
              in play is. The catch is -- you don't see all the cards!
            </div>
          </div>
          <div className="game">
            <div className="game-title">
              Craps with bonus
            </div>
            <div className="description">
              Play this classic casino game, except with a bonus stage!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
