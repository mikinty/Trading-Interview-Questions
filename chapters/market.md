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

An orderbook is exactly what the name suggests -- a book of open orders for some asset.
Take the following orderbook

| Price | Volume |
|:-----:|:------:|
|105| 40000|
|104| 5000|
|103| 10000|
|102| 1000|
|101| 1000|
|-|-|
|100| 5000|
|99|  1000|
|98| 10000|
|97| 100000|

An orderbook expresses for each price, the number of people that are either buying or selling that price. The way you can tell if a price corresponds to a buy or sell price is to remember that

```text
Buy low, sell high
```

meaning that lower prices indicate buy orders, and higher prices indicate sell orders.

To equate this to something you might already do in real life, when you put in a limit order, your order will go to one of these orderbooks for a stock.

There are many analyses done about orderbooks, one common technique is called overflow, which essentially looks at the distribution of orders, and figures out what that might mean for a stock price. For example, traders like to figure out where support and resistance levels are based on where orders are parked in the book. E.g. if there is a large buy block at 97, you can say 97 is a support price.

For interviews, you don't have to know much about an orderbook other than what it is, and they will most likely explain it to you. But it's useful to have some background so you don't spend any time figuring out how an orderbook works.

## Making Markets

As a trader, you're trying to make money in the market.
One of the most fundamental skills is being able to "make markets,"
which is creating bids and asks that are favorable to you.
Favorable means making money, but determining those bid and ask
prices is not too easy. Finding a good bid and ask spread is very important, because it means you have found a spot where you can
buy low and sell high.

Some examples of questions:

- A typical example of such a question is
```text
Make a market for the temperature outside right now
```

- You have to give a buy-ask spread. The market will adjust its prices based on your actions. Here, the idea is that
  - If your bid is too high, i.e. greater than the lowest ask,
    the order will execute immediately since you fill the ask
  - If your ask is too low, i.e. lower than the highest bid,
    the order will execute immediately since you fill the bid
  - You want to find the market equilibrium as quickly as possible.
    The intuition here is that if your order gets filled too quickly
    for a bid, then you might want to lower your bid, and similarly
    for your ask.

- Another market making question is similar to above, but you are not
told how the market responds. A question might be something like
```text
Let the population of Russia be R and let the population of Estonia be E.

We are trading the spread R - E. If you have 5 buys, what orders to you place?
```