import { useState, useEffect } from "react";

const INITIAL_CASH = 50000;
const MAX_ROUNDS = 6;

export default function FindMarket() {
  const [gameNumber, setGameNumber] = useState(0);
  const [round, setRound] = useState(1);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [stock, setStock] = useState(0);
  const [bid, setBid] = useState<number | null>(null);
  const [ask, setAsk] = useState<number | null>(null);
  const [sizeAsk, setSizeAsk] = useState<number | null>(null);
  const [sizeBid, setSizeBid] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [actions, setActions] = useState<string[]>([]);

  const [target, setTarget] = useState<number | null>(null);
  const [lowerRange, setLowerRange] = useState<number | null>(null);
  const [upperRange, setUpperRange] = useState<number | null>(null);
  const [priceBid, setPriceBid] = useState<number | null>(null);
  const [priceAsk, setPriceAsk] = useState<number | null>(null);

  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const setupGame = () => {
    // Generate target price
    const numIter = 3;
    const multiplier = 100;
    const tolerance = Math.ceil(10 + Math.random() * 20);
    let tempTarget = 0;
    for (let i = 1; i <= numIter; i++) {
      tempTarget += Math.random() * multiplier * i;
    }
    tempTarget = Math.ceil(tempTarget);

    setTarget(tempTarget);

    setLowerRange(0);
    setUpperRange((multiplier * numIter * (numIter + 1)) / 2 + 30);

    setPriceBid(tempTarget - tolerance);
    setPriceAsk(tempTarget + tolerance);
  };

  useEffect(setupGame, [gameNumber]);

  const resetRound = () => {
    setMessage("");
  };

  const resetGame = () => {
    setGameNumber(gameNumber + 1);
    setRound(1);
  };

  const playFinalRound = () => {
    if (round !== MAX_ROUNDS + 1) {
      return;
    } else if (finalPrice == null) {
      setMessage("Please input a non-empty final price guess");
      return;
    }
    // Calculate the final score
    const priceDiff = (target ?? 0) - finalPrice;
    const portfolioValue = cash + stock * (target ?? 0);

    setMessage(
      `The actual price was ${target}. You were off by ${priceDiff}. Your final portfolio value is ${cash} + ${stock}*${target} = ${portfolioValue}.`
    );
    setRound(round + 1);
  };

  const playRound = () => {
    if (bid == null || ask == null || sizeAsk == null || sizeBid == null) {
      setMessage("Please input a non-empty bid/ask with sizes");
      return;
    } else if (bid >= ask) {
      setMessage("Your bid must be less than your ask price");
      return;
    }

    const newActions: string[] = [];
    if (priceBid !== null && bid >= priceBid) {
      setCash(cash - sizeBid * bid);
      setStock(stock + parseInt(String(sizeBid)));
      newActions.push(`${sizeBid} buys filled @${bid}`);
    } else {
      newActions.push("No bids filled.");
    }

    if (priceAsk !== null && ask <= priceAsk) {
      setCash(cash + sizeAsk * ask);
      setStock(stock - parseInt(String(sizeAsk)));
      newActions.push(`${sizeAsk} sells filled @${ask}`);
    } else {
      newActions.push("No sells filled.");
    }

    resetRound();
    setActions(newActions);
    setRound(round + 1);
  };

  const renderActions = () => {
    return actions.map((action, index) => <div key={index}>{action}</div>);
  };

  const mainControls = (
    <div id="main-controls">
      <div>
        Bid:&nbsp;
        <input
          id="bid"
          type="number"
          onChange={(e) => setBid(Number(e.target.value))}
        />
        &nbsp;Size:&nbsp;
        <input
          id="bid-size"
          type="number"
          onChange={(e) => setSizeBid(Number(e.target.value))}
        />
      </div>
      <div>
        Ask:&nbsp;
        <input
          id="ask"
          type="number"
          onChange={(e) => setAsk(Number(e.target.value))}
        />
        &nbsp;Size:&nbsp;
        <input
          id="ask-size"
          type="number"
          onChange={(e) => setSizeAsk(Number(e.target.value))}
        />
      </div>
      <button onClick={playRound}>Submit</button>
    </div>
  );

  const finalControls = (
    <div id="final-controls">
      <div>
        Guess fair price:&nbsp;
        <input
          id="final-price"
          type="number"
          onChange={(e) => setFinalPrice(Number(e.target.value))}
        />
      </div>
      <button onClick={playFinalRound}>Submit</button>
    </div>
  );

  return (
    <div>
      <div>
        Find the market price of something as precisely as possible. There are a
        total of {MAX_ROUNDS} rounds.
      </div>
      <button onClick={resetGame}>Restart</button>
      <div>
        <div>Cash: {cash}</div>
        <div>Positions: {stock}</div>
        <div>Round: {round}</div>
      </div>
      <div>
        <div>
          The price of the stock is between {lowerRange} and {upperRange}
        </div>
      </div>
      {round <= MAX_ROUNDS ? mainControls : null}
      {round === MAX_ROUNDS + 1 ? finalControls : null}
      <div id="action">{renderActions()}</div>
      <div id="message">{message}</div>
    </div>
  );
}
