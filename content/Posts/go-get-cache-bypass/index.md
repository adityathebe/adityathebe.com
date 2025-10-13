---
title: 'Fix invalid version: unknown revision from go get'
date: '2025-10-13'
contentType: bitesize
featuredImage: image.png
categories:
  - go
  - cache
slug: /bypass-go-get-cache
description: |
  Running go get on a version that hasn't been released poisons the go proxy cache.
  Here's how you can bypass the cache and hit the module directly.
---

`go get` by default talks to a proxy server - https://proxy.golang.org.
The proxy server then fetches the module, caches it and returns it to you.

> "it may take up to 30 minutes for the mirror's cache to expire and fresh data about the version to become available"
>
> \- https://proxy.golang.org/

If you run `go get` on a version that has just been released, then the proxy server might get a 404 itself and cache that response.

> "In order to improve our services' caching and serving latencies, new versions may not show up right away ...
> The new version should be available within one minute..."
>
> \- https://proxy.golang.org/

![Go Module Mirror](./module-mirror.svg)

Use the `-x` flag to see what the command is doing under the hood.

```sh
go get -x github.com/labstack/echo
```

```output
# get https://proxy.golang.org/github.com/@v/list
# get https://proxy.golang.org/github.com/labstack/@v/list
# get https://proxy.golang.org/github.com/labstack/echo/@v/list
# get https://proxy.golang.org/github.com/labstack/echo/@v/list: 200 OK (0.914s)
# get https://proxy.golang.org/github.com/labstack/@v/list: 404 Not Found (0.940s)
# get https://proxy.golang.org/github.com/@v/list: 404 Not Found (0.940s)
# get https://proxy.golang.org/golang.org/x/crypto/@v/list
# get https://proxy.golang.org/github.com/labstack/gommon/@v/list
```

As you can see, every request goes through the proxy.

You can override the default proxy to another using the `GOPROXY` env var.
But there's also the `direct` directive which doesn't use any proxy server and hits the module repository directly.

```sh
GOPROXY=direct go get -x github.com/labstack/echo
```

```output
mkdir -p /Users/aditya/go/pkg/mod/cache/vcs # git3 https://github.com/labstack/echo
# lock /Users/aditya/go/pkg/mod/cache/vcs/84bf749277ea54683052733eb9a9f7ea7f43e18090bed6ec5b8281cdee0a1f11.lock
mkdir -p /Users/aditya/go/pkg/mod/cache/vcs/84bf749277ea54683052733eb9a9f7ea7f43e18090bed6ec5b8281cdee0a1f11 # git3 https://github.com/labstack/echo
cd /Users/aditya/go/pkg/mod/cache/vcs/84bf749277ea54683052733eb9a9f7ea7f43e18090bed6ec5b8281cdee0a1f11; git ls-remote -q https://github.com/labstack/echo
1.158s # cd /Users/aditya/go/pkg/mod/cache/vcs/84bf749277ea54683052733eb9a9f7ea7f43e18090bed6ec5b8281cdee0a1f11; git ls-remote -q https://github.com/labstack/echo
cd /Users/aditya/go/pkg/mod/cache/vcs/84bf749277ea54683052733eb9a9f7ea7f43e18090bed6ec5b8281cdee0a1f11; git init --bare
```

## References

- https://proxy.golang.org/
- https://stackoverflow.com/a/67678279
