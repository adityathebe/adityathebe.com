---
title: "Seive's Algorithm To Calculate The Sum Of First Million Prime Numbers"
date: 2018-03-16 12:00:00 +0545
categories:
  - Algorithms
comments: true
featuredImage: ./prime-number-sieve.png
slug: /sum-of-first-million-prime-numbers
description: Fastest algorithm to calculate Sum of all prime numbers less than one million.
---

If you're a programmer there's a good chance that you have, at least once, written a prime detection function. This problem seems easy enough for anyone who knows what a prime number is and in fact it is ! But many of us approach it the wrong way. The most obvious way would be to make a function that classifies a number as prime or composite and then another function that loops through all the numbers say upto a million and then checks each number with the classifier function. There's nothing wrong with this but depending on the prime classifier function, calculating sum of all prime numbers upto 1 million can take anywhere from 1 second to 10 minutes ! Let me write a prime classifier function first ...

```js
const isPrimeNumber = num => {
  if (num < 2) return false;
  for (let i = 2; i < num; i += 1) {
    if (num % i === 0) return false;
  }
  return true;
};
```

Now to get the sum we loop over all numbers upto 1 million

```js
let sum = 0;
for (let i = 2; i < 1000000; i += 1) {
  if (isPrimeNumber(i)) sum += i;
}
```

Lets see what's wrong with this approach. To classify a prime number say **11**, we divide it by every numbers starting from 2 upto 10. To classify **13** we repeat the same process, divide it by every numbers starting from 2 to 12. You can see where this is going. As the number increases, each classification will take more time than the previous one. In CS term the Big O of this approach is O(n<sup>2</sup>) which is really really bad for an algorithm.

### Optimization

We can optimize this by not classifying even numbers, except _2_, since they are for sure not prime. By increasing the counter up by **2** in the two _for_ loops we can ignore all the even numbers. That would decrease the processing time by half. But that's still way off from being a good algorithm.

We can further optimize by taking divisors upto the square root of _num_. In our _for_ loop in _checkPrime_ function the loop should only continue up to _&radic;num_. We have now significantly decreased the amount of divisors but this is still not good for large value of N.

---

## Primality Test

There's another much better way to classify a number as prime - the **"Primality Test Algorithm"**. This algorithm does not give prime factors but only state whether the input number is prime or not. Hence there's much less computation to do.

```js
const primality = num => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) {
      return false;
    }
    i = i + 6;
  }
  return true;
};
```

I used both the algorithms to classify the 50 millionth prime number **982,451,653** and the result was:

```bash
# first Algorithm: 2952.744ms
# primality: 0.527ms
```

Similary, I used those two algorithms to get the sum of all primes below 1 million and this was the result

```js
console.time('runtime');
for (let i = 0; i < 1000000; i++) {
  if (isPrimeNumber(i)) {
    sum += i;
  }
}
console.timeEnd('runtime');
```

```bash
# First algorithm : 705403.287ms // About 11 minutes
# Using Primality algorithm : 117.574ms
```

Wot !! That's a massive performance gain if you ask me. Primality Test is in fact considered to be the fastest prime detection algorithm. But wait there's another even better algorithm for this type of prime calculations. This next algorithm gets the same result in just 50ms.

## Sieve's Algorithm

The **Sieve of Eratosthenes** is a simple, ancient algorithm to find all the prime numbers that are less than a given number. This algorithm cannot directly classify a number **X** as prime or composite but will generate list of all prime numbers that are less than **X**.

![Sieve's Algorithm](https://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)_Sieve's Algorithm_

Here's how it works. Let's say we need to get all the prime numbers upto a number **N**.

**Step 1:** We generate an array of numbers starting from 2 to N-1. So now we have N-2 elements in the array.

**Step 2:** Then all the elements of the array are set to boolean value **TRUE**. True means they are prime (_yet_). But as we proceed we'll have many False values. It's analogous to how we filter out unwanted particles using a sieve. At first all of them are in the sieve machine (set to True) and then at last only the required particles (prime numbers) are present.

![Sieving](./sieve.jpg)_Source: www.tigtagcarolina.com_

**Step 3:** Now starting from the 2nd index of the array to the last, we remove the multiples of the number. But first we need to check if the current number ( _or index of array_ ) is _TRUE_ of false. If the value is _TRUE_, we calculate its multiple and if it's false we don't.

So what do we do once we find the multiples? We set the boolean value of that index to **FALSE**. Don't worry if this sounds confusing right now ( _I'm not very good at explaining_ ) but this example will clear up everything - I promise!

_Example_: We start with 2nd index of the array (_everytime_). Its value in the array is _TRUE_. Hence we proceed to calculate its multiples i.e. 4, 6, 8, 10, 12, ... in the array and set them to false. Then we get to 3. Again, the value in the 3rd index is _TRUE_ and so we proceed in a similar manner setting all the multiple of 3 i.e. 9, 12, 15, 18, ... to false. Now comes 4. But remember the 4th index is already set to false since it was one of the multiples of 2. So we do not need to find its multiples. We keep proceeding in this manner until the end.

Notice that I didn't include 6 in the multiples of 3. It so happens that, for a number n we can start counting its multiple from n^2. Example: for n = 5, we do not need to look for 10, 15, 20. These numbers are already cut out by previous numbers and excluding them will save a tiny bit of processing time.

**Step 4:** Now we have an array with mixed values of True and False. True indicates that the number is a prime and false indicates the number isn't prime. We loop through the array and add the index value whose value is set to True. And finally we will have the sum of all required Primes.

```js
// Eratosthenes algorithm to find all primes under n
const eratosthenes = n => {
  let array = [];
  let output = [];
  let upperLimit = Math.sqrt(n);

  // We need to make an array from 2 to (n - 1)
  // For easy indexing we add extra two elements 0, 1 hence the length = n
  for (let i = 0; i < n; i++) {
    array.push(true);
  }

  // Remove multiples of primes starting from 2, 3, 5,...
  for (let i = 2; i <= upperLimit; i++) {
    if (array[i]) {
      for (let j = i * i; j < n; j += i) {
        array[j] = false;
      }
    }
  }

  // All array[i] set to true are primes
  sum = 0;
  for (let i = 2; i < n; i++) {
    if (array[i]) {
      sum += i;
    }
  }

  return sum;
};
```

### Downside of Sieve's Algorithm

You must have probably guessed the problem with this algorithm. Yes, it's the memory consumption! For N = 1million we need an array of size 1million! In Node for large values of N, we see the classic javascript error - " **heap out of memory** ". But Node can easily handle upto N = 50 million.

```bash
<--- JS stacktrace --->

==== JS stack trace =========================================

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

If you've read this far I hope you enjoyed it :)
