# How to Not Lose Games

Games are about winning, but what comes along winning are

1. Strategy
2. Evaluation
3. Risk assessment

## Common Games

If there is a game at a casino, you should probably generally know how it works. Some of these games are

- Blackjack
- Poker
- Roulette
- Craps

The basic idea that these games test is your ability to evaluate your chances at certain stages, how quickly you can evaluate your chances, and also if you can make the right bets at the right times.

## Sum of Cards in Play

The purpose of this game is to estimate the sum of cards in play, and make markets on them.

In this game, we define card values to be the following: A=1, 2=2, ..., J=11, Q=12, K=13

1. You and N-1 other players receive 2 cards from a standard deck of cards
2. There are 5 cards faced down in the center
3. In every round, you are allowed to sell or buy contracts on the sum of all cards in play. For example, if you think the sum of cards is around 50, you might buy 45 and sell 55.
  - In the first round, no cards are faced up yet, and there is a trading round for contracts
  - In the second round, the first face-down card in the middle is shown, and you bet again
  - You continue like this until all cards are face-up
4. At the end, you will have some net number of contracts, and some money. Your total winnings is
```
WINNINGS = CASH + LONG_POSITIONS*CONTRACT_VALUE
```

### How to Play

Interviewers are looking for your ability to evaluate what is most probable the EV of sum of cards throughout the game. For starters, an easy way to evaluate the EV of sum of cards is

```
EV = YOUR_HAND + KNOWN_CARDS + ((N-1)*2 + NUM_FACEDOWN)*(SUM_REMAINING)/NUM_UNKNOWN
```

In addition, you should also have some confidence in this measurement. What this translates to in the market making is that if you are more confident in your estimate, you might trade a smaller spread, like `45/55`, and trade a very high volume, so you can make more money. But if you are not as confident, you might do something like `EV-20/EV+20`, and trade a smaller volume.

They are also looking for how well you can make market orders with the sum of card value contract. In general, if you have more information than others, you should do better in this game. E.g. if you start with pocket Ks, then you know the total sum of cards is high, whereas your opponents probably don't, so you should be aggressively buying people's sell orders if you think they are selling too low.
