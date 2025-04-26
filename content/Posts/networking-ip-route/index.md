---
title: IP Routing in Linux
date: '2025-04-20 11:20'
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

If you want to dip your feet into networking, a good place to start is `iproute2`. It's a predecessor to `net-tools` and it is the primary way to interact with networking internals and lower level networking APIs in Linux.

`iproute2` is a software suite that offers various tools like

- `ip`
- `ss`
- `tc`

By far, the most used and the most powerful tool is the `ip` tool and it's the one we'll be focusing on.

### `ip` tool

The predecessor `net-tools` had various binaries, like ifconfig, arp, route, etc, that have been consolidated into a single binary called `ip`.
It has various subcommands that manage various aspects of networking. For instance:

| Command    | Description               | Formerly   |
| ---------- | ------------------------- | ---------- |
| `ip link`  | manage network interfaces | `ifconfig` |
| `ip addr`  | manage IP addresses       | `ifconfig` |
| `ip route` | manage routing table      | `route`    |
| `ip rule`  | manage routing rules      | `route`    |

There are also other popular commands that we won't be covering in this post.

| command     | description               |
| ----------- | ------------------------- |
| `ip netns`  | manage network namespaces |
| `ip neigh`  | manage ARP cache entries  |
| `ip tunnel` | manage tunnels            |

---

## Network Interface

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
