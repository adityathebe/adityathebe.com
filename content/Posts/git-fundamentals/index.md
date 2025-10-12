---
title: Git Objects
date: '2025-10-12 15:45'
categories:
  - git
  - ai-agents
  - codex-cli
  - claude-code
featuredImage: ./featured-image.png
slug: /git-objects
description: The best way to take your git knowledge to the next level is to understand the 4 fundamental objects in git.
---

I have been using Git for almost a decade now and I'm ashamed to admit that it was only today that I decided to get into the internals of Git.
I feel like I've tried doing this before, but there just wasn't enough motivation at the time.

But today was the perfect day for it because as it just so happens I lost one of my uncommitted files due to `git reset --hard`.
It was one file - a new weekly journal I was about to publish that had notes I'd written throughout the week.
I know I had read somewhere that git still keeps file around so there's a possibility I could recover it.

I asked [OpenAI's Codex](https://developers.openai.com/codex/cli/) to recover it. It ran a whole bunch of git commands and finally reported that it was impossible to recover. My file was permanently gone!
Then, I asked [Claude Code](https://www.claude.com/product/claude-code) to do it. Interestingly, it was able to recover my files after running a few git commands.

I went through the commands that Claude ran to understand how it was able to do so, and one thing led to another, and I was already deep into Git documentation and learning about the four fundamental objects in git.

<div class="section-notes">
Since git-scm.com already does a fantastic job of explaining what the fundamental objects are, I'll focus this post on the hands-on experience of actually viewing and exploring them.
I'll also not be talking about the file recovery process - that's for another time.
</div>

<span class="paragraph-break"></span>

## Git Command Categories

Before jumping right into the git's objects internals, I think it helps to understand the git command categories

Source: https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain

As a precursor, I think it's helpful to understand that git classifies the commands as

- **Porcelain**: User facing, polished and highlevel
- **Plumbing**: Low level. End users generally do not use it.

As far as I know, it's a Git specific taxonomy.

> "because Git was initially a toolkit for a version control system rather than a full user-friendly VCS, it has a number of subcommands that do low-level work and were designed to be chained together UNIX-style or called from scripts. These commands are generally referred to as Git’s “plumbing” commands, while the more user-friendly commands are called “porcelain” commands."

<span class="paragraph-break"></span>

## Git Objects

Git has 4 fundamental objects - `blob`, `tree`, `commit`, and `tag`.

Let's create an empty repo and explore how git stores these objects and what they are.

```sh
mkdir my-project
cd my-project
git init
```

```output
Initialized empty Git repository in /Users/aditya/my-project/.git/
```

Git stores everything about the repository in a `.git` directory. Let's take a peek.

```sh
tree .git
```

```output
.git
├── config
├── description
├── HEAD
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags

9 directories, 17 files
```

By default, git creates a few place holder directories even on an empty repository.
The `.git/objects` dir comes with 2 empty directories `info` and `pack` but let's ignore them for now.

Let's create a new file and make a commit to have some objects we can explore.

```sh
echo "hello world" > first.txt
git add .
git commit -m "my first commit"
```

```output
[main (root-commit) 8dae705] my first commit
 1 file changed, 1 insertion(+)
 create mode 100644 first.txt
```

### Commit

We have a commit with hash `8dae705`. We'll be using the plumbing command `git cat-file` to view the objects.
Let's start with the commit

```sh
git cat-file -p 8dae705
```

```output
tree 2c06b36b1c3de1c0b0de9897b23c70bf835dc190
author Aditya Thebe <contact@adityathebe.com> 1760258223 +0545
committer Aditya Thebe <contact@adityathebe.com> 1760258223 +0545
gpgsig -----BEGIN SSH SIGNATURE-----
 U1NIU0lHAAAAAQAAADMAAAALc3NoLWVkMjU1MTkAAAAgOzmsUfKA9Ly4Ir4snhc6l6dWsa
 TplTM0tvrD14WJQjwAAAADZ2l0AAAAAAAAAAZzaGE1MTIAAABTAAAAC3NzaC1lZDI1NTE5
 AAAAQMO7YaDnbTdHKlp8Y42wpwAJM+EMzVRJoW5HeNU+Rc4HjvXAr+fH1vYxmIDkRJZGSA
 vgSRhG3q6QsAxzbXS/dQo=
 -----END SSH SIGNATURE-----

my first commit
```

A commit object is just a pointer to a tree object with some additional metadata like the author, commit time, signatures, commit message, and so on.
In this case, the commit points to the tree `2c06b36b1c3de1c0b0de9897b23c70bf835dc190` _(see the first line of the output)_

If you notice, we use the `-p` flag which pretty prints the contents of the object.
As you'll see in a while, `git cat-file` can print objects of all types. That should tell you that all objects have a hash (not just commits).

Try out these other flags...

```sh
git cat-file -t 8dae705 # show the object type
```

```output
commit
```

```sh
git cat-file -s 8dae705 # show the object size in bytes
```

```output
498
```

### Tree:

Since we have the tree hash, let's take a peek into it as well

```sh
git cat-file -p 2c06b36b1c3de1c0b0de9897b23c70bf835dc190
```

```output
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad    first.txt
```

```sh
git cat-file -t 2c06b36b1c3de1c0b0de9897b23c70bf835dc190
```

```output
tree
```

The output lists all the files in the project at the time of commit. That's what a tree basically is - a snapshot of the directory listing of the project.

Let's create a few more files and see how the tree appears for them

```sh
echo "another file" > second.txt
mkdir "src"
echo "console.log('hello world')" > src/index.js
```

This is what the project should look like at this stage

```sh
tree
```

```output
.
├── first.txt
├── second.txt
└── src
    └── index.js
```

Let's commit this.

```sh
git add . && git commit -m "second commit"
```

```output
[main c5fa6f4] second commit
 2 files changed, 2 insertions(+)
 create mode 100644 second.txt
 create mode 100644 src/index.js
```

Let's get the tree hash for this new commit

```sh
git cat-file -p c5fa6f4
```

```output
tree 8b5a93d517fa8c8d9825f3c711f7cef02310ad91
parent 8dae70599ee87f208e86ad4ff65e9b05bf777630
author Aditya Thebe <contact@adityathebe.com> 1760259042 +0545
committer Aditya Thebe <contact@adityathebe.com> 1760259042 +0545
gpgsig -----BEGIN SSH SIGNATURE-----
 U1NIU0lHAAAAAQAAADMAAAALc3NoLWVkMjU1MTkAAAAgOzmsUfKA9Ly4Ir4snhc6l6dWsa
 TplTM0tvrD14WJQjwAAAADZ2l0AAAAAAAAAAZzaGE1MTIAAABTAAAAC3NzaC1lZDI1NTE5
 AAAAQBJcQdTma1GZumNRb4ALX0ZY8zJJdtWq17Tzzcobg3QxgHeRUnwIxG1Rsf8IT1pT6O
 PQHeRS4OrzPS3zezQb8AY=
 -----END SSH SIGNATURE-----

second commit
```

```sh
git cat-file -p 8b5a93d517fa8c8d9825f3c711f7cef02310ad91
```

```output
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad    first.txt
100644 blob 17d5d9edf31a80878ad4911017cbd6d1d03322b8    second.txt
040000 tree 354f422855eb94b6325210f7dee06ffa8f91dfd0    src
```

Perfect, this second tree shows exactly what the project structure was like at the time of the second commit.
If you notice, the tree object stores the directory structure for just one level, and the subdirectory `src` is represented by another tree `354f422855eb94b6325210f7dee06ffa8f91dfd0`

```sh
git cat-file -p 354f422855eb94b6325210f7dee06ffa8f91dfd0 # another tree
```

```output
100644 blob cea4f10350c7c3a4acb44629234b5502c24d0989    index.js
```

We have explored commit and trees. But where are the files actually stored? That's where `blob` comes in.

### Blob:

You must have noticed, when viewing the tree object, some of the listings were blob.
Let's take a look at the blob representing first.txt file

```sh
git cat-file -p 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

```output
hello world
```

A blob object stores the content of a file **without** the metadata like size, extension, timestamp, filename, permission.
Some of those metadata are stored in the tree object while some metadata are never tracked by git like the creation timestamp.

### Tags:

Tags are pointer to another git object - most commonly a commit - with additional metadata like annotations, tagger information, and a message.

There are two types of tags in Git:

- **Lightweight tags**: Simple pointers to commits (not stored as objects)
- **Annotated tags**: Full objects stored in Git's database with tagger name, email, date, and a message

Let's create an annotated tag to explore it:

```sh
git tag -a v1.0 -m "First release"
```

To list all the tags

```sh
git tag
```

We do not need the tag's hash as `cat-file` command can also accept the tag name directly.

```sh
git cat-file -p v1.0
```

```output
object c5fa6f4cfca9fd790cb9bded39a2ae48983eddfd
type commit
tag v1.0
tagger Aditya Thebe <contact@adityathebe.com> 1760262129 +0545

First release
```

The tag points to object `c5fa6f4cfca9fd790cb9bded39a2ae48983eddfd` of type `commit`.

Run `git log` and you'll see the commit with that hash.

![_Git objects linked together_](./git-objects-link.svg)

---

## References

- https://jvns.ca/blog/2024/01/05/do-we-think-of-git-commits-as-diffs--snapshots--or-histories/
- https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
- https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain
