---
title: Bypassing DRM protection to download a movie
date: '2025-05-24 19:00:00'
categories:
  - Hacking
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

The `/.drm` endpoint returned a 128 bit encryption key _(eg: 9036fb5d2f6af3c153acecd37bde6da7 in hexadecimal)_.
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
| 5    | `EXT-X-PLAYLIST-TYPE:VOD`  | Incidcates that each url points to a video                    |
| 6    | `EXT-X-KEY:METHOD=AES-128` | we see the encryption algorithm used - AES-128                |
| 7    | `EXTINF:4.000000`          | Indicates that this segment is 4 seconds long                 |

In the `EXT-X-KEY` directive, we can also see `IV=0x45454545454545454545454545454545`. That most likely represents the initialization vector of the AES-128 encryption.

<div class="section-notes">
AES-128 has different modes. The `ECB` mode that we tried earlier doesn't required an initialization vector. The `CBC` modes does require an IV.
</div>

Let's try decrypting once again using the CBC mode

```sh
openssl enc -aes-128-cbc -d -K '87807cf39672d9f399dadf0a5b071e72' \
  -iv 45454545454545454545454545454545 -in cipher-0.ts \
  -out videos/video-0.mp4
```

And voila! I was able to play the video.

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1841.9704491705165 144.782653588043" width="100%" height="100%"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
@font-face { font-family: Excalifont; src: url(data:font/woff2;base64,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); }</style></defs><g stroke-linecap="round" transform="translate(10 10) rotate(0 168.5546875 59.654296875)"><path d="M29.83 0 C127.46 -0.28, 224.41 -1.7, 307.28 0 M29.83 0 C123.48 0.59, 216.89 -0.85, 307.28 0 M307.28 0 C329.08 -1.89, 336.54 8.35, 337.11 29.83 M307.28 0 C329.12 0.01, 336.67 8.33, 337.11 29.83 M337.11 29.83 C337.79 50.22, 337.01 69.47, 337.11 89.48 M337.11 29.83 C336.79 45.38, 337.66 59.95, 337.11 89.48 M337.11 89.48 C337.1 109.92, 326.46 121.14, 307.28 119.31 M337.11 89.48 C337.07 110.18, 326.1 119.32, 307.28 119.31 M307.28 119.31 C206.52 120, 107.31 119.25, 29.83 119.31 M307.28 119.31 C222.32 121.83, 139.09 120.78, 29.83 119.31 M29.83 119.31 C10.43 119.34, -0.66 110.66, 0 89.48 M29.83 119.31 C10.68 121.31, 0.64 111.04, 0 89.48 M0 89.48 C2.48 72.43, 0.03 57.5, 0 29.83 M0 89.48 C0.77 67.93, 0.93 47.22, 0 29.83 M0 29.83 C-0.71 11.9, 8.11 0.06, 29.83 0 M0 29.83 C1.58 11.02, 8.92 2.28, 29.83 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(37.42076110839844 17.154296875) rotate(0 141.13392639160156 52.5)"><text x="141.13392639160156" y="24.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Visit the movie page.</text><text x="141.13392639160156" y="59.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">HTML contains a</text><text x="141.13392639160156" y="94.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">&lt;ContextID&gt;</text></g><g stroke-linecap="round" transform="translate(504.6193188624609 15.47405983804299) rotate(0 168.5546875 59.654296875)"><path d="M29.83 0 C122.09 -1.58, 215.66 0.13, 307.28 0 M29.83 0 C94.6 1.11, 159.65 1.62, 307.28 0 M307.28 0 C327.94 -0.44, 338.2 9.62, 337.11 29.83 M307.28 0 C325.01 0.77, 335.16 11.81, 337.11 29.83 M337.11 29.83 C337.04 41.88, 335.64 55.82, 337.11 89.48 M337.11 29.83 C338.14 42.75, 337.82 58.34, 337.11 89.48 M337.11 89.48 C336.52 107.37, 327.39 118.16, 307.28 119.31 M337.11 89.48 C336 111.39, 328.49 117.1, 307.28 119.31 M307.28 119.31 C246.32 119.06, 183.59 120.41, 29.83 119.31 M307.28 119.31 C204.77 121.31, 101.69 121.78, 29.83 119.31 M29.83 119.31 C11.55 119.91, 1.83 108.32, 0 89.48 M29.83 119.31 C11.33 119.75, -0.01 111.06, 0 89.48 M0 89.48 C-1.33 73.62, -2.16 60.14, 0 29.83 M0 89.48 C0.29 68.83, -0.88 45.34, 0 29.83 M0 29.83 C-1.18 8, 11.36 -1.44, 29.83 0 M0 29.83 C-1.28 9.15, 10.5 1.22, 29.83 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(533.4680737452734 57.62835671304299) rotate(0 139.7059326171875 17.5)"><text x="139.7059326171875" y="24.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Get the m3u playlist</text></g><g stroke-linecap="round" transform="translate(999.8808629195139 15.47405983804299) rotate(0 168.5546875 59.654296875)"><path d="M29.83 0 C99.62 0.72, 170.21 1.46, 307.28 0 M29.83 0 C94.92 -1.46, 160 -0.37, 307.28 0 M307.28 0 C326.25 -1.07, 338.04 10.33, 337.11 29.83 M307.28 0 C326.88 -1.06, 338.33 9.22, 337.11 29.83 M337.11 29.83 C336.9 52.37, 334.99 79.35, 337.11 89.48 M337.11 29.83 C336.68 48.67, 336.35 65.7, 337.11 89.48 M337.11 89.48 C335.7 108.99, 326.96 117.63, 307.28 119.31 M337.11 89.48 C339.35 110.34, 326.25 117.14, 307.28 119.31 M307.28 119.31 C201.97 121.51, 97.85 119.52, 29.83 119.31 M307.28 119.31 C204.54 118.82, 101.69 117.85, 29.83 119.31 M29.83 119.31 C8.14 119.19, -0.43 109.42, 0 89.48 M29.83 119.31 C11.1 118.47, 1.54 109.24, 0 89.48 M0 89.48 C-1.77 66.53, 0.42 44.79, 0 29.83 M0 89.48 C-0.43 74.1, 0.09 56.8, 0 29.83 M0 29.83 C1 11.83, 9.1 -0.08, 29.83 0 M0 29.83 C-1.95 11.19, 9.95 -2.08, 29.83 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(1047.3495900313303 57.62835671304299) rotate(0 121.0859603881836 17.5)"><text x="121.0859603881836" y="24.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Get the DRM Key</text></g><g stroke-linecap="round"><g transform="translate(844.6878624818589 74.25882088934611) rotate(0 76.11691590912847 -0.1527124388922516)"><path d="M0.22 -1.08 C25.97 -0.85, 128.03 0.48, 153.35 0.61 M-1.12 0.97 C24.59 0.89, 126.54 -1.25, 152.47 -1.27" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(844.6878624818589 74.25882088934611) rotate(0 76.11691590912847 -0.1527124388922516)"><path d="M129.08 7.56 C132.11 5.93, 139.42 2.15, 152.47 -1.27 M129.08 7.56 C135.64 5.26, 142.17 3.07, 152.47 -1.27" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(844.6878624818589 74.25882088934611) rotate(0 76.11691590912847 -0.1527124388922516)"><path d="M128.88 -9.54 C131.84 -7.68, 139.19 -7.98, 152.47 -1.27 M128.88 -9.54 C135.53 -7.35, 142.11 -5.05, 152.47 -1.27" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(1494.8610741705165 13.971486270253536) rotate(0 168.5546875 59.654296875)"><path d="M29.83 0 C135.29 -0.56, 241.75 -1.73, 307.28 0 M29.83 0 C135.67 0.48, 242.74 -0.03, 307.28 0 M307.28 0 C326.93 0.88, 337.05 8.47, 337.11 29.83 M307.28 0 C326.9 -0.54, 338.23 8.53, 337.11 29.83 M337.11 29.83 C337.1 43.78, 335.3 57.56, 337.11 89.48 M337.11 29.83 C337.43 42.97, 336.64 53.91, 337.11 89.48 M337.11 89.48 C337.69 109.87, 326.48 119.41, 307.28 119.31 M337.11 89.48 C339.11 110.03, 328.79 119.73, 307.28 119.31 M307.28 119.31 C220.91 117.09, 132.99 117.91, 29.83 119.31 M307.28 119.31 C247.72 119.4, 187.39 119.75, 29.83 119.31 M29.83 119.31 C7.95 121.11, 0.35 109.97, 0 89.48 M29.83 119.31 C10.87 118.42, 1.9 111.37, 0 89.48 M0 89.48 C-0.54 76.69, 0.68 63.93, 0 29.83 M0 89.48 C-0.42 67.93, 0.48 46.66, 0 29.83 M0 29.83 C-0.49 11.72, 11.85 0.25, 29.83 0 M0 29.83 C-0.58 9.52, 7.86 1.91, 29.83 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(1536.4638039678798 38.625783145253536) rotate(0 126.95195770263672 35)"><text x="126.95195770263672" y="24.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Get the encrypted</text><text x="126.95195770263672" y="59.668" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="28px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">stream</text></g><g stroke-linecap="round"><g transform="translate(1339.304125401833 70.10367570938581) rotate(0 76.62153064318193 0.35320242339406605)"><path d="M-0.47 -0.57 C25.17 -0.57, 128.01 0.64, 153.72 0.76 M1.48 1.75 C27.02 1.32, 127.73 -1, 153.03 -1.05" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(1339.304125401833 70.10367570938581) rotate(0 76.62153064318193 0.35320242339406605)"><path d="M129.66 7.83 C135.37 6.19, 144.02 3.72, 153.03 -1.05 M129.66 7.83 C136.73 5.69, 142.8 2.32, 153.03 -1.05" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(1339.304125401833 70.10367570938581) rotate(0 76.62153064318193 0.35320242339406605)"><path d="M129.42 -9.27 C135.31 -5.99, 144.03 -3.55, 153.03 -1.05 M129.42 -9.27 C136.71 -6.26, 142.86 -4.48, 153.03 -1.05" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(349.38350164504357 68.4558719826282) rotate(0 76.48084528618688 0.2676036038709526)"><path d="M0.67 1.03 C26.33 1.22, 127.88 1.26, 153.39 1.02 M-0.43 0.53 C25.13 0.39, 126.91 -0.67, 152.54 -0.65" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(349.38350164504357 68.4558719826282) rotate(0 76.48084528618688 0.2676036038709526)"><path d="M129.09 8.03 C136.74 5.99, 142.38 4.45, 152.54 -0.65 M129.09 8.03 C134.27 5.53, 140.94 3.18, 152.54 -0.65" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(349.38350164504357 68.4558719826282) rotate(0 76.48084528618688 0.2676036038709526)"><path d="M129 -9.07 C136.66 -6.79, 142.32 -4.01, 152.54 -0.65 M129 -9.07 C134.15 -7.23, 140.84 -5.25, 152.54 -0.65" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g></g><mask></mask></svg>

## Code

Now all I needed to do was write a script to download all the segments and their keys and then decrypt them individually.
And finally piece them together with `ffmpeg`.

You can find the source code at [github.com/adityathebe/drm](https://github.com/adityathebe/drm).

> To validate the approach, I purchased another movie and successfully downloaded the entire film.
