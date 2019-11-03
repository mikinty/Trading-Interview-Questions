# Traditional Market Theory

Most trading companies will say that you don't _have to_ know anything about real trading,
but let's be honest, if you don't got the slightest idea of what an orderbook is or what
a contract is, your shot of landing the trading role is going to be much lower.

## Contracts

A contract is exactly what it intuitively sounds like -- an agreement between two parties
to do something. In the trading world, the most common contract is something in the form of

```text
Buy/Sell X amount of Y at price Z by date D
```

The reason these agreements are worth any money is that they represent some guaranteed power.
Take the following contract (this is an option btw)

```text
Buy 100 shares of SPY at $400 by 12/1/2020
```

Let's say I have this contract, and on 9/1/2020, SPY reaches a price of $432. Because I have
this contract, I now have the right to buy SPY at $400 -- that's FREE MONEY! So because
I own this contract, I have the right to SPY at some predetermined price. On the other hand,
if SPY never reaches $400 at any time before 12/1/2020, then the contract is useless and I 
can't do anything with it. This _potential_ to purchase SPY is what gives this contract value.
One very important properties of a contract is figuring out how much it is worth, which depends
on a variety of factors, mostly related to risk and potential profits.

On the theme of "anyone can become a trader," companies usually won't ask you a real life market
contract like an option, but they will usually either

1. __Dumb it down__: Give you something like here's a contract with 4 possibilities
2. __Use a contract in another context__: They might play a game, like guessing the sum of 3 dice rolls,
   and make contracts about payouts for certain sums.

The questions they will usually ask for contracts are:

1. What is the EV of the outcome?
2. How much would you pay for the contract?
3. If the game was more/less risky, how would that change the contract?
4. What is a contract you would buy/sell in this scenario?

The general gist is they want to know how you evaluate certain scenarios and manage risk.
As a general rule, trading firms prefer to consistently make money, small or large, rather
than have the potential to lose any amount of money. This means they are more on the conservative
side of risk management, which they usually call being "risk neutral." You as a trader should
strive to not be too risky as well, because stretching yourself into too much risk is
almost always a losing strategy.

## Orderbooks