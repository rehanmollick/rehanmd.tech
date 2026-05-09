# CLAUDE.md — rehanmd.tech

This file is the per-project guidance Claude Code reads on every session in
this repo. **The single source of truth for architecture, file tree, and
content workflow is [`summary.md`](./summary.md)** — read that first if you
haven't.

## Hard rules

1. **Author every commit as `rehanmollick <rehanmollick07@gmail.com>`.**
   Don't change git config.
2. **Never** include "Claude", "Anthropic", or any AI attribution in commit
   messages, PR descriptions, or commit footers (`Co-Authored-By` etc.).
3. Use **conventional commits**: `feat:`, `fix:`, `chore:`, `refactor:`,
   `docs:`. Granular — one logical change per commit.
4. Push **after every commit** so the contributions graph reflects the work
   in real time. The user explicitly wants high commit volume on the
   `rehanmollick` GitHub account.
5. **Do not regress aesthetics.** See `summary.md` §8 for the full guardrail
   list — but the headline is: hero stays the R3F train scene, no light
   mode, retro pixel typography stays sharp, the metro line is jagged (45°
   jogs, not bezier curves).
6. The R3F train components (`src/components/three/*`) are the part the user
   worked hardest on. **Don't modify them** unless explicitly asked.

## Adding content

- **Project**: new folder `public/projects/<id>/project.md` + image siblings.
- **Dispatch (blog)**: new folder `public/dispatches/<slug>/dispatch.mdx`.
- **About bulletin edits**: `public/about/about.md`.

See `summary.md` §3 for the full frontmatter shapes. The user might give you
a GitHub repo URL and ask "is this worth adding?" — read the README, decide,
and write the `project.md` if yes.

## Workflow shortcut

When you start a session and the user gives you a content task, the right
move is usually:

1. `Read summary.md` (skim §3 + §4 + §6 + §8).
2. Make the change as instructed.
3. Verify `npm run build` passes.
4. Commit + push.
5. Open a PR + merge it via `gh pr merge <n> --merge --admin --delete-branch`
   so the activity feed shows another PR + merge by `rehanmollick`.

If unsure about an aesthetic decision, ask the user before changing visuals.

## What was removed (so you don't re-add it)

The codebase used to have an admin UI, NextAuth, Vercel KV/Blob, GitHub
Octokit commit flow, LLM endpoints. **All of that is gone.** Content is
managed via git — Claude Code edits the repo directly.

Don't propose re-adding admin or auth unless the user explicitly asks.
