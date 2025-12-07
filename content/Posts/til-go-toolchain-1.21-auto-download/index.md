---
title: Go v1.21+ Auto-Downloads Toolchains and Verifies Them Using a Transparency Log
date: '2025-12-07'
categories:
  - go
  - merkle tree
  - go-sumdb
  - transparency log
slug: /go-toolchain-download
description: since Go 1.21, the go command can automatically download newer toolchains—and verify them against a cryptographically auditable log. This led me down a rabbit hole into how transparency logs work, what Merkle trees actually do, and why someone is independently rebuilding every Go toolchain from source.
contentType: til
subjectSource: https://www.agwa.name/blog/post/verifying_go_reproducible_builds
---

Before Go `1.21`, if you wanted to build a project requiring a newer Go version, you had to manually install that version yourself.
Since `1.21`, go automatically downloads the required toolchain (the `go` binary, compiler, linker, etc.) and uses it to build the project - all without touching your global Go installation.

While very convenient, there's also a huge security concern in downloading a binary from the internet and running it on demand, completely transparently.
That's why the downloaded toolchains are locally verified against a transparency log.

<div class="section-notes">
Transparency logs are append-only logs that enable public auditability. They use Merkle trees - a highly optimized data structure for fast consistency verification.
</div>

Go has been using a module checksum db (Go sumdb) - a transparency log - which stores the checksum for all the go modules (that the mirror sees).
The same checksum db has been updated to support the toolchain checksum.

## Who Audits Go’s Transparency Log?

It's reassuring that Go verifies the downloaded binaries for the toolchain, but who verifies that the same transparency log is being distributed to all the users?

Let me break this down:

- A Go client downloads a toolchain and locally verifies that the toolchain's checksum is present in the transparency log.
- A different client could download a different toolchain, and Google could serve a completely different transparency log that's internally consistent with that toolchain.

So two users could have two different toolchains, yet both believe they have the correct one. This is called a **split-view attack**.

The solution is to audit that google serves the same transparency log to all users. This is where auditors come in.

Andrew Ayer in his blog post - https://www.agwa.name/blog/post/verifying_go_reproducible_builds - mentions that he has been running an independent auditor for Go's checksum database since 2020 - https://sourcespotter.com/

Sourcespotter independently builds the toolchain for every new release and verifies that against the Go sumdb.

## Verifying Reproducibility vs Consistency

It's important to distinguish what exactly the auditor is doing.

**For regular Go modules**, the auditor only verifies _consistency_. It doesn't download every module, build it, and check that the checksum matches. That would be impossible at scale since there are millions of modules. Instead, it just watches the log over time, making sure Google doesn't alter old entries or serve different versions to different people.

I don't understand how this works exactly. A naive solution would be

```python
store_checksum_for_all_modules_to_db()

loop:
  for module in fetch_checksum_for_all_modules_from_sumdb():
    checksum_in_db = db.get_module_checksum(module.path)
    if not checksum_in_db:
      store_to_db(module)
      continue

    if checksum_in_db != module.checksum:
      alert("mismatch")
```

Of course, it doesn't work this way. In fact, the auditor stores a single root hash (not millions for each module) and can mathemtically verify that the tree hasn't been tampered - I just don't know how.

**For toolchains** however, the auditor also verifies [_reproducibility_](https://sourcespotter.com/toolchain/). Since there are relatively few toolchain releases (a few thousand across all versions and platforms), Source Spotter can actually download the source code, build each toolchain independently, and confirm the resulting binary matches the checksum Google published. This ensures the published binaries really are what you'd get if you built from source yourself.
