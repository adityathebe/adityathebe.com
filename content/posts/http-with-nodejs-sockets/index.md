---
title: Let's make a raw http request with NodeJs Sockets
date: '2020-03-22 22:00'
categories:
  - TCP
  - HTTP
  - Sockets
slug: /raw-http-request-with-nodejs-sockets
featuredImage: ./http.png
description: Set up ssh keys on your github account
---

I love programming in NodeJs; mainly due to the speed in which I can quickly get an application up and running. Need to make an http request ? Well `npm install axios` and a few lines of code will do the trick. Need to create an http server? `npm install express` and a few lines and bam you've an http server running. I could say the same is the case with Python. Now take a look at this [StackOverflow answer](https://stackoverflow.com/a/1359700/6199444) on how to make http request in Java. So much of code right ?

But this comes at a cost. These fancy easy-to-use libraries abstract all the nitty gritties that's happening under the hood.

I learned about sockets years after learning to make http requests in NodeJs. I don't know if it's just me, and I don't really want to blame the programming language, but the easiness provided by requestJs and ExpressJs never made the need for me to learn or even know about sockets. If you don't know about sockets then good news - this is going to be fun.

## What are sockets ?

I am sure you've heard about TCP. It's the protocol that governs the exchange of data over network connections.

HTTP works over TCP. This means whenever you need to make an http request to a server - either via nodejs, python, curl or via web browsers - you first need to establish a TCP connection with the server. Once the TCP connection is established, http requests and responses are exchanged to-and-fro over the connection.

Technically, there's no server and client in TCP. There are just the two nodes at the two ends of the socket connection. From now on, I'll refer two both the client and the server as just "nodes".

So how do we establish a TCP connection? That's where sockets come in. A socket is an interface to make a tcp connection. Every programming language has a socket interface. NodeJs provides the [`net`](https://nodejs.org/api/net.html) library, python provides the `socket` library and likewise there's `java.net.Socket` in Java.

> A socket is an interface to make a tcp connection

## Establish a TCP connection in NodeJs with sockets

To establish a tcp connection we need the hostname and the port number of the other node. We also need to assign a port on our computer but the operating system automatically does that for us.

There's a webserver running on adityathebe.com on port 80. Let's try to establish a tcp connection with that server.

```js
const net = require('net');

const port = 80;
const host = 'adityathebe.com';

// Create a new socket
const socket = new net.Socket();

// Establish a TCP connection
socket.connect(port, host);

socket.on('connect', () => {
  console.log(`Established a tcp connection with ${host}:${port}`);
  socket.destroy();
});
```

That's it. We successfully established a tcp connection and then killed it right away.

## Make an HTTP request over the socket

Now, let's try to send some data over the tcp connection. In our case, the data will be an http request/response.

HTTP is a really simple protocol - it's literally just plain texts! I can write an http request in plain text and then send it over the socket to the server. The server parses the http request and then responds accordingly.

As a fun demo, let's try to make an http request to example.com. We can send a very bare minimal http request like this

```text
GET / HTTP/1.1
Host: example.com

```

Notice the blank line at the end ? That's important. The blank line separates http header from the http body.

```js
const net = require('net');

const port = 80;
const host = 'example.com';

// Instead of \n as a line break we use \r\n
// Because that's how it's defined in the http specification
// https://stackoverflow.com/a/5757349/6199444
const rawHttpRequest = 'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n';

const socket = new net.Socket();
socket.connect(port, host);

socket.on('connect', () => {
  console.log(`Connected to ${host}:${port}`);
  console.log(`Local port ${socket.localPort}\n`);

  socket.write(rawHttpRequest);
});

socket.on('data', data => {
  // data is a buffer. We need to transform it to string
  console.log(data.toString());
  socket.destroy();
});
```

### HTTP Response from example.com

```text
HTTP/1.1 200 OK
Age: 267333
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Sun, 22 Mar 2020 17:23:08 GMT
Etag: "3147526947+ident"
Expires: Sun, 29 Mar 2020 17:23:08 GMT
Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
Server: ECS (nyb/1D2A)
Vary: Accept-Encoding
X-Cache: HIT
Content-Length: 1256

<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 2em;
        background-color: #fdfdff;
        border-radius: 0.5em;
        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        div {
            margin: 0 auto;
            width: auto;
        }
    }
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.</p>
    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
```
