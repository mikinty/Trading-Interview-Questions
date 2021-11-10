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
