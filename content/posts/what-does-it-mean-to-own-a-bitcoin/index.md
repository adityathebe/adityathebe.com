---
title: What does it mean to own bitcoins
date: '2020-01-27 22:00'
modified-date: '2020-01-27 22:00'
categories:
  - Bitcoin
slug: /what-does-it-mean-to-own-bitcoins
featuredImage: ./bitcoin.jpg
description: Learn several ways to install softwares in your linux system from using the package manager to managing the binaries.
---

The notion of owning a bitcoin can be difficult to grasp to anyone who has dealt with cash all their life.

When Bob says he has $5 we can understand that he either has a $5 bill or \$5 in his bank account.

But what does it mean when Alice says she owns 5 BTC ? Well, that's what we are gonna figure out ...

**Disclaimer: This post only deals with the techinal aspects of owning a bitcoin; not political, not economical, not legal or any other \*-cal imaginable but just the technical aspects.**

## Blockchain

The blockchain is a double-entry bookkeeping ledger. The name is derived from the fact that it is literally a linear chain of blocks. A block consists of numerous transactions. Every single bitcoin transaction that has ever happened has an entry in one the blocks in the blockchain.

The block chain is public, and anyone can download it and look through the transactions that's not just theirs but anyone else's. If I have your bitcoin address then I can see all the transactions going in and out from your address. Despite the popular belief that bitcoin is untraceable, it is actually the opposite. This is why it's a good practice to use different bitcoin address to receive transaction each time. Creating a new bitcoin address is completely free. Most wallet applications today will create a new address automatically once you receive some amount in the previous address.

The important thing to understand, for now, is just that the blockchain is a database of transactions.

> Every single bitcoin transaction that has ever happened has an entry in one the blocks in the blockchain.

## Transactions

A bitcoin transaction is just an entry in the blockchain that indicates transfer of bitcoins. A transaction comprises of a bunch of metadata which are shown below.

![Structure of a bitcoint transaction](./structure-of-a-transaction.png)
_Source: Mastering Bitcoin by Andreas Antonopolous_

Forget about all the other fields because we should mainly be concerned with `inputs` and `outputs` of a transaction. The input to a transaction is the source of funds and the output is the destination. As you can see in the image above there can be more than one inputs; sort of like two people splitting a bill in a restaurant. Likewise, there can also be more than one outputs.

Everything aligns with our understanding of transaction, doesn't it ? Not quite !

What do you think the inputs and outputs are ? Seriously, just pause, take a minute and think what those inputs and outputs are.

Obviously bitcoin addresses, right ? If Bob wants to transfer Alice 5 BTC then the input is probably Bob's bitcoin address and similarly the output is Alice's bitcoin address. If that's what you thought then you're wrong. The input and outputs are just another _transactions_.

This is where Bitcoin departs from the traditional financial system. I'll tell you why this is not quite the scenario. Recall, the blockchain is just a list of transactions. There is no such entry in the blockchain that states Bob's address has 5 BTC. To put it precisely, there's no concept of balance in Bitcoin. 

How then will any bitcoin user know what their bitcoin balance is ? You might have seen some bitcoin wallet applications that shows the balance.

![Mycelium Wallet homescreen](./mycelium-wallet.png)
*Mycelium wallet application*

Here's how it works. In order to calculate how much bitcoin an address owns you need to look through the entire blockchain for transactions that points to your address.

## The concept of value store

The blockchain is all there is when it comes to storing the data. Unlike in traditional financial system where there's probably a database that states "Mr Bob has \$X in his account", there's no such entry in the blockchain. As I mentioned before, the blockchain only consists of transactions. How then will a bitcoin owner know how many bitcoin he/she has ? Where exactly should he look

First let's understand the basic but also a very important concept in bitcoin - Transactions. When Bob wants to transfer $2 from his $5 to Alice he simply sources the \$2 from his account. In the case of Bitcoin, where does Bob source the 2 BTC from ?

There's actually no such thing as bitcoin balance. There are only UTXOs. So when BOB says he has 5 BTC what he really means is there are some UTXO that he has ownership over. IT means that BOB has the key which can unlock the UTXOs worth 5 BTC.

## Private Keys

Think of it this way - a person does not own bitcoins but instead a number does. Anyone with that number has access to that bitcoin. That number is called the "private key". So when Alice says she has 5 BTC, what she really means is that she has the private key that owns that 5 BTC. If Bob gets access to that key then he has just as equal ownership over that bitcoin.

Now it's important to realize that there may be various chunks of bitcoin that amounts to Alice's 5 BTC. For example: When Bob says he has $5 he could have five $1 bill or a single \$5 bill or may be 500 cents. In a similar manner, Alice might have 1 BTC and 4 BTC making a total of 5 BTC. It could be that both 1 BTC and 4 BTC might be owned by a single private key or two private keys. _In practice you could create any number of private keys you would want._

## The Blockchain

Now imagine a pool of bitcoins. One place that's filled with every single bitcoin in existence. That one place is called the blockchain. As of today there are more than [18 million](https://www.buybitcoinworldwide.com/how-many-bitcoins-are-there/) bitcoins in existence.

A block chain is a database of all the bitcoin transactions that has ever happened. And I mean literally every single bitcoin transactions !

A question naturally follows - in what form do bitcoins exist in the blockchain ? Are there 18 million individual bitcoins each one of them tied to a unique private key ? Well no, because you might heard some people say they own 0.1 BTC or 0.000123 BTC. A single bitcoin can be broken down into 100 million parts called Satoshi. Just like \$1 = 100 cents, 1 BTC = 100,000,000 Satoshis. 1 Satoshi is as low as you can go; You can't have 0.5 Satoshis.

Back to our question - in what form do the bitcoins exist in the blockchain ? The answer is - in chunks. Those individual chunks of bitcoin are called UTXO (Unspent transaction).

## Unspent transaction (UTXO)

Understanding transactions is the key to understanding Bitcoin. You could say that everything in the bitcoin system is designed to ensure that transactions can be created, propagated on the network, validated, and finally added to the blockchain. A bitcoin transaction, as the name suggests, is just transfer of bitcoins. But it's important to underestand how the transfers happen.

A transaction comprises of two important things - an input and output. Everyting that I have said about transaction may seem trivial until now.

When Bob wants to transfer $2 from his $5 to Alice where does he draw that money from ?

---

Most of the things that I've written in this blog post, I've learned it from the book **"Mastering Bitcoin" by Andreas Antonopolous**. It's [open sourced](https://github.com/bitcoinbook/bitcoinbook) !!

I am writing this blog post to put down in words the things that I've learned from the book and in hopes to help at least a single person who wants to learn about Bitcoin.
