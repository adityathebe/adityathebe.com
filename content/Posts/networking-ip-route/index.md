---
title: IP Routing in Linux
date: '2025-04-27 14:45'
categories:
  - Linux
  - Networking
featuredImage: ./packet-confused-light.png
slug: /ip-routing-in-linux/
description: Learn how a linux system decides to route packets out of it
keywords:
  - Linux
  - Networking
---

If you're looking to dip your toes into networking, IP routing is a great place to start.
I think it's the sweet spot because it's low level and at the same time, not very alien - we have all heard of IP addresses.
And not just that but IP routing is something that's much more applicable and relevant than starting from the very low level like the physical layer and data link layer.

In this article, we'll be covering how a linux networking stack decides to route packets out of it.
We'll not be covering how the packets traverse the internet to reach their destination.
Although, the concepts we'll cover will apply there as well.

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

<div class="table-of-contents">

- [Network Interface](#network-interface)
  - [Virtual interfaces](#virtual-interfaces)
- [ip tool](#ip-tool)
  - [View all interfaces on your system](#view-all-interfaces-on-your-system)
  - [View IP addresses of all network interfaces](#view-ip-addresses-of-all-network-interfaces)
- [IP destination types](#ip-destination-types)
- [A. Route](#a-route)
  - [ip route](#ip-route)
  - [Default Gateway](#default-gateway)
  - [Query the route for a destination](#query-the-route-for-a-destination)
  - [Adding a new route](#adding-a-new-route)
- [B. Routing Table](#b-routing-table)
  - [local routing table](#local-routing-table)
  - [main routing table](#main-routing-table)
  - [default routing table](#default-routing-table)
- [C. Rule](#c-rule)
  - [Routing Policy Database (RPDB)](#routing-policy-database-rpdb)
- [Things we didn't cover](#things-we-didnt-cover)
- [References](#references)

</div>

## Network Interface

Before we dive into ip routing, it's important to understand what network interfaces are as they are a crucial part of routing.

Network interfaces are devices that act as a point of connection in a network. They are the component that connect your device to a network. It's through them traffic flows in and out of your device.
An interface has a MAC address associated with it that is used to identify it on the network.

For instance: an ethernet port or a wifi interface.

### Virtual interfaces

An interface can also be emulated. These virtual interfaces are mainly used in Virtual machines, Containers, VPNs, and in software development.
Examples:

- **lo** loopback interface (127.0.0.1 aka localhost)
- **docker0** interface (used by docker containers)
- **tailscale0** interface (used by tailscale)
- **wg0** interface (used by wireguard)
- **veth** interface (used by virtual ethernet pair)

<div class="section-notes">

### Analogy to understand network interfaces

I'll use an analogy of social network to explain this.

Let's say you want to upload an image to Instagram. To do that, you need to have an Instagram account - there's no way around it.
You need an entry point to connect to the Instagram world. Likewise, you need an interface to connect to a network.

#### Multiple interfaces

You can have multiple social media accounts to connect to different social networks.
Likewise, your device can also have multiple network interfaces to connect to different networks.
Example, your laptop most likely has an ethernet port in addition to a wifi interface.

#### Routing decision

To upload an image you would visit Instagram - to make a tweet you would visit Twitter - to send an email you would log into your email provider.
In a similar way, IP routing involves which network interface should be chosen to send out a packet.

---

Pretty cheesy analogy? I think so too. Nonetheless, I think it does help a little.

Now, to answer the previous question, your device needs a policy to decide whether to use the ethernet interface or the wifi interface to reach a destination like YouTube.

</div>

## `ip` tool

In Linux systems, the `ip` tool is the primary way to interact with networking internals and lower level networking APIs.
It's part of the `iproute2` software suite. It has several commands that manage various aspects of networking. For instance:

| Command    | Description               |
| ---------- | ------------------------- |
| `ip link`  | manage network interfaces |
| `ip addr`  | manage IP addresses       |
| `ip route` | manage routing table      |
| `ip rule`  | manage routing rules      |

There are numerous more but these are the ones we'll be focusing on for this article.

### View all interfaces on your system

Try running `ip link` to see all the interfaces on your system. My Linux desktop has 2 physical interfaces and they are connected to different networks.

```bash
$ ip link

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp5s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether d8:43:ae:45:c5:62 brd ff:ff:ff:ff:ff:ff
    altname enxd843ae45c562
3: wlo1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DORMANT group default qlen 1000
    link/ether f0:20:ff:21:57:cd brd ff:ff:ff:ff:ff:ff
    altname wlp0s20f3
    altname wlxf020ff2157cd
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default
    link/ether ea:d5:3b:18:3f:ad brd ff:ff:ff:ff:ff:ff
```

There's a lot of information here. I like to use the `-br` and `-c` flags to get a colored brief output.

```bash
$ ip -br -c link
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
enp5s0           UP             d8:43:ae:45:c5:62 <BROADCAST,MULTICAST,UP,LOWER_UP>
wlo1             UP             f0:20:ff:21:57:cd <BROADCAST,MULTICAST,UP,LOWER_UP>
docker0          DOWN           ea:d5:3b:18:3f:ad <NO-CARRIER,BROADCAST,MULTICAST,UP>
```

I have 4 interfaces

- `lo` a loopback interface (virtual). It's purely virtual and doesn't have a MAC address.
- `enp5s0` a physical interface connected to my home ISP with MAC address `d8:43:ae:45:c5:62`
- `wlo1` a wifi interface with MAC address `f0:20:ff:21:57:cd`
- `docker0` a virtual interface used by docker containers with MAC address `ea:d5:3b:18:3f:ad`

They are all enabled as shown by the "UP" flag inside the `<` and `>` brackets.

### View IP addresses of all network interfaces

To view the IP addresses associated with the interfaces, use `ip addr` command.

```bash
$ ip -br -c addr
lo               UNKNOWN        127.0.0.1/8 ::1/128
enp5s0           UP             10.99.99.65/24 fe80::14ad:a0eb:c8f:c5b0/64
wlo1             UP             192.168.254.3/24 fe80::5fd6:c815:261b:5df7/64
docker0          DOWN           172.17.0.1/16
```

As you can see, the wifi interface (wlo1) and ethernet interface (enp5s0) are connected to two different networks as they have IP addresses on different subnets - `10.99.99.0/24` and `192.168.254.0/24`.

## IP destination types

Finally, one last thing to keep in mind is the different types of destinations.

A networking device must be aware of

- its own IP addresses
- addresses that are directly reachable
- and the rest.

By **directly reachable** we mean the destination is on the same network as your device. No routing is involved here.
Your device will use ARP to find the MAC address of the destination and send the packet directly to it.

For any other destination, the packet will be sent to a router.

| Type                   | Description                                                               | Examples                                                                                   |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **local**              | These are the ip addresses of the network interfaces on your system       | The loopback address `127.0.0.1/8`, the local IP addresses `10.99.99.65` & `192.168.254.3` |
| **connected networks** | These are the ip addresses of other devices connected to the same network | Other devices on `10.99.99.0/24` and `192.168.254.0/24`                                    |
| **remote**             | These are the ip addresses that are neither local nor connected networks  | `1.1.1.1`, `8.8.8.8`, ...                                                                  |

Alright, now let's get into the nitty gritty of routing.

IP routing in Linux is handled by the IP routing subsystem called **FIB** _(Forwarding Information Base)_.
FIB is a general term, that's not specific to Linux, that refers to the data plane representation of a routing table.
Cisco, BSD, etc. all use this term.

The subsystem consists of 3 components that work together to route packets:

- Routes
- Routing table
- Routing policy database (RPDB)

> Routes live in the routing table and RPDB contains rules that determine which routing table to use for a given packet.

## A. Route

A route is an entry in the routing table that Linux kernel uses to decide where to send a packet (next hop) via what interface based on the destination IP address.
This applies to both incoming and outgoing packets.

```

# dummy routes

- to reach (31.13.79.35/32) facebook.com send packets to the 10.99.99.1 (router) via wifi interface
- to reach (142.250.194.174/32) youtube.com send packets to the 10.99.99.1 (router) via ethernet interface

```

A route consists of the following components:

| Component   | Description                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Destination | The destination IP address                                                                                                                  |
| Next hop    | When the destination is a remote IP, the next hop is the next router to send the packet to. Usually the [default gateway](#default-gateway) |
| Interface   | The network interface to send the packet out                                                                                                |
| Flags       | Special options (like UP, DOWN).                                                                                                            |
| Metric      | A priority number - lower metric means higher priority if multiple routes match.                                                            |

### `ip route`

Use `ip route` to see all the routes on your system. _(This isn't entirely accurate as we'll see when we get into the routing table)_.
Below is an example of actual routes on my Linux machine.

```bash
$ ip route list

default via 10.99.99.1 dev enp5s0 proto dhcp src 10.99.99.65 metric 100
default via 192.168.254.254 dev wlo1 proto dhcp src 192.168.254.3 metric 600
10.99.99.0/24 dev enp5s0 proto kernel scope link src 10.99.99.65 metric 100
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
192.168.254.0/24 dev wlo1 proto kernel scope link src 192.168.254.3 metric 600
```

Here's a breakdown:

There are 3 routes and 2 default routes. The 3 routes target the connected networks (every device on the respective subnets) and the 2 default routes target the remote destinations.
It's interesting to note that the wifi interface has a higher metric (600) than the ethernet interface (100). This means the kernel will prefer using ethernet to reach the destination!

That's why there's no next hop specified on them as they can be reached in the very next hop.

For any other destination, the packet will be sent to the default gateway, which is `10.99.99.1` for `enp5s0` and `192.168.254.254` for `wlo1`, via the respective interfaces.

### Default Gateway

Essentially, a default gateway is the fallback destination when no specific route is found. Think of it like the `default` case in a switch statement.

```go
packet := new_packet(src="10.99.99.65", dst=destination)

switch destination {
  case "10.99.99.0"..."10.99.99.255":
    send_to_next_hop(destination, nexthop=destination, interface="enp5s0")
  default:
    send_to_next_hop(destination, nexthop="10.99.99.1", interface="enp5s0") // default gateway
}
```

```go
packet := new_packet(src="192.168.254.3", dst=destination)

switch destination {
  case "192.168.254.0"..."192.168.254.255":
    send_to_next_hop(destination, nexthop=destination, interface="wlo1")
  default:
    send_to_next_hop(destination, nexthop="192.168.254.254", interface="wlo1") // default gateway
}
```

Next hop means the layer2 packet sends to the MAC address of the next hop. The IP packet still contains the original destination.

### Query the route for a destination

You can even check which route a packet takes for a given destination using `ip route get` command.

**Local addresses**

```bash
$ ip route get 10.99.99.3
10.99.99.3 dev enp5s0 src 10.99.99.65 uid 1000
    cache
```

**Remote addresses**

```bash
$ ip route get 1.1.1.1
1.1.1.1 via 10.99.99.1 dev enp5s0 src 10.99.99.65 uid 1000
    cache
```

As you can see, `1.1.1.1` is not a device on the same subnet as my device. So, the packet will be sent to `10.99.99.1` - which is the default gateway.

<div class="section-notes">

The router will also have its own routing table.
If the router doesn't have a route specified for `1.1.1.1`, it will send the packet to its own default gateway which is the ISP's router.

Once the packet is inside the ISP's network, protocols like BGP (Border Gateway Protocol) may take over and figure out the best path to the destination.

</div>

### Adding a new route

Let's get our hands dirty! I'll query [https://ipinfo.io/ip](https://ipinfo.io/ip/) to get my public IP address.

```bash
$ curl -s https://ipinfo.io/ip
43.231.211.110
```

In order to see which route this destination will use, we need to get the IP address for ipinfo.io.
I'll use the `dig` command for it.

```bash
$ dig +short ipinfo.io
34.117.59.81
```

Now, let's see which route this destination will use.

```bash
$ ip route get 34.117.59.81
34.117.59.81 via 10.99.99.1 dev enp5s0 src 10.99.99.65 uid 1000
    cache
```

Sure enough, it's using the ethernet interface.

Let's add a new route so that this destination uses the wifi interface.

```bash
$ sudo ip route add 34.117.59.81/32 via 192.168.254.254 dev wlo1
```

Now, let's check which route this destination will use.

```bash
$ ip route get 34.117.59.81
34.117.59.81 via 192.168.254.254 dev wlo1 src 192.168.254.3 uid 1000
    cache
```

```bash
$ curl -s https://ipinfo.io/ip
120.89.104.16
```

And there it is — the public IP address has changed, confirming that traffic is now going through the Wi-Fi interface.

> It's important to note that this route isn't persistent and will be lost after a reboot.

Let's clean it up

```bash
$ sudo ip route del 34.117.59.81/32
```

## B. Routing Table

A routing table is a collection of routes. You can have multiple routing tables on a single system.
By default, there are three built-in routing tables:

- local
- main (ip route uses this table by default)
- default (often empty unless configured)

<div class="section-notes">

I couldn't find any command that lists out all the routing tables. Routing tables are defined in `/etc/iproute2/rt_tables` file. So just check that out.

It's possible that file is not present on your system. My desktop didn't have it as well. Here's what it looks like in one of my vms.

```bash
$ cat /etc/iproute2/rt_tables
#
# reserved values
#
255     local
254     main
253     default
0       unspec
#
# local
#
#1      inr.ruhep
```

</div>

### local routing table

The local routing table contains routes for local destinations (i.e. its own IP addresses).
It's maintainted by the kernel itself and is used to route incoming packets or outgoing packets destined to the host itself.

```bash
$ ip route show table local

local 10.99.99.65 dev enp5s0 proto kernel scope host src 10.99.99.65
broadcast 10.99.99.255 dev enp5s0 proto kernel scope link src 10.99.99.65
local 127.0.0.0/8 dev lo proto kernel scope host src 127.0.0.1
local 127.0.0.1 dev lo proto kernel scope host src 127.0.0.1
broadcast 127.255.255.255 dev lo proto kernel scope link src 127.0.0.1
local 172.17.0.1 dev docker0 proto kernel scope host src 172.17.0.1
broadcast 172.17.255.255 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
local 192.168.254.3 dev wlo1 proto kernel scope host src 192.168.254.3
broadcast 192.168.254.255 dev wlo1 proto kernel scope link src 192.168.254.3
```

The `broadcast` entries are interesting ones. Broadcast IP addresses are special addresses that deliver packets to all the devices on the network.
If you send a packet to a broadcast address, it will be sent to all the devices on the network. Hence - the name.

### main routing table

The main routing table contains routes for all other destinations (connected networks & remote destinations).

```bash
$ ip route show table main

default via 10.99.99.1 dev enp5s0 proto dhcp src 10.99.99.65 metric 100
default via 192.168.254.254 dev wlo1 proto dhcp src 192.168.254.3 metric 600
10.99.99.0/24 dev enp5s0 proto kernel scope link src 10.99.99.65 metric 100
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
192.168.254.0/24 dev wlo1 proto kernel scope link src 192.168.254.3 metric 600
```

This is the default routing table that `ip route` uses.

### default routing table

I'm not sure what the purpose of this table is. It isn't even present on my system.

```bash
$ ip route show table default

Error: ipv4: FIB table does not exist.
Dump terminated
```

## C. Rule

A rule, determines which routing table to use for a given packet.
Each rule has a priority, and rules are examined sequentially from rule 0 through rule 32767.

```bash
$ ip rule show
0:      from all lookup local
32766:  from all lookup main
32767:  from all lookup default
```

#### Routing Policy Database (RPDB)

Rules live in a database called the Routing Policy Database (RPDB).

```
RPDB (Rules: priority-ordered)
 └──> Routing Table (chosen by rule)
      └──> Routes (prefix + metric ordered)
```

## Things we didn't cover

- Why do we need more than one routing table?
- Routing cache
- Route matching algorithm (longest prefix match and lowest metric wins)
- Rule types (unicast, multicast, prohibit, blackhole, unreachable)

## References:

- iproute2 manual pages: `man ip`
- https://datahacker.blog/industry/technology-menu/networking/routes-and-rules/iproute-and-routing-tables
- https://baturin.org/docs/iproute2/
- https://youtu.be/zstdOS_6ajY?si=gCPBv2c_N-7aNssi
- http://linux-ip.net/html/ch-routing.html

<br>
