---
title: Configure ssh keys on Github
date: '2020-01-24 23:30'
categories:
  - Tutorials
  - Git
  - Linux
slug: /configure-ssh-key-github
featuredImage: ./ssh-github.png
description: Set up ssh keys on your github account
---

First thing first - make sure you have a `~/.ssh` directory.

```
mkdir ~/.ssh
```

Create an ssh key pair with `ssh-keygen` command. It'll ask you for the key filename - make sure to provide the full path like `/home/gunners/.ssh/name-of-the-key`.

_Replace 'name-of-the-key' with a name you prefer - I'd suggest using `id_rsa_github` just to stay consistent with this post_.

```bash
ssh-keygen -t rsa -b 4096 -C "<your_email>"

# Generating public/private rsa key pair.
# Enter file in which to save the key:
# Just skip the passphrase (although it's up to you to choose)
```

This command generates two files: `id_rsa_github` and `id_rsa_github.pub` in your `~/.ssh` directory.

Now make sure you have the ~/.ssh/config file. If it's not there you can simply create it

```
touch ~/.ssh/config
```

It's important the config file has it's permission set to 600.

```bash
chmod 600 ~/.ssh/config
```

Add the following lines to your `~/.ssh/config` file.

```ssh
Host github.com
  User git
  IdentityFile ~/.ssh/id_rsa_github
```

This is all we need to do in your system. Now the only thing that remains is to simply upload the public key we generated to Github.

Go to [https://github.com/settings/keys](https://github.com/settings/keys) and click on **New SSH Key**.

Add a suitable title and copy all the content from the `id_rsa_github.pub` file to the key section.

That's it. I hope that helps.
