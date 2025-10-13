---
title: Running AI agents in parallel
date: '2025-10-11 14:30'
slug: /journal/working-with-ai-agents
description: Parallel agents to brrrr ....
contentType: journal
categories:
  - ai
  - ai-agents
  - llm
  - doltgres
  - containers
  - claude-code
  - codex-cli
---

## Coding agents roles and commands

Src: https://blog.fsck.com/2025/10/05/how-im-using-coding-agents-in-september-2025/

#### Roles

Got some good prompts from this article.
Now I run multiple sessions that take on different roles. Example:

- Planner
  - interactive
  - plans in chunks
- Implementer
- Architect verifies the work of the implementer

I really like the planner session where I brainstorm with the AI to come up with a design.
I have found that it asks really good questions and addresses things that I had missed in my initial design. But it also asks too much questions which are not that important and I want it to decide for me.

#### Reviewing PR comments

> The only problem with tools like this is that our robot buddies are quite credulous. If you paste in a list of instructions for how to update a codebase, Claude's just going to take you at your word and make the changes, even if what you're asking for is crazy and wrong.

I faced a similar situation too. When I ask Claude to address GitHub Copilot's review comments, it blindly addresses them, taking them at face value.

I'm using this command `~/.claude/commands/fix-pr-comments` which works so much better.

```
Please list all the review comments in this GitHub PR: $ARGUMENTS.

Follow these steps:

- Use `gh api` to fetch comments not the `gh view --comments` command.

  example: gh api repos/flanksource/mission-control/pulls/2173/comments

A reviewer did some analysis of this PR.
They're external, so reading the codebase cold.
This is their analysis of the changes and I'd like you to evaluate the analysis and the reviewer carefully.

Note: If the suggested fix are marked as resolved, skip them

1) should we hire this reviewer? If it's an automated review give it a score from 1-10 on how good he reviews were.
2) which of the issues they've flagged should be fixed?
3) are the fixes they propose the correct ones?

Anything we *should* fix, put on your todo list.
Anything we should skip, tell me about now.
```

With this prompt, the agent usually discards nitpicks and incorrect comments on the PR.

## DoltgresSQL

Src: https://www.dolthub.com/blog/2025-10-03-100-real-world-postgres-dumps/

I came across this article and found out that this company was building a MySQL and PostgreSQL drop-in replacement in Go from scratch! That sounds really exciting but also massively challenging.

This article in particular talks about using real world postgres dumps in their test suite which is pretty clever.

I will definitely be keeping an eye on this project and hopefully consider contributing.

## Containers on MacOS !!

Src: https://www.youtube.com/watch?v=x1t2GPChhX8

Native containers are finally here in macOS.

When I migrated from Linux to macOS, one of the challenges I faced was deciding what Docker engine to use. Most people use Docker Desktop, but I decided to use OrbStack because people on Twitter were saying it is much more performant.

I haven't really noticed any performance issues, but it's also because I'm not running anything heavy on it.
However, you can tell that starting and stopping containers is so much slower.

It also feels a bit weird that I need to open a GUI to start a Docker service.

Key things about macOS containers:

- Development after hype cycle means there is no need to move fast and break things.
- Native apps available as containers
- Native to OS. No need to download 3rd party like docker on Linux.
- OCI compliant. Support Dockerfile.

## Notifications on Claude Code

One of the things that I really liked about [AMP](https://sourcegraph.com/amp) was the notification bell you get when the agent completes the task or is waiting for a user input. For some reason the notification bell does not work for me with Claude code.

Fortunately, Claude Code now provides a various set of hooks.
I have added these two hooks that will play a sound when the agent stops or needs to notify me about something.

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Blow.aiff"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

## Moving to Claude Max Plan

I have also gone all in with Claude Code subscription and upgraded to the Max Plan ($100/mo).
I was rarely hitting the token limits on the $20/mo Pro plan but I really wanted to give Opus a try - which is only available on the Max Plan.
However, after using Opus and Sonnet 4.5, I don't think Opus is any better. In fact, it's probably worse.

In order to keep my budget of $100 a month for AI tools, I had to cancel my OpenAI subscription as well as the Cursor subscription.
I don't really miss Cursor, and even if I do, the free plan will be sufficient.
However, I'm starting to like OpenAI's Codex CLI, which probably means I might need to go over my budget and get the OpenAI $20/mo subscription.

## Trying out Codex CLI

As I mentioned, I've been playing with Codex CLI. I don't really like its UX. Its permission system doesn't really make sense to me, and I hate that it doesn't even have syntax highlighting. It's also much slower than Claude.

But - what I really like about this is that it was able to solve problems that Claude couldn't. Not to say that it's better, because there have been many cases where Claude just performed better. But when you use Claude and Codex together, you get a much more intelligent agent as a whole, because you can ask Codex to review Claude's changes, and almost always it will find something that Claude missed - and vice versa.

I'll still be using Claude Code as my primary driver, but it's nice to have Codex CLI to verify Claude's work.
