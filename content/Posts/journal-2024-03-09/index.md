---
title: Flying with NixOS
date: '2024-03-09 14:30'
slug: /journal/8
description: My NixOS Proxmox VM is ready to fly!
contentType: journal
keywords:
  - immich
  - nixos
  - dune
  - Rust
  - http
categories:
  - nixos
  - homelab
  - rust
  - linux
  - immich
---

<div class="table-of-contents">

## Table of Contents

1. [NixOS setup progress](#nixos-setup-progress)
2. [Upgrade Immich](#upgrade-immich)
3. [Dune Two](#dune-two)
4. [Learning Rust](#learning-rust)
5. [Mapping CAPS key to CTRL](#mapping-caps-key-to-ctrl)
6. [Building an HTTP server from scratch - CodeCrafters](#building-an-http-server-from-scratch---codecrafters)

</div>

## NixOS setup progress

So I finally fixed the [previous issue](/journal/7) with NixOS. I now have a remote NixOS vm that's just sufficiently configured to do
some actual development work. I haven't really done any development yet because the VM only has 2GB of RAM and my proxmox machine is maxed out in memory.
I ran some go builds and it took a while but it was a success.

I do notice some occasional lags while I'm ssh'ing into the vm. There's about 1% packet loss which is a lot! It could be because I have 4 different wifi networks at home!

I'll try to bump the RAM this week and maybe get an ethernet dongle and that should be enough to get a good stable connection to the VM.

## Upgrade Immich

On my [homelab](https://github.com/adityathebe/homelab), I run an Immich server. It's the single most important application that I host. If you're unfamiliar with it, it's basically a self hosted Google Photos alternative.

The application is really really good but it's still in its early development phase and introduces breaking changes often. They do have very good notes on every release though and I haven't really faced any problem upgrading it so far. Except, this time I did.

For some reason, I happen to be running postgres 16 while the recommended version is 14. The recent breaking release needed me to upgrade from 14.1 to 14.2 and that's when I realized I was running the wrong version of Postgres this whole time. There where some hiccups but I don't exactly remember what it was. It had something to do with the pg_vector extension. Something about that extension was changed in the Postgres 16 release.

It took a while - about 30 minutes, I think - but I managed to get it up and running. I'm still on postgres 16 though.

## Dune Two

I watched Dune Two in theater and it was soo soo good! I had very little expectation going in since I didn't really enjoy the first one.

I had almost entirely forgotten anything about Dune. 30 minutes before the movie, I watched a YouTube refresher video and that made such a huge difference!
I rate the movie `9/10` or even `10/10` if I'm being generous. The next day I watched Dune, the first part again, and that was equally as good. I can't wait to watch the next part.

> I keep a log of all the movies I watch in [Movary](https://movies.adityathebe.com/users/adityathebe/dashboard). Check it out.

## Learning Rust

I gave Rust a shot this week. Before this, my only experience ever writing Rust was when I was applying for a role at [fly.io](https://fly.io). It was about a 100 lines of code and pretty much just unit tests.

I basically followed the official [Rust book](https://doc.rust-lang.org/book/) and got through the first 2 chapters. It was actually quite straightforward. Probably because I didn't get into the exciting part of Rust yet.

Actually, the use of traits in the guessing game chapter was confusing now that I remember it. I still don't get it but I think I'm supposed to not get it just yet.

Macros seemed really cool. I don't understand what the `println!` macro offers over a `print` function. What can that macro possibly generate at compile time that it makes it more efficient than a function? And the use of macros in [sqlx](https://github.com/launchbadge/sqlx) was mind blowing!
The fact that the library performs sql calls during compile time to guarantee that the sql queries are correct was something I had never heard before! There's so much happening during compile time and as a Go programmer, the compile time in Rust scares me.

I have heard that macros were quite complex and people don't really use it but that doesn't seem to be the case since there's a whole sql library that essentially works at the macro level. Also, [No Boilerplate](https://www.youtube.com/watch?v=MWRPYBoCEaY) seems to really love it!

## Mapping CAPS key to CTRL

I have mapped my CAPS key to the Control key. A lot of people map it to the Escape key as well. The reason behind this is that the CAPS key is much more accessible than the ctrl key; it's right below your left pinky and on the home row. Commonly used key chords like `Ctrl+C`, `Ctrl+V` are easier to press.

This is definitely going to take me some time to get used to it. In fact, I had even forgotten that I had this mapping turned on yesterday and just remembered it while writing about it.

I used `xmodmap` to setup the mapping. It required me to create a `~/.xmodmap` file with instructions for the mapping. It wasn't quite comprehensive because you need to deal with key codes and key symbols. Undoing the map was also a pain because xmodmap doesn't keep a state of the mapping.

`setxkbmap` seems to be the modern and user-friendly way of doing it. I was able to reset the mapping I had messed up using `setxkbmap -option us`.
And then the actual mapping is done using

```shell
setxkbmap -option ctrl:ctrl_modifier
```

This line goes into my `~/.xinitrc` file.

## Building an HTTP server from scratch - CodeCrafters

I came to know about CodeCrafters through [Jon Gjengset](https://thesquareplanet.com/). It has a handful of catalogs where you build popular softwares like Redis, Git, etc from scratch.

I tried the [Building HTTP server](https://app.codecrafters.io/courses/http-server/overview) course and it was quite fun. I din't really like that there were hints just below the course. I want to struggle and find the solution myself. Sometimes you just scroll down and accidentally see a comment that gives you some hint about the solution.

Besides that, the platform looks really good. I'll probably do a stream in future with one of the courses.