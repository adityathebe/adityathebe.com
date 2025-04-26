---
title: IP Routing in Linux
date: '2025-04-26 11:20'
categories:
  - Linux
  - Networking
slug: /ip-routing-in-linux/
description: Learn how to create and manage network namespaces in Linux
keywords:
  - Linux
  - Networking
  - Network Namespace
---

If you want to dip your feet into networking, IP routing is a good place to start.
I think it's the sweet spot because it's low level and at the same time, not very alien - we have all heard of IP addresses.
And not just that but IP routing is something that's much more applicable and relevant than starting from the very low level like the physical layer and data link layer can be a bit daunting.

In this article, we'll be covering how a linux system decides to route packets out of it.
We'll not be covering how the packets traverse the internet to reach their destination.
Although, the concepts we'll cover will apply their as well.
In short, we'll be covering the decision making process of the linux system when it needs to send out a packet.

<div class="section-notes">

Here's a question for you - Say you're connected to your home network via ethernet and also to your mobile hotspot via wifi.

You're connected to two different networks

- Your home ISP
- Mobile network operator

When you visit youtube.com, does it use the ethernet or the wifi? Would it be any different if you were to visit gmail.com?

![packet-confused-light](./packet-confused-dark.png)

</div>

This is exactly the question that we'll be covering in this article.

## Network Interface

Before we dive into ip routing, it's important to understand what network interfaces are, because it's a crucial part of routing.

Network interfaces are devices that act as a point of connection in a network. For instance: an ethernet port or a wifi interface.
An interface can also be emulated - which we call a virtual interface. Example: a loopback interface. _We'll get to that later ..._

An interface has a MAC address associated with it that is used to identify it on the network.

### Analogy

I'll use an analogy of social network to explain this.

Let's say you want to upload an image to Instagram. To do that, you need to have an Instagram account - there's no way around it.
You need an entry point to connect to the internet. Likewise, to connect to a network, you need an interface.

Your device can also have multiple network interfaces just like how you can have multiple social media accounts.
Example, your laptop most likely has an ethernet port in addition to a wifi interface.

#### Routing decision

To upload an image you would visit Instagram - to make a tweet you would visit Twitter - to send an email you would log into your email provider.
In a similar way, IP routing involves which network interface should be chosen to send out a packet.

To answer the previous question, we need a policy in place that decides whether packets destined for youtube should use the ethernet or the wifi.

## `ip` tool

In Linux systems, the `ip` tool is the primary way to interact with networking internals and lower level networking APIs.
It's part of the [`iproute2`](https://en.wikipedia.org/wiki/Iproute2) software suite. It has several commands that manage various aspects of networking. For instance:

| Command    | Description               | Formerly   |
| ---------- | ------------------------- | ---------- |
| `ip link`  | manage network interfaces | `ifconfig` |
| `ip addr`  | manage IP addresses       | `ifconfig` |
| `ip route` | manage routing table      | `route`    |
| `ip rule`  | manage routing rules      | `route`    |

There are numerous more but we'll be focusing on `route` & `addr` for this article.

Try running `ip link` to see all the interfaces on your system.

```bash
$ ip link

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 26:f4:91:9d:2c:86 brd ff:ff:ff:ff:ff:ff
    altname enp0s18
```

There's a lot of information here. I like to use the `-br` and `-c` flags to get a colored brief output.

```bash
$ ip -br -c link
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eth0             UP             26:f4:91:9d:2c:86 <BROADCAST,MULTICAST,UP,LOWER_UP>
```

I have two interfaces

- `lo` a loopback interface (virtual) with MAC address `00:00:00:00:00:00`
- and `eth0` a physical interface connected to my home ISP with MAC address `26:f4:91:9d:2c:86`

They are both active as shown by the "UP" flag inside the `<` and `>` brackets.

---

Alright, now let's get into the nitty gritty of routing.

## Relationships between rules, routes, and tables

RPDB - Routing Policy Database

## IP destination classes

- connected networks (directly reachable via network interface without any routing)
- loopback
- remote (default gateway)

## IP Route

- destination network
- interface
- gateway

```bash
ip route get 1.1.1.1
```

### Route scope

- host
- link ()
- global

## Routing Table

- local
- main (ip route uses this table by default)
- default

```bash
ip rule
```

## Routing Table Entries

Precedence

- Longest prefix match
- Metric (lowest metric wins)

## References:

- https://developers.redhat.com/blog/2018/10/22/introduction-to-linux-interfaces-for-virtual-networking#team_device
-
