# Shared tmux session (pairing with the human)

This repo has a `.tmuxinator.yml` that starts a three-pane tmux session named
`testkitchen` so the human and Claude Code can watch the same dev-server output
and shell commands live: **claude** (the Claude Code CLI itself,
`testkitchen:main.0`), **server** (runs `pnpm dev` — the Next.js dev server,
`testkitchen:main.1`), and **shell** (arbitrary commands,
`testkitchen:main.2`). The human starts it with `tmuxinator local` (or
`mux local`) from the project root, which also attaches their terminal to it.

If a `testkitchen` tmux session already exists (check with
`tmux has-session -t testkitchen`), use it instead of your plain Bash tool for
any command the human would want to watch live — pair-programming style, where
Claude drives and the human watches rather than typing over it:

- Send a command: `tmux send-keys -t testkitchen:main.2 "the command" Enter`
- Read the result: `tmux capture-pane -t testkitchen:main.2 -p`
- Check dev-server output the same way against `testkitchen:main.1`

## Restarting the dev server

Restarting the dev server is Claude's job, not the human's — keep the local dev
server working rather than reporting it broken and waiting. Restart it in the
server pane with:

```sh
tmux send-keys -t testkitchen:main.1 C-c    # then give it a couple of seconds
tmux send-keys -t testkitchen:main.1 "pnpm dev" Enter
tmux capture-pane -t testkitchen:main.1 -p  # confirm Next.js reports "Ready"
```

Otherwise leave that pane alone — it's just `pnpm dev` running. Ordinary app
code (`app/**`, `components/**`, `lib/**`) reloads on its own via Fast Refresh
and needs no restart. A restart is required whenever the running process can't
pick a change up by itself:

- **Installing or removing a dependency** — run `pnpm install` (its
  `postinstall` regenerates the Prisma client) before restarting.
- **Editing `next.config.ts`, `.env*`, or `middleware.ts` config** — the dev
  server reads these once at boot. Fast Refresh won't apply them; the stale
  values silently persist, which is a confusing way to lose time.
- **Prisma schema changes** — regenerate the client with `pnpm install` (or
  `pnpm db:generate`) so `@/generated/prisma/client` matches the schema,
  then restart.

## When you switch to a git worktree

Move the whole session into it. All three panes (claude, server, shell) should
`cd` into the worktree so the human watches the same tree you're editing, not
the main checkout. In particular, if the dev server is running, restart it in
the worktree — stop it in the server pane, `cd` to the worktree, run
`pnpm install` (a fresh worktree has no `node_modules` or generated Prisma
client — see the pre-push note in `AGENTS.md`), then `pnpm dev`. Otherwise it
keeps serving the main checkout's code and none of your changes show up. Switch
the panes back to the project root once you're done with the worktree.

## Falling back to plain Bash

Quick, inconsequential lookups the human doesn't need to see (e.g. a one-off
`grep`) can still go through the normal Bash tool. If no `testkitchen` session
exists, fall back to the normal Bash tool for everything — don't create the
session yourself; that's the human's call via `tmuxinator local`.
