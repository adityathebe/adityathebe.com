---
title: Dependency Injection In Go With Context API Is Pretty Neat !!
date: '2021-04-25 14:00'
slug: /journal/5
description:
keywords:
  - go dependency injection
  - go time format
  - go type
---

<div class="table-of-contents">

## Table of Contents

1. [Dependecy injection in Go with Context API](#ctx-dependency-injection)
2. [Go Type conversion vs Type assertion](#assertion-and-conversion)
3. [Time formats in Go](#go-time-formats)
4. [Declaring emtpy slices in Go](#declaring-empty-slices)

</div>

### 1. Dependecy injection in Go with Context API <a name="ctx-dependency-injection"></a>

This week I found a really neat way to inject dependencies in Go using the context API. Here's the [YouTube link](https://www.youtube.com/watch?v=_KrV_VWP2n0) of a brief demo by the author himself.

The classic way, that I know of, to inject dependencies is to make all the HTTP handlers a method of the main `Server` struct and the handlers can just access the necessary dependencies from the server.

```go
type Server struct {
  db Database
}

func (s *Server) GetUsers(w http.ResponseWriter, r *http.Request) ([]string, errror) {
  users, _ := s.db.getUsers(ctx))
  ...
}
```

Nothing wrong with this approach really except maybe things will start to get a little messy as the number of handlers grows because all the handlers should reside inside the same package.

Instead, with [Kayle's](https://github.com/kayleg) method, we can have handlers as standalone functions (and not methods on the server) and they can receive the dependencies from the context

```go

type contextKeyType string

const (
	ContextKey contextKeyType = "dep-provider"
)

// This middleware will attach the dependencies in the request context on every request
_ = http.ListenAndServe(":8080", server.injectDB()(router))

// My standalone handler
func Getusers(w http.ResponseWriter, r *http.Request) {
  db := r.Context().Value(provider.ContextKey).(Database)
  user, _ := db.getUsers(ctx))
  ...
}
```

To learn more about it, you can check out the [Github Repo](https://github.com/kayleg/yt-dependency-injection)

### 2. Go Type conversion vs Type assertion <a name="assertion-and-conversion"></a>

I have been wrongly misusing the word type coercion not actually knowing the difference between type conversion and type assertion.

#### A. Type Assertion

The notation `x.(T)` is called a type assertion. With the absence of Generics in Go, interfaces and type assertions are used heavily. Even in the example above you can see that once we get the Database value from the context we perform type assertion to set the value of `db` to `Database`.

For a type assertion to succeed, the variable must satisfy all the interfaces of the type that's being asserted. In case of failure to satisfy the interface, a panic will occur. A graceful way to perform type assertion is to perform a check on the second value returned by the assertion

```go
t, ok := i.(T)
```

> If i holds a T, then t will be the underlying value, and ok will be true. If not, ok will be false and t will be the zero value of type T, and no panic occurs.

#### B. Type Conversion

A Conversion changes the type of an expression to the type specified by the conversion. A simple example would be converting an int to int32

```go
var age int
age = 25

newAge := int32(age)
```

### 3. Time formats in Go <a name="go-time-formats"></a>

When converting a datetime object to a string, most programming languages offer different "verbs" to get the date in the format the way you want. For example: In python you can use `datetime.now().strftime("%H:%M:%S")` or in Java you have `HH:mm:ss`.

Go has a unique approach of formating date and time which I prefer more than any other ways out there. In Go, you can provide a human-readable format like this.

```go
x := time.Now()
fmt.Println(x.Format("2006 Jan 03"))
fmt.Println(x.Format("3 01 06"))
fmt.Println(x.Format("Monday, January 2006"))
fmt.Println(x.Format("Monday, January 2006 03:15"))

// # Output
// 2009 Nov 11
// 11 11 09
// Tuesday, November 2009
// Tuesday, November 2009 11:23

```

The key, and the only, thing to remember is the reference date

> Mon Jan 2 15:04:05 MST 2006

You see in the example above, I always used the month January and the year 2006. If I use any other month or year or date, Go will not understand it. So even though I can format the month anyway I like - Jan, January, 01 - it has to be the month January. The same is the case for date, day, year, hour, time, second, and timezone.

At first glance, this seems pretty weird. Why this specific date and not any other one would ask. There's a pretty clever reason behind this - it's that in POSIX date format it actually is `0 1 2 3 4 5 7 6`

```
Mon Jan 2 15:04:05 -0700 MST 2006
0   1   2  3  4  5  7        6
```

But why is 7 in front of 6 ? It's because if we had to interchange them then it would be the year 2007 and Jan 2nd 2007 is not Monday whereas Jan 2nd 2006 is.

### 4. Declaring emtpy slices in Go <a name="declaring-empty-slices"></a>

There are various ways to declare a slice in Go

```go
var x []string
y := []string{}
z := make([]string, 0)

fmt.Printf("Len: %d\tCap: %d\tIsNil: %v\n", len(x), cap(x), x == nil)
fmt.Printf("Len: %d\tCap: %d\tIsNil: %v\n", len(y), cap(y), y == nil)
fmt.Printf("Len: %d\tCap: %d\tIsNil: %v\n", len(z), cap(z), z == nil)
```

If you run the code above, you'll see that they all pretty much do the same thing except that the first command declares a nil slice value. They are functionally equivalent as the len and cap are both zero. But the [official way](https://github.com/golang/go/wiki/CodeReviewComments#declaring-empty-slices) to declare a slice is the first one.

Do note that some libraries behave differently for nil slice value like the "encoding/json". A nil slice encodes to `null`, while `[]string{}` encodes to the JSON array `[]`.

## References

- [Go Type Assertions](https://golang.org/ref/spec#Type_assertions)
- [Go Time Formats](https://golang.org/pkg/time/#pkg-constants)
- [Declaring Empty Slices](https://github.com/golang/go/wiki/CodeReviewComments#declaring-empty-slices)
