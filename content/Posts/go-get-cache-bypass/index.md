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

If you request a version before it's published, the proxy gets a 404 and caches that negative response.
You'll then encounter an error like this:

```sh
go get github.com/flanksource/duty@v1.0.1111
```

```output
go: github.com/flanksource/duty@v1.0.1111: reading github.com/flanksource/duty/go.mod at revision v1.0.1111: unknown revision v1.0.1111
```

I've run into this issue even when running `go get` immediately after a new release.
According to the proxy documentation, new versions may not show up immediately but should be available within one minute:

> "In order to improve our services' caching and serving latencies, new versions may not show up right away ...
> The new version should be available within one minute..."
>
> \- https://proxy.golang.org/

This poisoned cache can persist even after the version is published, which is why you may still get 404 errors for up to 30 minutes even after a release.

> "it may take up to 30 minutes for the mirror's cache to expire and fresh data about the version to become available"
>
> \- https://proxy.golang.org/

To understand what's happening behind the scenes, use the `-x` flag to see which servers `go get` contacts:

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

## The Solution

To bypass the poisoned cache, you can override the default proxy using the `GOPROXY` environment variable. Setting it to `direct` skips all proxy servers and fetches directly from the module repository.

![Go Module Mirror](./module-mirror.svg)

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

Now `go get` clones the repository directly using Git, completely bypassing the proxy cache and fetching the latest version from the source.

## References

- https://proxy.golang.org/
- https://stackoverflow.com/a/67678279
