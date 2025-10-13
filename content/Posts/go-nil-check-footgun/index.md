---
title: 'Golang Footgun: Why is this interface not nil?'
date: '2025-04-04 23:30'
categories:
  - Go
slug: /golang-nil-interface-check
featuredImage: ./gopher-footgun.png
description: I recently ran into this nasty bug in Go where an interface that was supposed to be nil wasn't.
---

![Gopher](./gopher-footgun.png)
_Source: Gpt-4o_

I'm gonna show you a snippet of a Go code and you tell me what the output is gonna be.

```go
package main

import "fmt"

type MyCustomType struct {}

func getResult() any {
  var t *MyCustomType
  return t
}

func main() {
  result := getResult()
  fmt.Println(result == nil)
}

// Try it out: https://goplay.tools/snippet/-axDsS493LZ
```

Here's what went through my mind:

- variable `t` is of type `*MyCustomType`
- `t` is nil
- `getResult` returns the nil `t`
- so, result must also be nil

Let's see what happens when we run the code.

```bash
go run main.go
false
```

> The crucial bit of information here is that the function returns an interface - in this case `any` or an empty interface `interface{}`.

## Explanation

In Go, an interface is a pair of a type & a value `(T, V)`.
Eg: in `var myInterface any = 3`, the interface `myInterface` has a type `int` and a value `3`.

For an interface to be nil, both its type and value must be nil. The following example shows a nil interface:

```go
var a any
fmt.Println(a == nil) // true

// Try it: https://go.dev/play/p/X0h-DCswGPG
```

It's nil because it hasn't been assigned any concrete value yet.

On the contrary, take a look at the following code:

```go
var a *int
var b any = a
fmt.Printf("typeof a: %T\n", a)
fmt.Printf("typeof b: %T\n", b)
fmt.Printf("a == nil: %v\n", a == nil)
fmt.Printf("b == nil: %v\n", b == nil)

// Try it: https://go.dev/play/p/3gq25jCzepx
```

The interface `b` is not nil as its type is `*int` and its value is `nil`.
It's important to distinguish that the interface holds in a nil pointer, but it's not nil itself.

The above program outputs:

```
typeof a: *int
typeof b: *int
a == nil: true
b == nil: false
```

> This is also addressed in the [Go FAQ](https://go.dev/doc/faq#nil_error).

## How to Check the Underlying Value for Nil

So, what's the correct way to check if the underlying value is nil when you receive an interface? 
The two approaches are:

### Type assertion

```go
package main

import "fmt"

type MyCustomType struct{}

func getResult() any {
	var t *MyCustomType
	return t
}

func main() {
	result := getResult()
	if v, ok := result.(*MyCustomType); ok {
		fmt.Printf("v is nil: %v, result is nil: %v\n", v == nil, result == nil)
	}
}

// Try it out: https://goplay.tools/snippet/MeMUtzKG9LT
```

### Reflection

Type assertion works fine when you know exactly what type the function returns.
In our case, we know that the function returns a pointer to `MyCustomType`.

But, imagine cases where getResult() could conditionally return various types.
We would need to assert all the possible types that getResult() could return.
Or, it could also return an unexported type so we cannot assert it.

In such cases, we can use reflection to check if the result is nil.

```go
package main

import (
	"fmt"
	"reflect"
)

type MyCustomType struct{}

func getResult() any {
	var t *MyCustomType
	return t
}

func main() {
	result := getResult()
	fmt.Printf("result is nil: %v\n", result == nil) // false
	fmt.Printf("result contains nil: %v\n", reflect.ValueOf(result).IsNil()) // true
}

// Try it out: https://goplay.tools/snippet/ZxJNYBW0pVz
```

I must say that using `reflection` is generally frowned upon as it adds a lot of runtime overhead. There are also some caveats.
Eg: `reflect.ValueOf(result).IsNil()` can panic for certain types like a `string` or an `int`.

Here's a generic helper function that can be used to check if the underlying value is nil.

```go
func isNil(i any) bool {
	if i == nil {
		return true
	}

	v := reflect.ValueOf(i)
	k := v.Kind()

	// Check for kinds that have a concept of nilness
	switch k {
	case reflect.Chan, reflect.Func, reflect.Interface, reflect.Map, reflect.Ptr, reflect.Slice, reflect.UnsafePointer:
		// For these kinds, IsNil() reports whether the value is nil
		return v.IsNil()
	default:
		// Other kinds (structs, basic types, arrays) cannot be nil themselves
		return false
	}
}
```

</br>
