---
title: Backup your GitHub repositories now!
date: '2025-10-19'
categories:
  - backup
  - self-hosted
  - github
  - git
slug: /backup-github
featuredImage: ./image.png
description:
  Account suspensions on GitHub are unpredictable and appeals take months. Here's how I use gickup to automatically backup all my repositories daily with a simple,
  hands-off setup.
---

Over the past few days, I've been seeing a surge of posts on Twitter regarding GitHub account suspension.

<div style="display: flex; gap: 1em; flex-wrap: wrap;">

![](./grimcodes-github-suspended.png)
_https://x.com/grimcodes/status/1977471153011933375_

![](./vmfunc-github-suspended.png)
_https://x.com/ThePrimeagen/status/1978261656573501510_

</div>

This isn't new. In February 2024, even [GitHub's co-founder and ex-CEO, Chris Wanstrath, had his account suspended](https://news.ycombinator.com/item?id=39267200).
Of course, GitHub immediately responded and removed the suspension for him but the rest of us may not be so fortunate.

Here's a bunch of other such incidents

- [A student lost access to their bachelor's thesis and work repositories for **2 months**](https://github.com/orgs/community/discussions/171069) due to GitHub Education verification issues
- [Developers waiting **up to 120 days**](https://github.com/orgs/community/discussions/116763) for appeal responses
- Account suspended when trying out [Codespaces](https://github.com/orgs/community/discussions/48787) and no response for over a month
- Account suspended when [submitting multiple bug reports](https://github.com/orgs/community/discussions/48787#discussioncomment-5296577)

GitHub's automated systems can flag accounts without warning, and appeals can take months. The solution? Keep your own backups.

## Backup with gickup

I'm using [gickup](https://github.com/cooperspencer/gickup) to backup my repositories hosted on GitHub. I run it on Kubernetes as a [CronJob](https://github.com/adityathebe/homelab/blob/main/kubernetes/apps/default/gickup/helmrelease.yaml), but you can also use gickup's built-in cron runner.

I schedule daily backups, which is sufficient since actively developed repos are typically already cloned on my machine.

I'm currently backing up to the local filesystem, which is backed up separately but gickup also offers backing up to various remotes like - GitLab, Gitea, Gogs, OneDev, Sourcehut, S3.

> **Disclaimer**: This post is not sponsored or affiliated with gickup in any way. I'm sharing my personal backup solution that works for me. See the "Alternative Tools" section at the end for other options.

## Setup

1. **Create a GitHub Personal Access Token** with `repo` scope - https://github.com/settings/personal-access-tokens
2. **Configure** - create a `conf.yaml` with your GitHub username and backup destination

Here's my `conf.yaml`

```yaml
source:
  github:
    - token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      user: adityathebe
      exclude:
        - adityathebe/DefinitelyTyped # too Large, idc
        - DefinitelyTyped

destination:
  local:
    - path: '/data/github-backups'
      structured: true
      mirror: true
      lfs: false # setting this true was 100x slower
```

> Instead of providing the github token on the config file, you can also set the `GITHUB_TOKEN` env var.

Key points:

- **Source**: All my GitHub repositories (excluding a few large ones)
- **Mirror mode**: This backs up all git refs (branches, tags, and pull request refs)
- **Structured**: Creates organized folders for each repository

Once configured, it's completely hands-off.

## Restoration

```sh
git clone gickup/github-backups/github.com/adityathebe/nvim.git
```

```output
Cloning into 'nvim'...
done.
admin@truenas[/mnt/mega/aditya/backups]$
```

## Alternative Tools

While I use gickup, there are several other tools available for backing up GitHub repositories:

- **[git-backup](https://github.com/ChappIO/git-backup)** - A simple tool for backing up git repositories
- **[Gitea mirror feature](https://www.reddit.com/r/selfhosted/comments/u6dww1/a_simple_way_to_backup_all_your_github_and_gitlab/i580m8f/)** - Use Gitea's built-in mirroring capabilities to backup repositories
- **[GitHub-Backup](https://github.com/clockfort/GitHub-Backup)** - Another backup solution for GitHub repositories

_Note: I haven't personally tested these alternatives, but they may better suit your specific needs._
