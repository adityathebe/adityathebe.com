---
title: Number of lines of code in my website
date: '2021-04-03 18:30'
slug: /journal/3
description: My website apparently has fewer lines of code than I expected
keywords:
  - swapfiles on linux
  - lines of code in a project
  - X clipboard
categories:
  - linux
  - swap-files
  - cli
  - x11
---

<div class="table-of-contents">

## Table of Contents

1. [Swapfiles to the rescue](#swapfiles)
2. [Number of lines in a git repo](#cloc)
3. [Copy image from X clipboard to file](#x-clipboard-image)

</div>

## Swapfiles to the rescue <a name="swapfiles"></a>

At my new job, I need to work on a massive project which is very demanding. I've been rocking an 8GB RAM since forever but the time had finally come to give it an upgrade. My system would just crash due to unavailable memory. I couldn't upgrade RAM as the stores were closed on weekends. My time was ticking, since I am to complete 40hrs of work a week, and I wasn't even able to run the project.

Fortunately for me, I could add swapfiles to act as virtual memory. I had completely forgotten about this and was waiting like an idiot for shops to open the next day.

A downside of using a swapfile on an SSD is that SSDs have a limited lifespan. Every write (but not read) cycle (or more accurately every erasure) wears a memory cell, and at some point it will stop working.

As always, the Arch wiki had all the [instructions to create a swapfile](https://wiki.archlinux.org/index.php/swap). My system was still pushing the 6GB swapfile, I had created, to its limits. And since I'd be running multiple users at once, I decided to opt for 32GB of RAM. Quite an upgrade!

## Number of lines in a git repo <a name="cloc"></a>

I was curious to see how many lines of Go code our project had. There were lots of possible solutions but the one that I liked the most was using the [CLoC - Count Lines of Code](https://github.com/AlDanial/cloc) CLI tool.

What's nice about CLoC is that it can differentiate a real line of code from a comment or a blank line. It can also determine the lines of codes in a specific programming language. So if you have a project using multiple programming languages, then CLoC can help you get the LOC of just JavaScript code.

I ran CLoC on the code running this website and this was the result

```
❯ cloc --exclude-dir=node_modules,public,.cache .
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JSON                             2              0              0          45005
Markdown                        20            769              0           1602
JavaScript                      21             97             33           1020
CSS                              9            116             27            604
YAML                             6             36              0            204
-------------------------------------------------------------------------------
SUM:                            58           1018             60          48435
-------------------------------------------------------------------------------
```

I'm excluding the `node_modules` directory for obvious reason and also the `public` directory which is the build files along with the `.cache` directory which is the build cache.

The high number of JSON code is due to the `package-lock.json` file.

## Copy image from X clipboard to a file <a name="x-clipboard-image"></a>

I use Flameshot to instantly take screenshots and then copy them to my X clipboard. I have configured a key binding on SXHKD like this

```bash
super + shift + s
  flameshot gui -p ~/Pictures/Screenshots/
```

And with that, I can simply copy & paste the images to apps like Telegram or web apps on a Browser. This makes it really simple and fast as I don't need to save the image to a file and then browse the files to select the image.

But I want to copy those images, on the clipboard, to a file and the GUI file manager that I'm using, PCMan File Manager, doesn't support it.

I use xclip to manage my clipboards and it has a command to stream the image on the clipboard

```bash
xclip -selection clipboard -t image/png -o > image.png

# Shorter
xclip -sel clip -t image/png -o > image.png
```

Now, I can just add a shell alias and conveniently copy the image to a file

```bash
alias cpimg="xclip -selection clipboard -t image/png -o"

cpimg > myimg.png
```

Moreover, if you're using a TUI FM like Ranger or NNN you can easily setup key bindings for this.

## References

- https://wiki.archlinux.org/index.php/swap
- https://askubuntu.com/questions/652337/why-are-swap-partitions-discouraged-on-ssd-drives-are-they-harmful
- https://github.com/AlDanial/cloc#install-via-package-manager
- https://unix.stackexchange.com/questions/145131/copy-image-from-clipboard-to-file
