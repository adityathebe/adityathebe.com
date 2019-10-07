---
title: 'The Code behind @KuNotifier - A Twitter bot for Kathmandu University'
date: 2017-11-07 20:30:35 +0545
categories:
  - Tutorials
comments: true
slug: /kathmandu-university-twitter-bot
featuredImage: ./kunotifier.jpg
description: A twitter bot for Kathmandu University that tweets college notices on Twitter. Built with Node Js
---

The last time Kathmandu University updated its [official website's](http://ku.edu.np) layout was almost around 5 years ago. The old-fashioned website doesn't facilitate email subscription due to which students tend to miss out on important news and notices.

This time of year is a start to a new semester and every students (not the freshmans) in the college are waiting for their end semester results. The only way they can get notified about their results is by visiting the website or through friends. I have seen people who refresh the exam section page atleast a couple of dozen times a day! This is a very inconvinient and inefficient way since it takes time and if you're on mobile - an unnecessary data cost.

As a programmer I couldn't bear this and so I decided to build a bot that would notify me on every new notice published on the site.

> Disclaimer: I didn't intend to make this bot for the public but soley for my own purpose. I am not responsible if the bot fails to deliver any news.

### Deciding on how to get notified

I use a gmail chrome extension that notifies me instantly whenever I get new emails and since I am always on my browser I decided that the bot notifies me through email. This didn't go as planned due to Google's security system. It was because the bot was running on a server in United states which raised suspicion everytime the bot tried to connect with gmail's smtp server. This wasn't a huge issue to solve but I didn't bother to look for the solution.

So the obvious next way to notify was through social medias - Twitter and Facebook. In this way, not only me, but any student can take the benefit of the bot.

The bot is currently running on Twitter [@KuNotifier](https://twitter.com/KuNotifier) and on Facebok [@botlimbu](https://m.me/botlimbu). I have been running the Facebook Messenger bot for few months for learning purposes. It doesn't make facebook posts but message users directly who are subscribed to it. To subscribe, go to [https://m.me/botlimbu](https://m.me/botlimbu) and on the persistence menu click on the **"Subscribe"** option.

![Subscribe on Facebook](https://i.imgur.com/OyHBQzh.png)

### **Summarizing the process**

1. KU fortunately provides RSS feeds for its /exam and /news subdomains. The bot checks these two RSS feed every 20 minutes.
2. The result from the RSS is checked against a firebase database. If any new notice is found, tweet it and update the datbase

This is basically what the bot does ...

### **Code**

The bot is written in JavaScript and runs on a NodeJS environment.

The bot bascially has two main functions. One to get the RSS feed and the other to check for new notices in the feed.

#### 1. Reading the RSS Feed

In order to read and parse the RSS feeds, I used the NPM module called - "rss-parser". The function that gets the rss feed is named getResult. I prefer using ES6 and hence you'll find the arrow functions.

```js
const parser = require('rss-parser');
const examFeed = 'http://www.ku.edu.np/exam/?feed=rss2';
const newsFeed = 'http://www.ku.edu.np/news/rss.php?blogId=1&profile=rss20';

const getResult = callback => {
  parser.parseURL(examFeed, (err, examData) => {
    parser.parseURL(newsFeed, (err, newsData) => {
      let items = examData.feed.entries.concat(newsData.feed.entries);
    });
  });
};
```

The data we get back is an object with all the feeds in an array in its feed.entries property. The two arrays from the exam and news feed is concatenated using the _concat_ function in JavaScript. The concatenated array is stored in a variable named **"items"**. Now the elements in these array must be sorted according to the date from latest to oldest.

```js
// Sorting the array based on isoDate of each element
items = items.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
```

Great! Now just to keep things pretty I have also modified the pubDate format and added a new category property to each element of the array. This is the final code for our getResult function.

```js
const getResult = callback => {
  parser.parseURL(examFeed, (err, examData) => {
    parser.parseURL(newsFeed, (err, newsData) => {
      let items = examData.feed.entries.concat(newsData.feed.entries);

      items = items
        .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
        .map(item => {
          item.pubDate = item.pubDate
            .split(' ')
            .slice(0, 4)
            .join(' ');
          return item;
        })
        .map(item => {
          item.category = item.link
            .split('')
            .splice(21, 4)
            .join('')
            .toUpperCase();
          return item;
        })
        .slice(0, 7);

      callback(items, null);
    });
  });
};
```

#### 2. Checking against the database to look for new notices

Next I have a checkResult function that fetches data from firebase database, and compares it with the latest data fetched by getResult function. If theres any new notice, this function triggers a notification.

Let's break it down.

```js
const checkResult = () => {
  console.log('Checking New Notice');

  getResult((res, err) => {
    if (err) return console.log(err);

    db.once('value', notice => {
      // Two Arrays, one from RSS and other from Database
      let DB_Results = objToArray(notice);
      let feed_Results = res.map(el => el.title);
    });
  });
};
```

The above function uses the getResult function to get latest feed from the RSS source. After that, it fetches data from the firebase database using the db.on method. The data received from the datbase is stored in a **notice** variable. This data is an object. To convert this object into array I create a new function objToArray.

```js
function objToArray(obj) {
  let arr = [];
  for (var key in obj.val()) {
    arr.push(obj.val()[key]);
  }
  return arr;
}
```

Using this **_objToArray_** function I convert the **notice** ojbect to arrays;

```js
// Two Arrays, one from RSS and other from Database
let DB_Results = objToArray(notice);
```

To make things simpler I created a new array **fed_Results** to store only the title of each post.

```js
let feed_Results = res.map(el => el.title);
```

Great! Now we have two arrays that are identical in structure. Because of this we can easily compare them and see if any element of the array (post) differs. If there is any difference then we trigger a notification for that particular post.

Here's the full code for the **_checkResult_** function.

```js
const checkResult = () => {
  console.log('Checking New Notice');

  getResult((res, err) => {
    if (err) return console.log(err);

    db.once('value', notice => {
      // Two Arrays, one from RSS and other from Database
      let DB_Results = objToArray(notice);
      let feed_Results = res.map(el => el.title);

      // Compare Those Two Arrays
      if (JSON.stringify(DB_Results) !== JSON.stringify(feed_Results)) {
        // Find all New Indices that don't match
        res.forEach((elm, index) => {
          if (DB_Results.indexOf(elm.title) === -1) {
            // Tweet the new indices
            shortenUrl(elm.link).then(url => {
              let status = statusMaker(elm, url);
              makeTweet(Bot, status);
              sendFBMsg(status);
            });
          }
        });

        // Update Database
        clearAndStore(feed_Results);
      }
    });
  });
};
```

This is it! Now I use a setTimeout method to run the checkResult function every 20 minutes

```js
setInterval(checkResult, 1000 * 60 * 20);
```

---

### **Source Code**

Read the full source code [here](https://github.com/adityathebe/kuNotifier)
