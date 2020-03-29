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

But this convenience comes at a cost. All these fancy easy-to-use libraries abstract the nitty gritties that's happening under the hood.

I learned about sockets years after learning to make http requests in NodeJs. The convenience provided by RequestJs and ExpressJs never made the need for me to learn sockets. In fact I didn't even know that there's such thing as sockets just a while ago and I am sure most junior devs don't either.

## What are sockets ?

You've probably heard about TCP. It's the protocol that governs the exchange of data over network connections.

HTTP works over TCP. This means whenever you need to make an http request to a server - either via nodejs, python, curl or via web browsers - you first need to establish a TCP connection with the server. Once the TCP connection is established, http requests and responses are exchanged to-and-fro over the connection.

_Technically, there's no server and client in TCP. There are just the two nodes at the two ends of the socket connection._

So how do we establish a TCP connection? That's where sockets come in. A socket is an interface provided by the operating system, that helps us to make a tcp connection. Every programming language has a socket interface. NodeJs provides the [`net`](https://nodejs.org/api/net.html) library, python provides the `socket` library and likewise there's `java.net.Socket` in Java.

> A socket is an interface provided by an operating system to make a tcp connection

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

That's it. If you run the code above, you'll establish a tcp connection and then also kill it right away. TCP connections remain active for as long as days or even months or, theoretically, forever as long as there's no network connection issues. That's why it's important to kill the connection after's there's no need for it.

## Make an HTTP request over the socket

Now, let's try to send some data over the tcp connection. In our case, the data will be an http request/response. The data could be anything form a simple text to a large file.

HTTP is a really simple protocol - it's literally just plain texts! So when we say we need to send http request, what we really mean is - we need to send plain text. The plain text is of course the http header and http body. The server parses the http request and then responds accordingly.

> HTTP is simply a plain text

As a fun demo, let's try to make an http request to example.com. We can send a very bare minimal http request like this that only consists of http header.

```text
GET / HTTP/1.1
Host: example.com

```

Notice the blank line at the end ? That's important. The blank line separates http header from the http body. If you leave out the blank line, then example.com's server will respond with an error because the http request you sent it is invalid.

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

I hope this was fun and helpful. Under the hood, the libraries like axios, request, express, etc are doing all of these and much more ...
