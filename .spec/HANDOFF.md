# HANDOFF — for Rehan

Short README. Five minutes to follow.

## What's in `rehanmd-spec/`

```
rehanmd-spec/
├── MASTER-SPEC.md                   ← start here; routes you to the rest
├── 01-design-system.md              ← colors, type, spacing, motion
├── 02-architecture.md               ← file tree, data flow, API contracts, AI wiring
├── 03-train-scene-rules.md          ← where R3F shows / dims / unmounts
├── 04-hero-and-envelope.md          ← hero panel + envelope
├── 05-about-bulletin.md             ← bulletin modal w/ world map
├── 06-metro-line.md                 ← arrivals board + curved track
├── 07-project-plaque-and-lightbox.md
├── 08-newsstand-and-newspaper.md    ← /blog wall + /blog/[slug] reader
├── 09-footer.md
├── 10-admin.md                      ← all admin surfaces
├── 11-asset-manifest.md             ← what to copy where
├── 12-acceptance-checklist.md       ← 100+ self-checks
├── CLAUDE-CODE-PROMPT.md            ← the single prompt to paste
├── HANDOFF.md                       ← this file
└── assets/
    ├── prototype/                   ← your finished prototype copied verbatim
    │   ├── index.html
    │   ├── app.js
    │   └── data.js
    ├── geo/land-110m.json           ← world map TopoJSON for the bulletin
    ├── textures/
    │   ├── paper-noise.png
    │   └── cork-tile.jpg
    └── screenshots/                 ← every section captured for visual reference
        ├── 01-hero.png
        ├── 02-about-trigger.png
        ├── 03-about-modal.png
        ├── 04-about-worldmap.png
        ├── 05-dispatches.png
        ├── 06-metro-line.png
        ├── 07-station-plaque.png
        ├── 08-lightbox.png
        ├── 09-blog-reader.png (and 02-09)
        ├── 10-footer.png
        ├── 11-admin-dashboard.png
        ├── 12-admin-projects.png
        ├── 13-admin-project-form.png
        ├── 14-admin-dispatch-form.png
        └── 15-admin-media.png
```

## Where the spec lives

All spec files and assets live at `.spec/` inside your repo (gitignored). Claude Code reads them locally via relative paths from the repo root — no Desktop folder required.

Add `.spec/` to your `.gitignore` if it isn't already.

## Step 2 — Run Claude Code in your repo

```bash
cd ~/path/to/rehanmd.tech
claude
```

## Step 3 — Paste the prompt

Open `~/Desktop/rehanmd-spec/CLAUDE-CODE-PROMPT.md`, copy the whole thing, paste into Claude Code as your first message.

That's the entire run instruction. It tells Claude Code to:
1. Read the spec
2. Branch `feat/full-redesign-2026`
3. Delete Phase 1 components
4. Copy assets in
5. Build section by section
6. Run the acceptance checklist
7. Open a PR titled "Full site redesign 2026"

Expected runtime: a few hours of autonomous work, with you babysitting.

## Step 4 — Feed it screenshots when it asks

For most sections Claude Code will read the spec and proceed. If it gets visually stuck on a section, drop the matching screenshot from `assets/screenshots/` directly into the chat (Claude Code accepts image attachments) and say:
> "Match this exactly. Screenshot is from the prototype at `~/Desktop/rehanmd-spec/assets/prototype/index.html` — open it locally if you need to interact."

## If it gets stuck mid-run

Common failure modes and how to nudge:

- **It starts inventing visuals** → "Stop. Open `~/Desktop/rehanmd-spec/assets/screenshots/<file>.png` and match exactly."
- **It can't decide between two patterns** → "Re-read `MASTER-SPEC.md` § 'Hard rules'. Defer to the prototype."
- **It hits a real ambiguity** → tell it to leave a `// TODO(spec): ...` comment, finish the rest, and surface all TODOs in the PR description. You resolve them after.
- **It loses the plot on auth/API** → "Re-read `02-architecture.md` and confirm the API contract for the route you're building before continuing."
- **It tries to add Tweaks / Settings / abandoned branches** → "Out of scope. See `MASTER-SPEC.md` § 'What is out of scope'."
- **It tries to mount the train Canvas on /blog or /admin** → "Forbidden. See `03-train-scene-rules.md`."
- **Build breaks** → "Run `pnpm build`, paste the error, fix it, recommit."
- **It's slow** → It's doing 100+ subtasks. Let it cook. Check in every 30 min.

## After the PR opens

- Skim the PR description — every checklist box should be `[x]` or have a note.
- Pull the branch locally, run `pnpm dev`, and walk through every section with the screenshots.
- Record any visual diffs as PR comments. Claude Code can do another pass to fix.

## Quick sanity tests after merge

1. Visit `/` — see hero, scroll to dispatches, scroll to the line, scroll to footer.
2. Click envelope — bulletin opens, train does NOT bleed through.
3. Open a project plaque media — lightbox works, ←/→/Esc work.
4. Visit `/blog` — pannable wall, prev/next walls work.
5. Click a card — newspaper reader renders.
6. Sign in to `/admin` with your GitHub. You should see Dashboard.
7. Edit a project, save — verify a commit was pushed by the bot to `src/data/projects.ts`.
8. Compose a dispatch in the brain-dump composer, publish — verify a commit pushed to `src/content/blog/`.
9. Toggle About config in the admin About page — verify the public bulletin updates within 60s.

## Things you can ignore in the spec if you want

- The Spotify integration is optional. If you don't set the env vars, Now Playing reads from KV manually.
- The print stylesheet for the newspaper is nice-to-have.
- The geocode helper in About admin can be skipped (manually paste lat/lng instead).

Everything else is core scope.

## Author / commits

All commits land as `rehanmollick <rehanmollick07@gmail.com>`. The prompt explicitly forbids any AI-attribution language in commit messages. If git config isn't set Claude Code will pause and ask before continuing.

That's it. Open the prompt, paste, walk away with periodic check-ins.
