# rehanmd.tech — Master Implementation Spec (2026 Full Redesign)

> **You are Claude Code.** Read this file and `assets/screenshots/*` before writing any code. The prototype HTML referenced throughout is at `~/Desktop/rehanmd-spec/assets/prototype/index.html` (open it in a browser if you need to inspect interactions). The current real Next.js codebase lives at the user's local `rehanmd.tech/` directory.

This spec is split across multiple files for readability. **Read in this order:**

| # | File | Why |
|---|------|-----|
| 0 | `MASTER-SPEC.md` (this file) | Mission, ground rules, build order, acceptance gates |
| 1 | `01-design-system.md` | Colors, type, spacing, z-index, motion |
| 2 | `02-architecture.md` | File tree, data flow, auth, API contracts, AI wiring |
| 3 | `03-train-scene-rules.md` | Where the R3F train shows / dims / unmounts |
| 4 | `04-hero-and-envelope.md` | Hero panel + envelope (first-visit anim + pull-tab) |
| 5 | `05-about-bulletin.md` | Bulletin modal, world map, photo strip, facts |
| 6 | `06-metro-line.md` | Arrivals board + multi-curve track + station plaques |
| 7 | `07-project-plaque-and-lightbox.md` | Plaque component + carousel + fullscreen lightbox |
| 8 | `08-newsstand-and-newspaper.md` | Pannable corkboard wall + newspaper article reader |
| 9 | `09-footer.md` | Bobble title, contact links |
| 10 | `10-admin.md` | Admin shell, dashboard, project CRUD, dispatch composer, media |
| 11 | `11-asset-manifest.md` | What to copy where, fonts, GeoJSON, screenshots |
| 13 | `13-prototype-literal-extracts.md` | **OVERRIDES ALL OTHERS.** Literal data shapes, copy, CSS, animations, handlers extracted from prototype |


---

## Mission

Rebuild the entire site — public + admin — to match the prototype **1:1**. The prototype (`assets/prototype/index.html` + `app.js` + `data.js`) is the **single source of truth** for visuals, copy, interactions, and admin behaviour.

The existing R3F train scene (TrainInterior, TunnelEnvironment, TunnelLights, post-FX, camera shake, LED ticker) is **kept**. Everything else — About card, MetroMap, ProjectCard, blog index, blog reader, footer, admin — is **deleted and rebuilt from scratch** per the per-section specs.

## What is in scope (build it)

- Hero overlay (panel + marquee + scroll cue) on top of the train scene
- Envelope card in the **About section that lives below the train scene** (replaces the broken Phase 1 about-me envelope) — **sealed envelope opening animation on first visit**, **flat pull-tab poster on subsequent visits** (localStorage-gated). NOT inside the train scene.
- About bulletin modal (with real-world map, 8 origin pins, dashed rope, photo strip, "now playing" widget, ask-Claude widget)
- Dispatches wall (pannable + paginated corkboard with thumbtack cards)
- The Line (arrivals board + multi-curve metro track + station plaques + fullscreen lightbox carousel)
- Newspaper-poster article reader at `/blog/[slug]`
- Footer (bobble "LET'S DO IT", contact links, no orange strip)
- Admin: dashboard, projects CRUD, dispatches CRUD (with brain-dump composer that already works in Phase 1), media library — **all gated behind NextAuth GitHub OAuth allow-listed to `rehanmollick`**

## What is out of scope (do NOT build)

- **Tweaks panel** — drop entirely
- **Settings admin page** — drop
- **"Abandoned branches"** decoration on the metro map — `BRANCHES` array is empty in prototype data; do not invent
- (KEEP) The "CLICK HERE" wall poster INSIDE the R3F train scene — it shows contact details on click; do not remove or alter
- Any duplicate blog-wall scene on the homepage (the wall lives only at `/blog`)

## Hard rules

1. **No light mode, no white card backgrounds** outside the cream paper / off-white wheatpaste / newspaper aesthetics specified per-section.
2. **Always prefer existing tokens** in `tailwind.config.ts` (`bg-primary`, `accent`, `accent-light`, `accent-dim`, `--font-space-mono`). Where the spec gives a hex that's not in the token set, add a CSS var rather than hardcoding inline.
3. **Train scene Canvas stays single-instance** — never mount a second R3F Canvas. Newsstand and Newspaper are pure DOM/SVG.
4. **All copy is verbatim** from the prototype. Do not paraphrase headings, eyebrows, button labels, or marquee strings.
5. **All project data** comes from `src/data/projects.ts`. **All blog data** comes from MDX files in `src/content/blog/`. **All About config** comes from Vercel KV via `src/lib/about.ts`. Never hardcode content into components.
6. **Commits**: granular — one component or one logical change per commit. Author `rehanmollick <rehanmollick07@gmail.com>`. Conventional commits. Never let "Claude" / "Anthropic" appear in author or message.
7. **Mobile-first responsive** at every section per the breakpoint table in `01-design-system.md`.
8. **No emoji** in production code. The prototype's `▸ ◉ ✕ ★` glyphs are intentional retro typography — keep them where the prototype uses them, do not add new ones.
9. **`prefers-reduced-motion`** must dim or disable: bulb pulsing, equalizer animation, footer bobble, world-map terminus pulse, marquee scroll, envelope flap animation. Static fallback for each.
10. **Lighthouse**: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95 on the home route.

## Phase 1 known issues to fix during rebuild

- Envelope letter text overflows the white paper area → re-layout per `04-hero-and-envelope.md` §Envelope Internal Sizing.
- The "CLICK HERE" wall poster in the R3F train scene is **kept** — it's the in-scene contact-details affordance and works correctly. Do NOT delete `WallPoster.tsx` / `WallTiles.tsx` / `WallLighting.tsx` / `MetroWallScene.tsx`. (Phase 1 brief was wrong on this point; this is the corrected scope.)
- 3D train bleeds through About modal → all modals (`AboutBulletinModal`, `ProjectLightbox`, `Reader`) get a `z-index: 200` backdrop with `background: rgba(0,0,0,.94); backdrop-filter: blur(6px)` per `01-design-system.md` §Z-Index.
- Components untuned against dark backdrop → every section below the train applies `background: var(--bg-primary)` (`#0a0a0a`) at the section root so train is fully occluded.

## Build order (one commit per numbered step)

### Phase R — Reset
- R1. Create branch `feat/full-redesign-2026`
- R2. Delete: `src/components/sections/AboutSection.tsx`, `AboutEnvelope.tsx`, `AboutBulletinModal.tsx` (Phase 1 versions of the about-me envelope below the train), `src/components/projects/MetroMap.tsx`, `ProjectCard.tsx`, `ProjectLightbox.tsx`, `src/components/blog/MDXComponents.tsx`, `src/components/layout/Footer.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/ui/Slideshow.tsx`. **KEEP** all R3F train components including `MetroWallScene.tsx`, `WallTiles.tsx`, `WallPoster.tsx`, `WallLighting.tsx`, `PosterFrame.tsx`, `PosterLinksOverlay.tsx` — the in-scene CLICK HERE poster works and is in scope. Keep all of `src/lib/*`.
- R3. Add CSS variables for the prototype's pixel/serif/mono font stack and the orange/dark palette to `globals.css` per `01-design-system.md`.

### Phase A — Train scene integration
- A1. Verify the existing R3F train scene still renders correctly (TrainInterior, TunnelEnvironment, TunnelLights, PostFX, TickerLED, and the in-scene CLICK HERE wall poster with its contact-details popup). No changes needed; just confirm it survives the reset.
- A2. Confirm hero panel, marquee, and scroll cue render as HTML siblings over the Canvas as documented in `03-train-scene-rules.md`. No envelope is mounted here.

### Phase B — Sections
- B1. About section below the train: envelope card (sealed-anim first visit / pull-tab on returns) → opens bulletin modal (`04-hero-and-envelope.md` + `05-about-bulletin.md`)
- B2. Dispatches wall section (`08-newsstand-and-newspaper.md` §Wall)
- B3. The Line metro section (`06-metro-line.md`)
- B4. Project plaque + lightbox (`07-project-plaque-and-lightbox.md`)
- B5. Footer (`09-footer.md`)

### Phase C — Blog routes
- C1. `/blog` page using NewsstandWall (paginated with pan-within)
- C2. `/blog/[slug]` page using NewspaperReader

### Phase D — Admin
- D1. Admin shell + dashboard
- D2. Projects CRUD + commit endpoint
- D3. Dispatches CRUD (compose endpoint already exists in Phase 1; wire it up)
- D4. Media library + upload endpoint

### Phase E — Verify
- E1. Run `12-acceptance-checklist.md` line by line. Mark each ✓/✗ in a comment in the PR description.
- E2. Open PR titled `Full site redesign 2026` against `main`.

## What "1:1 to the prototype" means

For every visible element you build, open the matching screenshot in `assets/screenshots/` side-by-side with your dev server and compare:

- Same copy, same casing, same punctuation
- Same color (use the hex in the per-section spec, do not eyeball)
- Same font family and weight
- Same border treatment, same radius (most are `0` — flat retro)
- Same spacing (use the pixel values in each spec)
- Same hover/active states
- Same animation direction, easing, duration

If you find yourself making a judgement call, the prototype wins. If the prototype is silent or contradictory, this spec wins. If both are silent, leave a `// TODO(spec):` comment and move on.
