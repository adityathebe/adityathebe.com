---
title: No, your sudo password is not incorrect 
date: '2024-07-18 23:50'
categories:
  - Linux
  - sudo
slug: /incorrect-sudo-password
description: sudo rejects password that is correct 
---

I've ocassionally run into this situation where I just cannot get the sudo password right no matter how many times I retry it.
Just to make sure, I carefully press one key at a time instead of typing fast in my regular pace. However, Linux still tells me
my password is incorrect!

I've also tried typing my password on a text editor where I can see what I'm typing and it's flawless everytime.
Copy pasting a valid password doesn't help either!

I've blamed my keyboard and myself for misconfiguring my linux installation for this and I used to simply restart my system.
And after a restart, it would work.

## Silently locking out the user

As it turns out, a few incorrect password attempts - I believe 3 - will lock you down for a period of time. But Linux doesn't tell you about that.
It just tells you to "try again". That's the same thing it tells you when you do provide a wrong password.

To know if you're currently locked out you need to explicitly look for it.

`faillock --user <user>`

```
~/❯ faillock --user aditya
aditya:
When                Type  Source                                           Valid
2024-07-18 11:40:33 TTY   /dev/pts/11                                          V
2024-07-18 11:40:36 TTY   /dev/pts/11                                          V
2024-07-18 11:40:38 TTY   /dev/pts/11                                          V
```

If you see a record there, that means you have been locked out.
Fortunately, you don't have to wait until the ban goes away. 
With the same command, you can lift the restriction. 


```
~/❯ faillock --user <user> --reset
```

I found it pretty surprising that it doesn't even take sudo access to unlift the ban 
(If it did, this would all be pretty useless wouldn't it?).

***

*Disclaimer: I'm on Arch (btw), and this may not be applicable to your system.*
