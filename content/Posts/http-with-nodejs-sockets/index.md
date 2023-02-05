---
title: Basic introduction to HTTP requests with TCP Sockets in NodeJs
date: '2020-03-22 22:00'
modified_date: '2020-09-07 14:30'
categories:
  - TCP
  - HTTP
  - Sockets
slug: /raw-http-request-with-sockets-nodejs/
featuredImage: ./http.png
description: Understand the structure of HTTP messages and how they work with network sockets in NodeJs 
---

I love programming in NodeJs; mainly due to the speed in which I can quickly get an application up and running. Need to make an http request ? `npm install axios` and a few lines of code will do the trick. Need to create an http server? `npm install express` and with few lines you've an http server running. Now take a look at this [StackOverflow answer](https://stackoverflow.com/a/1359700/6199444) on how to make http request in Java. There's just so much of code to write ...

But this convenience comes at a cost. All these fancy easy-to-use libraries abstract the nitty gritties that's happening under the hood.

I learned about sockets years after learning to make http requests in NodeJs. The convenience provided by RequestJs and ExpressJs never made the need for me to learn sockets. In fact I didn't even know that there's such thing as sockets just a while ago and I am sure many new devs don't either.

## What are sockets ?

You've probably heard of [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol). It is one of the protocols that governs the exchange of data over network connections.

HTTP works over TCP (Any other protocol like UDP is fine as well but TCP is the standard). This means whenever we need to make an http request to a server - via whatever means like nodejs, python, curl or web browsers - we first need to establish a TCP connection with the server. Once the TCP connection is established, http requests and responses can be exchanged to-and-fro over the connection.

So how do we establish a TCP connection? That's where sockets come in. A socket is an interface provided by the operating system that enables us to read and write to a network. There are 3 types of sockes

- Stream Sockets (TCP)
- Datagrap Sockets (UDP)
- Raw Sockets

Since HTTP is most commonly used with TCP, we are only concerned with TCP sockets in this article.

Most programming languages provide a socket interface. NodeJs provides the `net` library, python provides the `socket` library and likewise there's `java.net.Socket` in Java.

![Zines by Julia Evans](./sockets-zines.jpeg)_Zines by Julia Evans_

## Establish a TCP connection in NodeJs with sockets

To establish a TCP connection we need the IP Address and the port number of the two communicating devices. As an example, if I want to establish a TCP connection with google's server then I'll need

- Google Server's IP Address
- Google Server's Port Number
- My IP Address (The OS takes care of this)
- My Port Number (The OS takes care of this one too)

There's a webserver running on adityathebe.com on port 80. Let's try to establish a TCP connection with that server.

```js
const net = require('net');

const port = 80;
const host = 'adityathebe.com';

// Create a new socket
const socket = new net.Socket();

// Establish a TCP connection
socket.connect(port, host);

socket.on('connect', () => {
  console.log(`Established a TCP connection with ${host}:${port}`);
  socket.destroy();
});
```

If you run the code above, you'll establish a TCP connection and then also kill it right away. TCP connections remain active for as long as days or even months or, theoretically, forever as long as there's no network connection issues. That's why it's important to kill the connection after there's no need for it.

## Send an HTTP request over the socket

Now let's try to send some data over the TCP connection. The data could be anything from a simple text to a large media file. In our case, the data will be an [HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages).

HTTP is a really simple protocol - it's literally just plain texts! You can even craft http requests & responses by hand. There are standards & structures to HTTP messages.

![HTTP Structure](./http-structure.png)_HTTP Structure_

As a fun demo, let's try to make an http request to *example.com*. We can send a very bare minimal http request like this that only consists of http header.

```text
GET / HTTP/1.1
Host: example.com
   
   
```

Notice the two blank lines at the end? That's important. The blank line separates http header from the http body. If you leave out the blank line, then example.com's server will respond with an error because the http request is invalid. Give it a try... It's also important to note that the blank line is actually a [CRLF](https://developer.mozilla.org/en-US/docs/Glossary/CRLF) `\r\n` and not the Line Feed `\n` character. Although servers these days accept the LineFeed `\n` character.

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
  // data is an array buffer. We need to transform it to string
  console.log(data.toString());

  // Close the connection
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
  ...
<body>
<div>
  <h1>Example Domain</h1>
  ...
</div>
</body>
</html>
```

I hope this was fun and helpful. Under the hood, the libraries like axios, request, express, etc are doing all of these and much more ...
