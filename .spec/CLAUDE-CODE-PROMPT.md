# CLAUDE CODE PROMPT — paste this verbatim

You are rebuilding rehanmd.tech end-to-end against a finished design prototype. You have full write access to the local repo at the path you're invoked from. You will work autonomously, commit frequently, and open one PR at the end.

## STEP 0 — Read everything before writing any code

Open and read every file in `.spec/` (relative to repo root) in this order:

1. `MASTER-SPEC.md` — start here.
2. `13-prototype-literal-extracts.md` — **this file overrides every other spec file**. Before writing any production code, complete the TODO(spec) blocks in §A.4, §B, §C, §D, §E, §F by extracting verbatim from `assets/prototype/app.js` + `index.html`. Each completed section gets its own `docs(spec): extend literal extracts ...` commit.
3. `01-design-system.md` through `12-acceptance-checklist.md` — read fully.
4. Browse `assets/screenshots/*.png` cover-to-cover.
5. Open `assets/prototype/index.html` in a browser locally to interact with the prototype directly.

## STEP 1 — Branch and reset

```bash
git checkout main && git pull
git checkout -b feat/full-redesign-2026
```

Perform every deletion in `11-asset-manifest.md` § "Files to DELETE during R2". Commit:
```
chore(reset): remove Phase 1 components for full redesign
```

## STEP 2 — Copy assets

Copy files from `~/Desktop/rehanmd-spec/assets/` into the repo per the manifest table in `11-asset-manifest.md`. Commit:
```
chore(assets): bundle prototype reference, textures, geojson
```

## STEP 3 — Foundations

- Update `tailwind.config.ts` with the colors and fonts from `01-design-system.md` and `11-asset-manifest.md`.
- Update `src/app/layout.tsx` to load Press Start 2P, Space Mono, Playfair Display, Source Serif 4 via `next/font/google` and expose CSS variables.
- Add all CSS variables and tokens to `src/app/globals.css` per `01-design-system.md`.
- Confirm `.env.example` matches `02-architecture.md`.

Commit:
```
feat(foundations): tokens, fonts, tailwind extensions
```

## STEP 4 — Build sections in order, one commit per component

Follow the build order in `MASTER-SPEC.md` §"Build order". Each numbered step = one commit. Conventional commit messages.

For every component, when done, open the matching screenshot from `assets/screenshots/` and visually compare against your dev server. If anything diverges, fix it before committing.

Per-component spec lives in:
- Hero + envelope → `04-hero-and-envelope.md`
- Bulletin → `05-about-bulletin.md`
- Metro line → `06-metro-line.md`
- Plaque + lightbox → `07-project-plaque-and-lightbox.md`
- Newsstand + Newspaper → `08-newsstand-and-newspaper.md`
- Footer → `09-footer.md`
- Admin → `10-admin.md`

Train scene rules in `03-train-scene-rules.md` apply throughout.

## STEP 5 — Run the acceptance checklist

Open `12-acceptance-checklist.md`. Run every check. Mark `[x]` for pass, `[ ]` + reason for fail. Fix any failures and re-check.

## STEP 6 — Open the PR

```bash
git push -u origin feat/full-redesign-2026
gh pr create --title "Full site redesign 2026" --body "$(cat <<'EOF'
Full rebuild against the prototype at docs/prototype/index.html. Spec at ~/Desktop/rehanmd-spec.

## Acceptance checklist
[paste rendered checklist with x marks here]

## Screenshots
[attach: home, bulletin open, the line, plaque, lightbox, /blog wall, newspaper article, admin dashboard, project edit form]
EOF
)"
```

## Hard rules

- All commits author `rehanmollick <rehanmollick07@gmail.com>`. Do not change git config; if it isn't already set, prompt me before continuing.
- No commit message contains "Claude", "Anthropic", or AI attribution. Conventional commits only (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).
- All copy is verbatim from the prototype. Do not paraphrase headings, eyebrows, button labels, marquee strings.
- Use existing tokens; do not hardcode hex values inline that conflict with `01-design-system.md`.
- Mobile-first responsive at every breakpoint in `01-design-system.md`.
- Respect `prefers-reduced-motion` for every animation.
- No tweaks panel, no settings UI, no abandoned-branch decoration on the metro map.
- Train scene Canvas is mounted only on `/`. Never on `/blog`, `/blog/[slug]`, or `/admin/**`.
- All modals use the `rgba(0,0,0,.94)` + `backdrop-filter: blur(6px)` backdrop so the train cannot bleed through.

## If you get stuck

1. Re-read the relevant spec section.
2. Re-open the matching screenshot.
3. Open `assets/prototype/index.html` in a browser and inspect.
4. Leave a `// TODO(spec): <question>` comment, ship what you have, and continue. Note all TODOs in the PR description so I can resolve.

## Definition of done

The PR has every checklist box ticked, every requested screenshot attached, no console errors on any route, `pnpm build` succeeds, and the live preview deploy looks 1:1 against the prototype at every breakpoint.
