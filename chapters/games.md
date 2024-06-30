# How to Not Lose Games

Trading is really just a game, where your PnL is your score. So naturally, trading firms want to know, how good are you at playing?
Some factors they may observe from you are:

1. **Performance**: How well did you do?
2. **Strategy**: Did you have some sort of technique / plan?
3. **Evaluation**: Every turn, how were you weighing your potential next options?
4. **Risk assessment**: Do you have any risks that you need to worry about?
5. **Competitiveness**: Do you want to win? How much do you want it?
6. **Behavior**: Some interviewers may literally be shouting at you while you play a game, like a real trading desk scenario. Are you able to keep calm? Are you able to answer questions under pressure? How do you handle stress?

## Common Games

If there is a game at a casino, you should probably generally know how it works. Some of these games are

- Poker
- Roulette
- Craps
- Blackjack

The basic idea that these games test is your ability to evaluate your chances at certain stages, how quickly you can evaluate your chances, and also if you can make the right bets at the right times. You will probably get a variation on one of the games above, so if you know how the popular casino games work, you will have less confusion understanding the game they are presenting to you.

## Sum of Cards in Play

The purpose of this game is to estimate the sum of cards in play, and make markets on them.

In this game, we define card values to be the following: `A=1, 2=2, ..., J=11, Q=12, K=13`

1. You and `N-1` other players receive 2 cards from a standard deck of cards
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

## Other Games

- [Jane Street has a great example of how an interview might go with a game](https://youtu.be/NT_I1MjckaU)
- [Jane Street's Figgie](https://www.figgie.com/): This is a game you might play during an onsite interview
- Some firms may give you poker situations, e.g. your chip stack, other people's chips, your hand, and cards in play, and ask you how you would play (bet, how much, how to respond to other people's actions)
