---
title: Pacman for newbies
date: '2023-01-19 13:45'
categories:
  - Linux
slug: /pacman-for-newbies
featuredImage: ./pacman.jpg
description: A list of commonly used commands for the Pacman package manager.
---

### Who this post is for

- Users who are new to `pacman`
- Someone who wants to see what other pacman users regularly use

### What this post isn't

- Principle of pacman design
- Detail explanation of the commands
- Replacement of the documentation (duh!)

Everything in this post can of course be found easily using `pacman --help`. But that's a documentation. It has a lot more than you'd ever need. This post will help you filter out the few good stuff (_read: regularly used_) from the vast documentation.

Here's a list of commands I personally use. I never had the need to use anything more than what's listed here.

## The Basics

1. Upgrade local packages

```sh
sudo pacman -Syu
```

This command is probably the most used pacman command by quite some distance. It does 2 things

- downloads a fresh package list.
- upgrades all the installed pacakges that are out of date.

> Pacman keeps a local copy of the package list in the system, so it doesn't have to download the list every time you run a command. The -y flag forces pacman to download a fresh copy of the package list from the repositories.

2. Install packages

```sh
sudo pacman -S <package-name>
```

3. Search for packages

```sh
sudo pacman -Ss <package-name>
```

4. Remove packages

```sh
sudo pacman -Rns <package-name>
```

5. Clean cache

```sh
sudo pacman -Sc
```

</br>

## Still basics but rarely used

These are a list of commands that you probably wouldn't use on a daily basis.

1. List all packages that are no longer required

```sh
pacman -Qdt
```

2. Remove all packages that are no longer required

```sh
sudo pacman -Rns $(pacman -Qdtq)
```

3. Info of a package

```sh
pacman -Qi <package-name>
```

I use this command to look for a few things

- packages that require this package
- packages this package require
- whether it was installed explicitly

```sh
❯ pacman -Qi seahorse
...
Depends On      : gtk3  gcr  ...
Required By     : None
Install Reason  : Explicitly installed
```

4. List all the packages installed in your system

```sh
pacman -Q

# To get the count
pacman -Q | wc -l
```

5. List packages that were explicitly installed

```sh
pacman -Qe
```

Packages come with dependencies. This is will only list those packages that you explicitly installed.

6. List all the packages installed from aur

Not possible. But you can get a close to accurate result with

```sh
pacman -Qm
```

## Thanks

- Photo by https://medium.com/@aliakbarzohour/use-pacman-in-arch-linux-and-manjaro-c987e4a0da66
