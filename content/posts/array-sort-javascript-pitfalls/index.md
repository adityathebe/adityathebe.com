---
title: Pitfall in JavaScript's Array.prototype.sort()
date: '2021-02-09 20:45'
categories:
  - JavaScript
slug: /array-sort-javascript-pitfall
featuredImage: ./javascript-arrays-featured-img.jpg
description: Javascript has many obscure and weird behaviors. One of them is how Array.prototype.sort() functions.
---

I was recently going through the problems in LeetCode where I was faced with a problem that required sorting an array of numbers. Pretty easy, I immediately used the `.sort()` method

```javascript
const nums = [1, 9, 4, 8];
nums.sort();
console.log(nums); // [1,4,8,9]
```

I ran the code and the test passed successfully. So I submitted the code but then I got an error. My code failed to pass all the tests 😧 ! If you've done LeetCode you're probably familiar with the rage I felt at the time.

This was the test case that my code failed

```
[74, 100, 60, 98, 8, 45, 6, 59, 69, 32, 93, 9]
```

Baffled with what was going on, I ran the code on my local machine and started using the Javascript developer's greatest asset - `console.log()`.

```
[100, 32, 45, 59, 6, 60, 69, 74, 8, 9, 93, 98]
```

As soon as I saw this, I knew what was going on ! If no compare function is supplied to `.sort()` javascript coerces the array elements into strings and then sorts them in lexicographical manner. Damn it ! I knew this behavior and I still managed to fall for it.

> The sort() method sorts the elements of an array in place and returns the sorted array. The default sort order is ascending, built upon **converting the elements into strings**, then comparing their sequences of UTF-16 code units values.

### The Fix

I wrote a simple compare function to fix the bug.

```javascript
nums.sort((a, b) => a - b);

console.log(nums);
// [6, 8, 9, 32, 45, 59, 60, 69, 74, 93, 98, 100]
```
