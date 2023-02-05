---
title: Setup mpd on your Linux system as a User service
date: '2020-01-24'
modified_date: '2020-02-24 21:05'
categories:
  - Tutorials
  - Linux
slug: /setup-mpd-in-linux-as-user-service/
featuredImage: ./mpd-linux.png
description: Learn how to setup music player daemon (mpd) as a user service on Arch Linux
---

In this tutorial we'll go through the process of setting up mpd as a user service. This is just a bare minimum installation setup. If you want customizations then you can look up dotfiles on the internet - lots of people share it. Here's [mine](https://www.github.com/adityathebe/dotfiles).

First thing first - download the `mpd` package along with the mpd clients `mpc` and `ncmpcpp`.

```bash
# On Arch
sudo pacman -S mpd ncmpcpp mpc

# On Ubuntu
sudo apt install mpd ncmpcpp mpc
```

_You can choose other mpd clients instead of ncmpcpp of course._

## Setup the config files

It's a good practice to keep all the mpd configs in the `~/.config/mpd` directory. If you don't have one create it.

Just to get started, you can copy the example config file that mpd provides.

```bash
cp /usr/share/doc/mpd/mpdconf.example ~/.config/mpd/mpd.conf
```

In order to be able to run mpd, you'll need to set up at least these parameters in the mpd.conf file

```bash
music_directory       "~/Music"
playlist_directory    "~/.config/mpd/playlists"
db_file               "~/.config/mpd/database"
log_file              "~/.config/mpd/database"
pid_file              "~/.config/mpd/pid"
state_file            "~/.config/mpd/state"
```

It's not necessary to create any of these files as mpd will itself create them. However, you'll need to create a new "playlists" directory to create new playlists.

## Start the service as a user

```bash
systemctl --user enable mpd
systemctl --user start mpd
```

Don't forget the `--user` flag !

## Update the music database

```bash
mpc update
```

For some reason this command alone does not work me. So I run an additional command

```bash
mpc ls | mpc add
```

That's it ! You should now be able to run ncmpcpp and see all your songs.
