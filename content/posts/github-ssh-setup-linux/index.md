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

The reason I like to use ssh over https is because I hate to provide my username and password on every remote actions like `git clone`, `git pull`, or `git push`. Sure, I could use a credential manager but why would I do that when I can simply configure ssh keys ?

On the contrary, [Github actually suggest using https over ssh](https://help.github.com/en/github/using-git/which-remote-url-should-i-use) mainly because it is the easiest to set up for novice users and https is almost never blocked by firewalls.

## Generate ssh keys

First thing first - make sure you have a `~/.ssh` directory.

```
❯ mkdir ~/.ssh
```

This is the file in which we'll store our keys and configuration for ssh.

Create an ssh key pair with `ssh-keygen` command. It'll ask you for the key name - I'd suggest using `id_rsa_github` just to stay consistent with this post.

```bash
# First navigate to the ~/.ssh directory
❯ cd ~/.ssh

# Generate the ssh key pair
❯ ssh-keygen -t rsa -b 4096 -C "<your_email>"

Generating public/private rsa key pair.
Enter file in which to save the key (/home/gunners/.ssh/id_rsa): id_rsa_github 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
```

This command generates two files: `id_rsa_github` and `id_rsa_github.pub` in your `~/.ssh` directory. One is a public key which you should upload on Github and the other is a private key that you should keep on your local computer.

## Upload the public key to Github.

Go to [https://github.com/settings/keys](https://github.com/settings/keys) and click on **New SSH Key**.

Add a suitable title and copy all the content from the `id_rsa_github.pub` file to the key section.

## Add ssh-keys

If you try to perform some remote actions, like cloning a repo, you'll get an error like this.

```bash
❯ git clone git@github.com:adityathebe/dotfiles.git
Cloning into 'dotfiles'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

This is because git does not know where to look for the ssh key (Remember the `id_rsa_github` key we generated in ~/.ssh directory?)

So to let git know that you do indeed have an ssh key use these two commands

```bash
❯ eval "$(ssh-agent -s)"

❯ ssh-add ~/.ssh/id_rsa_github
```

Now you can perform any git remote actions.

However, if you close the current terminal session and try to clone again, you'll get the same error.

You could add the keys manually again with the ssh-add command but I'll show you a much elegant way.

### Permanently add the ssh-keys

Now make sure you have the ~/.ssh/config file. If it's not there you can simply create it

```
❯ touch ~/.ssh/config
```

It's important the config file has it's permission set to 600.

```bash
❯ chmod 600 ~/.ssh/config
```

This config file is read by the ssh command on every execution.

Add the following lines to the ~/.ssh/config file.

```
Host github.com
  User git
  IdentityFile ~/.ssh/id_rsa_github
```

That's it. I hope that helps.
