---
title: An overview of the gzip & zip file formats
date: '2024-07-20 12:30'
categories:
  - Linux
  - Compression
slug: /gzip-zip-overview
description: This blog post explores the differences between gzip and zip, two popular file compression formats
---

I just finished listening to an episode of the ShipIt podcast - [Tars all the way down](https://changelog.com/shipit/105) -
where Jon “gzip enthusiast” Johnson talks about gzip, zip & Deflate. The episode goes on to talk about efficiently & randomly accessing
the bits of compressed data from container images.

This episode led me to scratch my long outstanding itch to understand - or at least acquaint myself with - the popular compression tools.
Naturally, this post isn't going to be anything in-depth. I took a peek at the compression world and boy it's deep.

In the Linux world gzip along with tar is extremely popular. It wouldn't be inaccurate, in my opinion, to say that gzip is the
defacto compression tool & tar is the defacto archive format. It's the format most software is distributed.

On the other hand, on Windows, it's probably zip.

Let's explore their differences.

> gzip and zip are file formats, not compression algorithms. They can also mean the command line tools.

gzip can only compress one file at a time. So, how do we gzip a directory then? That's where you need an archiving tool
to first archive all the files and directories inside the directory into a single file - the archive. And then the archive is compressed.
As gzip compresses the archive as a single unit, it can optimize better and produce a more efficient smaller output.

In the words of the creator himself

> "tar + gzip compresses better than zip, since the compression of the next file can use history from the previous file (sometimes referred to as a "solid" archive). zip can only compress files individually.
>
> -> See comments: https://stackoverflow.com/a/20765054/6199444"

![GZIP](./gzip.svg)

On the other hand, zip compresses one file at a time and then creates an archive. Since it's only compressing one file at a time,
it doesn't do as good of a job in compression. Usually, gzip produces smaller output.

However, an advantage that zip offers over gzip is that you can browse the zipped archive without uncompressing the entire thing.
zip files have a central directory at the end, which provides a list of the contents. This along with the fact that each files are compressed
individually makes this possible. That's why you might have noticed, that on Windows you can simply open & browse through a zip file without uncompressing it first.

![ZIP](./zip.svg)

## Compression algorithms under the hood

gzip uses the Deflate method for compression which in turn uses `LZ77` and `Huffman encoding` compression algorithms.

While zip also uses the same two algorithms, it can replace them with a wide variety of other algorithms that offer different balances between the speed of compression & the efficiency of the compresion.
Example: zip can use `LZMA` instead of `LZ77` and produce smaller output but at the cost of compression speed.

The ZIP format supports several compression methods:

```
Source: https://stackoverflow.com/a/20765054/6199444

0 - The file is stored (no compression)
1 - The file is Shrunk
2 - The file is Reduced with compression factor 1
3 - The file is Reduced with compression factor 2
4 - The file is Reduced with compression factor 3
5 - The file is Reduced with compression factor 4
6 - The file is Imploded
7 - Reserved for Tokenizing compression algorithm
8 - The file is Deflated
9 - Enhanced Deflating using Deflate64(tm)
10 - PKWARE Data Compression Library Imploding (old IBM TERSE)
11 - Reserved by PKWARE
12 - File is compressed using BZIP2 algorithm
13 - Reserved by PKWARE
14 - LZMA
15 - Reserved by PKWARE
16 - IBM z/OS CMPSC Compression
17 - Reserved by PKWARE
18 - File is compressed using IBM TERSE (new)
19 - IBM LZ77 z Architecture
20 - deprecated (use method 93 for zstd)
93 - Zstandard (zstd) Compression
94 - MP3 Compression
95 - XZ Compression
96 - JPEG variant
97 - WavPack compressed data
98 - PPMd version I, Rev 1
99 - AE-x encryption marker (see APPENDIX E)
```

Formats 0 & 8 are by far the most used ones - 8 more so.

## Use cases

gzip (along with tar) is more common in the Unix world than zip.
tar preserves all of the Unix file attributes, whereas zip was not designed to do that.

gzip also supports decompressing data streams which is why it's popular in network transfer.
HTTP widely uses gzip.

zip is preferred when portability and random access are required.
