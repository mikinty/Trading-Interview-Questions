# Probability

Give some primer on probability, also point to some links to learn about probability.

## Counting

Probability = # things you want / (# things total you are considering)

If you remember this, it makes probability essentially multiple countaing problems. So many people get too caught up with probability being a bunch of fractions and such. Snap out of that mindset and just think of it as 2 counting problems: 1) what you want 2) set of everything you care about.

## Basics

The most basic questions come from dice and cards, since they are relatively familiar to the general public.

Know that a deck of cards has 52 cards, 4 suits with 13 each, from A, 2, 3, ..., 10, J, Q, K. A dice has 6 sides, 1-6.

There are lots of games that use cards and dice to ask probabilities, for example 

> If I roll 2 dice, what is the probability that their sum is prime?

> If I draw 5 random cards from a standard deck, what is the probability that I draw a full house combination?

## Expected Value

Also called "EV" (pronounced Eevee like the Pokemon, also a word used as a meme among traders), expected value has a variety of meanings, but in general it has to do with a weighted probability sum of something. The formula for EV is

> E[event] = P[event_1] * event_1 + P[event_2] * event_2 + ... = \sum_{e \in possible events} P[e] * e

The reason people care about EV is that whenever you play a game, every outcome has some sort of chance attached to it, and some sort of reward. This number is useful for gauging the utility or how valuable certain courses of action are. For example, lottery tickets are known to have negative EV, because if you calculate the chances of winning and multiply them with profits, the expected profits will be less than how much it costs to buy the lotto. Therefore, this negative EV gives you an idea of the magnitude of how bad lotto tickets are.

In the trading world, a trade has some sort of EV. In general, traders want to steer towards positive EV actions and avoid negative EV actions. This way, over time, the trader will make money. Firms want their candidates to be able to accurately and quickly assess EV so they have a good chance of making the right choices on the job.

### Examples

- A classic question would be something like "Someone offers to pay you the product of a dice roll and the number value of a card drawn from a standard deck. How much should this person be charging for this game at least?"

## Recursion

If you've never seen these problems, they seem almost impossible, because
they require you to do an infinite amount of calculation.

The classic question is with the expected number flips it takes to stop playing a game where you keep flipping a fair coin if you get tails, but stop with heads. This question is pretty simple, because you can visualize as an infinite sum as

> \sum_{i = 0}^\infty i*(1/2)^i

This sum isn't too bad to solve. There are a lot of recursive sum tricks. In this case, we can take S as the sum, multiply it by 1/2 to "shift" it, and then subtract itself to end up with

> S - 1/2 * S = \sum_{i=0}^\infty i*(1/2)^i - \sum_{i=1}^\infty (i-1)*(1/2)^(i) = \sum_{i=0}^\infty (1/2)^i = 2

The next set of questions involve more recursive thinking. One such question is

> You and a friend are playing tennis, and are currently tied. You have a 1/3 chance of winning a point, and your friend has 2/3 chance of winning a point. It takes two points in a row to win the game. What is the probability that you win the game? As a twist, you can also add the condition that whenever someone has an advantage point, the person with the advantage point has a 2/3 chance, while the other person has 1/3.

You need to set up recursive equations in this case and solve for variables.
