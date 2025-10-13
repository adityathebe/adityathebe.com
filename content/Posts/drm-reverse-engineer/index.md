---
title: Bypassing DRM protection to download a movie
date: '2025-05-24 19:00:00'
categories:
  - Hacking
  - drm
slug: /download-drm-protected-video
description: Here's how I obtained a DRM protected video with Go and FFMPEG.
---

In this article, I'll walk you through the process of how I managed to reconstruct a complete video file from encrypted video stream segments.
At the end of the article, you'll also find the source code for the script that I used to download the video.

I recently bought a movie from a platform that was very restrictive. You could only watch the movie for a very limited period of time and from a very limited number of devices.

I'm a media hoarder and naturally I wanted to download the movie for later.
However, downloading it was not trivial as you'll see in a bit.

I couldn't resist the temptation to roll up my sleeves and reverse-engineer the stream.
With a few hours of investigation and scripting, I was able to bypass the protection and piece together the entire movie using `go` & `ffmpeg`.

> Needless to say, the movie was not distributed and is only being used personally.

## The usual approach

Generally, whenever I need to download a video, I grab the URL and pass that on to my trusty `yt-dlp` tool.

```sh
yt-dlp 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
```

<div class="section-notes">
<code>yt-dlp</code> is a command line tool that can download videos from pretty much any website. I use it to download videos from Reddit, Instagram Reels, TikTok, Facebook and most often from YouTube.
</div>

For other websites, I open the developer tools, go to the network tab, filter by media, and then grab the video stream URL.

But this time, the movie didn't have a single URL. In fact, there were no network calls showing up under the media category at all.

## Reconnaissance

What I noticed is that there were a lot of HTTP calls to different segments of the video.

```
/<ContentID>/1080p/video-0.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
/<ContentID>/1080p/video-1.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
/<ContentID>/1080p/video-2.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
/<ContentID>/1080p/video-3.ts?v=1&resolution=1080p&server=1223&contextId=<ContextID>
/<ContentID>/1080p/video-4.ts?v=1&resolution=1080p&server=1223&contextId=<ContextID>

Where
  - <ContentID> is the UUID of the movie
  - <ContextID> seems to be a session specific identifier. It's a 32 character long base64 encoded string.
```

This endpoint returned a binary data of content type `video/mp2t` - which is just a stream of digital media. I tried downloading one of the segments and playing it with VLC but that didn't work.

In between those calls, there were also calls to get some sort of key

```
/.drm/<ContextID>/1080p.drmkey?v=0
/.drm/<ContextID>/1080p.drmkey?v=1
/.drm/<ContextID>/1080p.drmkey?v=2
```

This endpoint also returned binary data. The name `drmkey` in the url was quite interesting.
Upon googling, I found out that drm stands for Digital Rights Management and it relies on encryption to protect the content.

At this point I was almost certain that the

- `/<ContentID>/1080p/video-N.ts` endpoint was returning a small encrypted segment of the video and
- the `/.drm` endpoint was returning the encryption key for the web client to decrypt it.

If I could figure out the encryption algorithm used then I could download all the segments and the keys and then decrypt them one by one.

### Encryption algorithm

The `/.drm` endpoint returned a 128-bit encryption key _(e.g. 9036fb5d2f6af3c153acecd37bde6da7 in hexadecimal)_.
That's a strong signal that it's most likely using AES-128 - a very popular symmetric encryption algorithm.

With the ciphertext (from `/<ContentID>/1080p/`) and the encryption key in hand, I tried decrypting it using `openssl`

```sh
openssl enc -d -aes-128-ecb -in video-0.ts -out videos/first.mp4 -K 87807cf39672d9f399dadf0a5b071e72 -nopad
```

However, when I tried to play the resulting file in VLC, it didn’t work – nothing happened.

I went back to examine the network traffic and found another intriguing endpoint:

```
/<ContentID>/1080p/video.drm?contextId=<ContextID>
```

It returned a plain-text response like this

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-KEY:METHOD=AES-128,URI="https://drm-key-redacted.com/.drm/<ContextID>/1080p.drmkey?v=0",IV=0x45454545454545454545454545454545
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video0.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video1.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video2.ts?v=0&resolution=1080p&server=1223&contextId=<ContextID>
#EXT-X-KEY:METHOD=AES-128,URI="https://drm-key-redacted.com/.drm/<ContextID>/1080p.drmkey?v=1",IV=0x45454545454545454545454545454545
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video3.ts?v=1&resolution=1080p&server=1223&contextId=<ContextID>
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video4.ts?v=1&resolution=1080p&server=1223&contextId=<ContextID>
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video5.ts?v=1&resolution=1080p&server=1223&contextId=<ContextID>
#EXT-X-KEY:METHOD=AES-128,URI="https://drm-key-redacted.com/.drm/<ContextID>/1080p.drmkey?v=2",IV=0x45454545454545454545454545454545
#EXTINF:4.000000,
https://redacted-cdn.com/<ContentID>/1080p/video6.ts?v=2&resolution=1080p&server=1223&contextId=<ContextID>
#EXTINF:4.000000,

...

Trimmed for brevity & sensitive parts have been redacted.
The file was around 4000-5000 lines long
```

#### M3U8

Now that's something! It's a `m3u8` file which contains a list of urls to all the segments of the video file.

<div class="section-notes">
An M3U file is a plain text file that specifies the locations of one or more media files. Although originally designed for audio files, such as MP3, it is commonly used to point media players to audio and video sources, including online sources.
</div>
There are some pretty interesting stuff in here. Let's go through them

| Line | Directive                  | Description                                                   |
| ---- | -------------------------- | ------------------------------------------------------------- |
| 2    | `#EXT-X-VERSION:3`         | uses the extended version 3 of `m3u` that supports encryption |
| 5    | `EXT-X-PLAYLIST-TYPE:VOD`  | Indicates that each url points to a video                     |
| 6    | `EXT-X-KEY:METHOD=AES-128` | we see the encryption algorithm used - AES-128                |
| 7    | `EXTINF:4.000000`          | Indicates that this segment is 4 seconds long                 |

In the `EXT-X-KEY` directive, we can also see `IV=0x45454545454545454545454545454545`. That most likely represents the initialization vector of the AES-128 encryption.

<div class="section-notes">
AES-128 has different modes. The `ECB` mode that we tried earlier doesn't require an initialization vector. The `CBC` modes does require an IV.
</div>

Let's try decrypting once again using the CBC mode

```sh
openssl enc -aes-128-cbc -d -K '87807cf39672d9f399dadf0a5b071e72' \
  -iv 45454545454545454545454545454545 -in cipher-0.ts \
  -out videos/video-0.mp4
```

And voila! I was able to play the video.

![Diagram showing how the encrypted stream and keys are retrieved](./drm-reverse-engineer-diagram.svg)


## Code

Now all I needed to do was write a script to download all the segments and their keys and then decrypt them individually.
And finally piece them together with `ffmpeg`.

You can find the source code at [github.com/adityathebe/drm](https://github.com/adityathebe/drm).

--

In hindsight this was pretty straightforward.
The endpoints hinted the use of DRM and it turns out most modern DRM technologies use AES with 128-bit keys [_[1]_](#ref-1).

> To validate the approach, I purchased another movie and successfully downloaded the entire film.

## References

<div id="ref-1">
<i>[1]</i>. https://docs.axinom.com/services/drm/general/what-is-drm/
</div>

</br>
</br>
