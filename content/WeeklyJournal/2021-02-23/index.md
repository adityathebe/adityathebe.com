---
title: '#1. GRPC, ProtoBuf and weekly journals'
date: '2021-02-23 23:25'
slug: /journal/1
featuredImage: ./img.png
description: This week I learned about ProtoBuf, gRPC & sql in Go
keywords:
  - grpc
  - protobuf
  - protocol buffer
  - sql in golang
---

## Table of Contents

1. [Weekly Journals](#weekly-journals)
2. [GRPC and Protocol Buffers](#grpc-protobuf)
3. [Go's Defer Panic and Recover](#go-defer-panic-recover)
4. [SQL in Go](#sql-in-go)

### Weekly Journals <a name="weekly-journals"></a>

After having this idea of adding a new weekly journal section to my blog for literally more than a year, I have finally done it. It didn't take me as long as I had thought it would to implement this. GatsbyJS makes it super easy. I will soon write a blog post on what motivated me to add this new section to my blog.

### GRPC and Protocol Buffers <a name="grpc-protobuf"></a>

I have used and created a lot of REST APIs and almost all of them used JSON to exchange data. I love JSON cuz its so simple, human-readable, and easy to add and modify data. However, they're not the most efficient way to exchange data in terms of bandwidth. The most "bang for bandwidth" way to do it would be to encode message in binary. That's basically what GRPC and ProtoBuf is about. This week I have started learning them in Go.

**Resources**

- https://www.youtube.com/watch?v=pMgty_RYIOc&list=PLmD8u-IFdreyyTx93jJ5GkijwDXFqyr3T&index=1
- https://www.youtube.com/playlist?list=PLy_6D98if3UJd5hxWNfAqKMr15HZqFnqf
- https://www.youtube.com/watch?v=BdzYdN_Zd9Q

### Go's Defer Panic and Recover <a name="go-defer-panic-recover"></a>

I took the time to learn a bit more about some of the in-built functions in Go. The defered functions in Go are executed no matter what; even when a panic occurs. However, in case of os.Exit() the program shuts down immediately giving no chance for the defered function to execute.

One thing that really troubled me for quite some time was how the return value(s) of the defered function were handled. We are used to write `defer file.Close()` but this function call can return an error. It turns out the error or any other return value is simply ignored. To handle the return value, we need to wrap the function call inside an anonymous function.

```go
defer func() {
  err := file.Close()
  if err != nil {
    log.Println("Ooops")
  }
}
```

**Resources**

- https://blog.golang.org/defer-panic-and-recover
- https://yourbasic.org/golang/defer/

### SQL in Go

- https://www.youtube.com/watch?v=prh0hTyI1sU&list=PLy_6D98if3ULEtXtNSY_2qN21VCKgoQAE&index=4
- https://github.com/kyleconroy/sqlc
- https://github.com/jmoiron/sqlx