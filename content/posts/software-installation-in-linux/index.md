---
title: Several ways to install softwares in a Linux system
date: '2020-01-27'
categories:
  - Tutorials
  - Linux
slug: /how-to-install-softwares-in-linux
featuredImage: ./linux-software-installation.jpg
description: Learn several ways to install softwares in your linux system
---

One of the main reasons I migrated to Linux from Windows was the ease of software installation. I could install anything with just a few comamnds from the command line. Life was fun and easy until it wasn't when I had to install a software which wasn't in the distro's software repository.

In Windows, almost every software provides an installation wizard but that's rarely the case in Linux.

So, what are some other ways to install a software when it's not available to install via the package manager? Well, some softwares provide the source code, which could be in C, C++, Go, ... you name it, and you're supposed to compile them. I have to say this is not an easy thing to do although I've never done it myself.

Conveniently, you can also find the compiled binary. It may be provided by the official software developers or by some third party. The compiled binary is usually archived in a single [tar](<https://en.wikipedia.org/wiki/Tar_(computing)>) file. All you need to do is download the tar file, extract it and then run the binary file inside the extracted folder.

To give you a brief overview of this post, I will be explaining 4 different ways to install softwares in linux.

## 1. Distro's Package Manager

This is my preferred way of installing softwares because the package manager makes it extremely easy, to not only just install, but also, to update and remove the softwares in future. Ubuntu uses `apt` for package management and so does Debian and Linux Mint. Different distros have different package managers. Arch based distros use `pacman`, Red hat uses `rpm`, CentOS uses `yum` ...

Every distro has its own set of software repositories. What may be available to install with `apt` in Ubuntu may not be available to install in Debian even though both distros use `apt`.

The package manager a distro provides can be a deciding factor in choosing a distro for many people. To give you an example: Debian is known for its solid stability and the software in its official repositories may not be the latest release but a stable one. So Debian may not be a good choice for people who want the latest bleeding edge softwares.

The package manager will not always be able to help you because well obviously the software repository cannot include every software in the world.

## 2. A programming language's package manager

Some softwares are available to install through a programming language's package manager. Python has `pip`, NodeJs has `npm` (or `yarn`), GoLang provides the convenient `go get` command and there are a lot others.

Some of the softwares I install via a programming language's package managers are

- [localtunnel](https://github.com/localtunnel/localtunnel), [tldr](https://github.com/tldr-pages/tldr), [http-server](https://github.com/http-party/http-server), (via NPM)
- [wpm](https://github.com/cslarsen/wpm), [sublist3r](https://github.com/aboul3la/Sublist3r), [httpie](https://github.com/jakubroztocil/httpie) (via pip)
- amass (via go get)

It goes without saying that you need to have the programming language and the package manager installed. As far as I know, the package manager does come along when you install the programming language.

## 3. Compiled binary

The above two methods are fairly straightforward. Now comes the time to get our hands dirty.

As I already mentioned, you can install some softwares by simply downloading the compiled binary. The compiled binary is almost always packaged in a single tar archive file. In some rare cases you may find a zip or a rar archive.

Jetbrain provides the [compiled binary for its IDEs](https://www.jetbrains.com/idea/download/#section=linux). Check out the image below and look there's the tar file I told you about.

![](./intellij-download-tar.png)

Likewise, if you want to [install postman](https://www.getpostman.com/downloads/) you also need to download the tar file.

Once you download the tar file you can extract it with the `tar` command

```bash
# Extract a (compressed) archive into the current directory:
tar xf source.tar[.gz|.bz2|.xz]

# Extract an archive into a target directory:
tar xf source.tar -C directory
```

## 4. Compile the source code
