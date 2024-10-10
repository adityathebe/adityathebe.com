---
title: An intro to video files & codecs
date: '2024-10-10'
categories:
  - video
slug: /video-files-and-codecs
description: Learn to build a twitter bot with NodeJs and Javascript in under 50 lines of code.
---

I have been running Jellyfin _(think of it as a selfhosted Netflix)_ for the past
couple of years. It's a great piece of software however I don't really use its webapp.
The reason being - it doesn't play **some** movies very well.
It stutters so much and the server cpu usage goes through the roof.
And that's why I usually get the stream URL from Jellyfin and play that on mpv.

```sh
mpv '<jellyfin-stream-url>'
```

The TV app on the other hand works extremely well.

I had very little idea why some movies wouldn't play well on the web UI. I knew
that the server's CPU usage went high because `ffpmpeg` was transcoding the
video for the client but I didn't really know why that was required for some videos
and not for others.

This curiousity led me to learn quite a bit about video files and ultimately
to write this blog post.

## The two defining characterstics of a video file

When you see a file with `.json` extension you
know that the file contains JSON data (yes, you can rename the file to have an
incorrect extension, but let's ignore for the sake of simplicity).

What I'm trying to get at is usually it's trivial to know what the file contains
by simply looking at the extension.

Video files, on the other hand, are a bit unusual.

Very few people could tell you about the difference between a video file
container and a codec even though it's something we've been acquainted with for years.
We know `mp4` and `mkv` as video formats whereas they really aren't.
Unlike, audio content, video contents are a bit more complex.

A video content is first encoded and then packaged into a container.

Some popular codecs are:

| Codec              | Description                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| H.264 _(**AVC**)_  | most popular and most well-supported codec                                                                                                                                                                                           |
| H.265 _(**HEVC**)_ | More efficient than H.264 i.e. similar quality with lesser file size. However, has lesser support and it's patented. In fact, on windows, you need to purchase the codec for $0.99 from Microsoft - but there are free alternatives. |
| VP9                | _(Open source)_ developed by Google and YouTube uses this.                                                                                                                                                                           |
| AV1                | _(Open source)_ relatively newer and the considered the future of video compression. Isn't supported widely.                                                                                                                         |

Some popular container formats are:

- MP4
- MKV
- 3GP
- WebM
- FLV
- AVI

> In short
>
> - the codecs define the compression and quality of the video content
> - the containers then package the encoded video content. Not all codecs are supported by a container. Example: an mp4 file can contain an AV1 encoded video content but 3GP can't.

## Containers

MKV is one of the most featureful container format.
It can contain multiple video streams, audio streams (movie audio in different languages), subtitles, etc.

## Codecs

Codecs are notoriously difficult to implement (that's what I've read).

As a general user, it's helpful to be aware of the codecs of a video file because that will tell you whether your video player can play the video file or not.
As a video provider, it's helpful to encode your videos in the most efficient but also with the most compatible codecs. Else the client will require transcoding.
As a videographer, it's helpful to be mindful of the codec.

## Encoders

There are currently three AV1 encoders supported by FFmpeg: libaom (invoked with libaom-av1 in FFmpeg), SVT-AV1 (libsvtav1), and rav1e (librav1e).

## Decoders are video players
