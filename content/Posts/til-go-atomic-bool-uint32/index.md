---
title: Why is Golang's atomic.Bool 32 bits (not 8 bits)
date: '2025-11-06'
categories:
  - go
slug: /til-why-is-golang-atomic-bool-32-bit
description: Exploring why Go's atomic.Bool uses 32 bits internally instead of a single byte—it's all about CPU architecture and atomic operation efficiency.
contentType: til
---

TIL that Go uses `uint32` instead of `uint8` or just `bool`.
At first glance, that seems counterintuitive because ideally a bool is just a bit. Why do we need the extra 31 bits?

**The runtime picks a 32-bit slot so it can rely on the same word-sized compare-and-swap instruction on every architecture Go supports. Some CPUs expose byte-sized atomics, but others do not guarantee them (or require strict alignment), so Go standardizes on word-aligned storage instead.**

```go
// A Bool is an atomic boolean value.
// The zero value is false.
//
// Bool must not be copied after first use.
type Bool struct {
	_ noCopy
	v uint32
}
```

Let's see how CompareAndSwap works for a bool

```go
// CompareAndSwap executes the compare-and-swap operation for the boolean value x.
func (x *Bool) CompareAndSwap(old, new bool) (swapped bool) {
	return CompareAndSwapUint32(&x.v, b32(old), b32(new))
}
```

Source: https://github.com/golang/go/blob/47a63a331daa96de55562fbe0fa0201757c7d155/src/sync/atomic/type.go#L27C1-L30C2

`CompareAndSwapUint32` is a Go-level wrapper around a lower-level atomic CAS operation in the runtime

This function is implemented in assembly.

```asm
TEXT ·CompareAndSwapUint32(SB),NOSPLIT,$0
	JMP	internal∕runtime∕atomic·Cas(SB)
```

On amd64, bool swap is implemented as shown below in assembly.

```asm
// bool Cas(int32 *val, int32 old, int32 new)
// Atomically:
// if(*val == old){
//     *val = new;
//     return 1;
// } else
//     return 0;
TEXT runtime∕internal∕atomic·Cas(SB),NOSPLIT,$0-17
    MOVQ ptr+0(FP), BX    // Load pointer address into BX
    MOVL old+8(FP), AX    // Load expected value into AX (required by CMPXCHG)
    MOVL new+12(FP), CX   // Load new value into CX
    LOCK                   // Lock prefix for atomicity
    CMPXCHGL CX, 0(BX)    // Compare AX with [BX], if equal swap with CX
    SETEQ ret+16(FP)      // Set return value based on ZF (zero flag)
    RET
```

Source: https://github.com/golang/go/blob/47a63a331daa96de55562fbe0fa0201757c7d155/src/internal/runtime/atomic/atomic_amd64.s#L22-L37
