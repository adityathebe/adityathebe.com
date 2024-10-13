---
title: An intro to video files & codecs
date: '2024-10-10'
categories:
  - video
slug: /video-files-and-codecs
description: Learn to build a twitter bot with NodeJs and Javascript in under 50 lines of code.
---

For the past couple of years I have been running Jellyfin on my [homelab](https://github.com/adityathebe/homelab); think of it as a self-hosted Neflix.
I host all of my movies & TV shows in there and then watch them from various clients - mobile app, TV & web app.
It's a great piece of software - however I don't particularly use its webapp.
The reason being - it doesn't play **some** movies very well.
It stutters so much and the server cpu usage goes through the roof.

And that's why I prefer to watch the movies on Jellyfin from my media player instead of from the web app.
To do that, I simply grab the stream URL from Jellyfin and play it on the media player as

```sh
mpv '<jellyfin-stream-url>'

# or
# vlc '<jellyfin-stream-url>'
```

I had very little idea why some movies wouldn't play well on the web UI.
And interestingly, on the other hand, the TV app handles pretty much any video with ease.

Now, I wasn't totally clueless here. I knew that _some_ videos needed to be transcoded with `ffpmpeg`
and that pins the CPU to 100% _(I don't have GPU attached so the transcoding is entirely performed on the CPU)_. But I didn't really know why that was required for some videos
and not for others. And honestly, I didn't know what "transcoding" was to begin with.

This curiousity led me to learn quite a bit about video files and ultimately
to write this blog post.

## The two defining characterstics of a video file

The unusual thing about video files is that the file extension doesn't tell
you anything about the video format.

When you encounter an `.mp3` file, you know that the file contains an mp3 encoded
audio data. Likewise, a `.jpeg` file contains a jpeg encoded image and a `.json` file contains json encoded
data.

> Aside: I know you can rename the file to have an
> incorrect extension, but let's assume that the file is named correctly with the appropriate extension.

However, with video files, the extension doesn't give you the entire picture about
what's inside the file. Your media player could support one `.mp4` file but may not support another `.mp4` file.
i.e. two different mp4 files may have been encoded with two separate codecs.

A video content thus has two distinct characterstics that defines it

- the file type (commonly referred to as the Container)
- the encoding algorithm (Compression / Codec)

## Containers

The thing that we commonly refer to as the video format like `mp4`, `mkv`, `flv` are actually
the just the file types. They are containers.

Think of them as different types of lunchboxes:

- The container alone doesn't reveal its contents.
- Some containers are like multi-compartment lunchboxes, capable of neatly organizing different "food items" (such as multiple audio tracks or subtitle files).
- What the container does indicate is its capacity and structure.

Some popular container formats are: `mp4`, `mkv`, `3gp`, `wEBm`, `flv`, `avi`, ...

Container formats differ from each other in various ways but here are some prominent defining characterstics

| **Characteristic**          | **Description**                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Compression**             | Different formats use various compression algorithms, such as H.264, VP8/VP9, or lossless codecs like FLAC.                    |
| **Metadata support**        | Ability to store metadata, including subtitles, chapter markers, and custom tags.                                              |
| **Audio and video tracks**  | Some formats support multiple audio and video streams, while others are limited to a single track.                             |
| **Compatibility**           | Different formats have varying levels of compatibility with different devices, operating systems, or software applications.    |
| **Licensing and royalties** | Container formats may be open-source (e.g., WebM, OGG/OGV), proprietary (e.g., MP4), or require royalties for use (e.g., FLV). |

## Codecs

Codecs are notoriously difficult to implement (that's what I've read).

As a general user, it's helpful to be aware of the codecs of a video file because that will tell you whether your video player can play the video file or not.
As a video provider, it's helpful to encode your videos in the most efficient but also with the most compatible codecs. Else the client will require transcoding.
As a videographer, it's helpful to be mindful of the codec.

Some popular codecs are:

| Codec              | Description                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| H.264 _(**AVC**)_  | most popular and most well-supported codec                                                                                                                                                                                           |
| H.265 _(**HEVC**)_ | More efficient than H.264 i.e. similar quality with lesser file size. However, has lesser support and it's patented. In fact, on windows, you need to purchase the codec for $0.99 from Microsoft - but there are free alternatives. |
| VP9                | _(Open source)_ developed by Google and YouTube uses this.                                                                                                                                                                           |
| AV1                | _(Open source)_ relatively newer and the considered the future of video compression. Isn't supported widely.                                                                                                                         |

## Encoders

There are currently three AV1 encoders supported by FFmpeg: libaom (invoked with libaom-av1 in FFmpeg), SVT-AV1 (libsvtav1), and rav1e (librav1e).

## Decoders are video players

---

In short

> the codecs define the compression and quality of the video content.
> the containers then package the encoded video content. Not all codecs are supported by a container. Example: an mp4 file can contain an AV1 encoded video content but 3GP can't.
