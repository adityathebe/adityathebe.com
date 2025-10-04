---
title: ARP - The DNS for IP addresses
date: '2025-05-17 15:35'
categories:
  - Linux
  - Networking
slug: /address-resolution-protocol
featuredImage: ./arp.png
description: Address Resolution Protocol maps IP addresses to MAC addresses similar to how DNS maps domains to IP addresses.
keywords:
  - Linux
  - Networking
---

In the OSI model, devices in layer 2 - like a Switch - work with MAC address while devices on layer 3 work with IP addresses.
IP packets only know what IP address they are destined to but at the lower level we only have MAC addresses. This tells us that at some point
we need to map IP address to MAC address.

> As always, this post focuses specifically on Linux networking.

![what is arp](./arp.svg)

That's where ARP comes in. ARP _(Address Resolution Protocol)_ maps IP addresses to MAC addresses. If you are familiar with DNS, ARP is similar to that [_[1]_](#ref-1).

```
DNS: Map Domain names -> IP addresses

ARP: Map IP addresses -> MAC addresses
```

ARP lives in-between L2 & L3 - often called L2.5.

It's clear that we need a record of mapping of IP addresses to MAC addresses. But where does that record live? And who populates it? If you consider DNS, the mapping needs to be supplied by a human and is stored in whatever nameserver is chosen.

ARP, on the other hand, doesn't have a pre-populated record to refer to. This is because unlike DNS, IP -> MAC address is much more dynamic.
Rather, the mapping is queried when required.

In the example above, we need the mac address for `10.0.0.2`. The networking stack sends an `ARP` request to all the devices connected to the network segment [_[2]_](#ref-2) requesting whoever has `10.0.0.2` to send it back the MAC address. The way to send this message to all the devices is by using the broadcast address [_[3]_](#ref-3).
The ARP request is received by all the devices in the network segment and the device that actually is assigned the IP address will send back an ARP response.
This response is addressed directly to the MAC address of the requester rather than broadcasting it to everyone.

This mechanism prevents the network administrators from maintaining any sort of record as the protocol is self sufficient.

### Caching

It would be very inefficient if we had to query the MAC addresses for every single IP packet. That's why the ARP responses are cached.
The cache usually has a timeout period in the span of a few seconds.

There's also another more efficient way to invalidate the cache - it's by sending a **gratuitous ARP** message.
Basically, when a device gets a new IP address it'll simply send a gratuitous ARP message broadcasting its own IP address.
Other devices will then invalidate any stale records.

Users can also manually flush the entire cache as we'll see in a minute.

## ARP inside the Linux kernel

ARP is maintained by the Linux kernel. More specifically by the IPV4 subsytem - https://github.com/torvalds/linux/blob/master/net/ipv4/arp.c.

IPV6 doesn't use ARP. It still does need a protocol to map IP addresses to MAC addresses, but that protocol is not ARP.
Instead, it uses **Neighbor Discovery Protocol** (NDP).

ARP is completely transparent. The IP subsytem in Linux automatically issues ARP requests when it doesn’t have a MAC address for a given.

```
  ┌────────────────────────────┐                     ┌────────────────────────────┐
  │      Host A (sender)       │                     │      Host B (target)       │
  │────────────────────────────│                     │────────────────────────────│
  │  IP: 192.168.1.10          │                     │  IP: 192.168.1.20          │
  │  MAC: AA:AA:AA:AA:AA:AA    │                     │  MAC: BB:BB:BB:BB:BB:BB    │
  └────────────┬───────────────┘                     └────────────┬───────────────┘
               │                                                  │
               │ 1️⃣  **ARP REQUEST** (broadcast frame)            │
               │     ───────────────────────────────────────────▶ │
               │     Dest MAC: FF:FF:FF:FF:FF:FF                  │
               │     Src  MAC: AA:AA:AA:AA:AA:AA                  │
               │     Payload: “Who has 192.168.1.20?              │
               │               Tell 192.168.1.10.”                │
               │                                                  │
               │                                                  │
               │                2️⃣  **ARP REPLY** (unicast frame) │
               │     ◀─────────────────────────────────────────── │
               │     Dest MAC: AA:AA:AA:AA:AA:AA                  │
               │     Src  MAC: BB:BB:BB:BB:BB:BB                  │
               │     Payload: “192.168.1.20 is at                 │
               │               BB:BB:BB:BB:BB:BB.”                │
               │                                                  │
  ┌────────────▼───────────────┐                     ┌────────────▼───────────────┐
  │ 3️⃣  Host A updates its     │                     │ (Host B may also cache     │
  │     ARP cache:             │                     │  Host A’s mapping.)        │
  │     192.168.1.20 ↔ BB:BB…  │                     └────────────────────────────┘
  └────────────┬───────────────┘
               │
               │ 4️⃣  **Normal traffic** (e.g., IP packets)
               │     sent directly to MAC BB:BB:BB:BB:BB:BB
               ▼
        (Frame delivery continues as usual)



                        Fig: Created by OpenAI o3
```

## Demo

Let's get our hands dirty. We'll use the mighty `ip` command line tool to investigate ARP records and get a live view of ARP messages.
You can follow along this demo if you're on a Linux system _(not unix - doesn't work on MacOS)_

```sh
ip neigh
```

```
10.99.99.1 dev vmbr0 lladdr 74:fe:ce:6e:01:59 STALE
10.99.99.115 dev vmbr0 lladdr 9c:9d:7e:54:16:78 STALE
10.99.99.51 dev vmbr0 lladdr 30:f9:ed:c1:26:07 REACHABLE
10.99.99.8 dev vmbr0 lladdr 26:f4:91:9d:2c:86 REACHABLE
10.99.99.5 dev vmbr0 lladdr 12:31:43:ab:7d:aa STALE
10.99.99.131 dev vmbr0 lladdr 92:95:3e:3f:cd:81 DELAY
10.99.99.9 dev vmbr0 lladdr fe:7a:08:2c:fa:4e STALE
fe80::c20:96e8:c4b7:d575 dev vmbr0 lladdr 92:95:3e:3f:cd:81 STALE
fe80::fc7a:8ff:fe2c:fa4e dev vmbr0 lladdr fe:7a:08:2c:fa:4e STALE
fe80::103c:2fff:4455:e2e9 dev vmbr0 lladdr 2a:13:6d:9e:b9:ff STALE
fe80::32f9:edff:fec1:2607 dev vmbr0 lladdr 30:f9:ed:c1:26:07 STALE
fe80::28b1:57ff:fe29:ef4a dev vmbr0 lladdr 2a:b1:57:29:ef:4a STALE
fe80::ac09:e9ff:fee2:75d6 dev vmbr0 lladdr ae:09:e9:e2:75:d6 STALE
fe80::901d:ccff:fe64:ad04 dev vmbr0 lladdr 92:1d:cc:64:ad:04 STALE
fe80::c295:cfff:fe8b:a269 dev vmbr0 lladdr c0:95:cf:8b:a2:69 STALE
fe80::88a1:5fff:fe2b:fcd1 dev vmbr0 lladdr 8a:a1:5f:2b:fc:d1 STALE
fe80::1031:43ff:feab:7daa dev vmbr0 lladdr 12:31:43:ab:7d:aa STALE
fe80::21d8:9d95:d19d:af8f dev vmbr0 lladdr 58:24:29:7a:5f:a6 STALE
fe80::1c5e:aa1b:fa11:bebd dev vmbr0 lladdr 02:fa:76:28:bb:25 STALE
fe80::24f4:91ff:fe9d:2c86 dev vmbr0 lladdr 26:f4:91:9d:2c:86 STALE
```

> we mentioned ARP doesn't work with IPv6 and yet we still see ipv6 above. That's because `ip neigh` returns ARP & NDISC cache entries.

Let's try cleaning up the cache

```sh
ip neigh flush all
```

### Monitor live ARP message

We'll use `tcpdump`

```sh
sudo tcpdump -n -i enp8s0 arp

# replace enp8s0 with your network interface.
# use `ip link` to see the list of network interfaces in your system.
```

```
listening on enp8s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
15:15:43.403688 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:46.435738 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:49.467785 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:52.220755 ARP, Request who-has 10.99.99.5 tell 10.99.99.115, length 46
15:15:52.220947 ARP, Reply 10.99.99.5 is-at 12:31:43:ab:7d:aa, length 28
15:15:52.229263 ARP, Request who-has 10.99.99.115 tell 10.99.99.5, length 28
15:15:52.229574 ARP, Reply 10.99.99.115 is-at 9c:9d:7e:54:16:78, length 46
15:15:52.499759 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:55.420196 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:55.531744 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:56.402074 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:56.451366 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:56.771925 ARP, Request who-has 10.99.99.51 tell 10.99.99.9, length 28
15:15:56.772240 ARP, Reply 10.99.99.51 is-at 30:f9:ed:c1:26:07, length 46
15:15:57.401975 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:57.474439 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:58.402074 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:58.498718 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:58.571763 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:59.522361 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:16:00.547347 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:16:01.603792 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:16:02.171191 ARP, Request who-has 10.99.99.1 tell 10.99.99.115, length 46
15:16:02.181128 ARP, Request who-has 10.99.99.2 tell 10.99.99.115, length 46
15:16:02.191115 ARP, Request who-has 10.99.99.3 tell 10.99.99.115, length 46
15:16:02.201213 ARP, Request who-has 10.99.99.4 tell 10.99.99.115, length 46
15:16:02.201264 ARP, Reply 10.99.99.4 is-at 08:97:98:75:cc:fd, length 28
15:16:02.211140 ARP, Request who-has 10.99.99.5 tell 10.99.99.115, length 46
15:16:02.211402 ARP, Reply 10.99.99.5 is-at 12:31:43:ab:7d:aa, length 28
15:16:02.221140 ARP, Request who-has 10.99.99.6 tell 10.99.99.115, length 46
15:16:02.222453 ARP, Reply 10.99.99.6 is-at 2a:b1:57:29:ef:4a, length 28
15:16:02.231200 ARP, Request who-has 10.99.99.7 tell 10.99.99.115, length 46
15:16:02.241218 ARP, Request who-has 10.99.99.8 tell 10.99.99.115, length 46
15:16:02.241411 ARP, Reply 10.99.99.8 is-at 26:f4:91:9d:2c:86, length 28
15:16:02.251118 ARP, Request who-has 10.99.99.9 tell 10.99.99.115, length 46
15:16:02.251278 ARP, Reply 10.99.99.9 is-at fe:7a:08:2c:fa:4e, length 28
15:16:02.261225 ARP, Request who-has 10.99.99.10 tell 10.99.99.115, length 46
15:16:02.271116 ARP, Request who-has 10.99.99.11 tell 10.99.99.115, length 46
15:16:02.281112 ARP, Request who-has 10.99.99.12 tell 10.99.99.115, length 46
```

## Things we didn't cover

- Security aspects (ARP spoofing / Dynamic ARP)

---

## References

<div id="ref-1">
<i>[1]</i>. ARP and DNS are similar only at the surface level in the sense that both protocols map an address from a higher level <i>(in the OSI model)</i> to a lower level. They have a lot of differences - example: DNS is global and hierarchical while ARP is local and flat. So take this analogy with a grain of salt.
</div>

</br>

<div id="ref-2">
<i>[2]</i>. A network segment is a section of a computer network where all devices are directly connected and can communicate with each other at the data link layer (Layer 2) without needing to go through a router.
</div>
</br>

<div id="ref-3">
<i>[3]</i>. A broadcast address in layer 2 is - <code>FF:FF:FF:FF:FF:FF</code>. It's an address that doesn't belong to a single device but any message sent to that address is delivered to all the devices.
</div>
</br>
