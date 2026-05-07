# 11 · Asset Manifest

Everything Claude Code needs to copy or reference. Paths are relative to the repo root unless otherwise stated.

## Files to copy from this spec bundle into the repo

| Source (in `rehanmd-spec/assets/`) | Destination (in repo) | Notes |
|---|---|---|
| `prototype/index.html` | `docs/prototype/index.html` | Reference only, do not ship in production. Add `docs/` to `.gitignore` if Vercel ignores it. |
| `prototype/app.js` | `docs/prototype/app.js` | Reference only. |
| `prototype/data.js` | `docs/prototype/data.js` | Reference only. Use as seed for initial `src/data/projects.ts` and KV defaults. |
| `geo/land-110m.json` | `public/data/land-110m.json` | World map TopoJSON for BulletinWorldMap. |
| `textures/paper-noise.png` | `public/textures/paper-noise.png` | Used by bulletin + newspaper paper backgrounds. |
| `textures/cork-tile.jpg` | `public/textures/cork-tile.jpg` | Repeating cork texture for Newsstand wall. |
| `screenshots/*.png` | `docs/spec-screenshots/*.png` | Reference for visual matching during build. Excluded from production bundle. |

> If `paper-noise.png` and `cork-tile.jpg` are missing in this bundle, generate them with `scripts/gen-textures.ts` (small node script: paper-noise = soft monochrome noise via createCanvas, 512x512, 8% alpha; cork-tile = procedural fractal-noise SVG flattened to JPG). Document in the spec rather than ship a placeholder.

## Fonts

Loaded via `next/font/google` in `src/app/layout.tsx`. No `<link>` tags.

```ts
import { Press_Start_2P, Space_Mono, Playfair_Display, Source_Serif_4 } from 'next/font/google';

export const pixel = Press_Start_2P({ weight: '400', variable: '--font-pixel', subsets: ['latin'], display: 'swap' });
export const mono = Space_Mono({ weight: ['400','700'], variable: '--font-mono', subsets: ['latin'], display: 'swap' });
export const serif = Playfair_Display({ weight: ['400','600','900'], style:['normal','italic'], variable: '--font-serif', subsets: ['latin'], display: 'swap' });
export const bodySerif = Source_Serif_4({ weight: ['400','600'], variable: '--font-body-serif', subsets: ['latin'], display: 'swap' });
```

`<html className={\`\${pixel.variable} \${mono.variable} \${serif.variable} \${bodySerif.variable}\`}>` so Tailwind can resolve `var(--font-pixel)` etc.

`--font-news-body` is system Georgia stack — no remote font needed.

## Icons / glyphs

The site avoids icon fonts. Use:
- Mono brackets `[ ]` and arrows `↗ ↘ ⇣ ↵ ‹ ›` as character glyphs.
- `★ ◆ ◉ ●` Unicode glyphs.
- The diamond `◆`, star `★`, dot `●`, and tape strip are the entire icon system.

If a true SVG icon is needed (rare): keep them inline, monochrome, `currentColor`, `1.5px stroke`, `16×16` or `20×20`.

## Existing repo files to PRESERVE (do not delete)

- `src/components/three/SubwayScene.tsx` (edit envelope anchor only)
- `src/components/three/TrainInterior.tsx`
- `src/components/three/TunnelEnvironment.tsx`
- `src/components/three/TunnelLights.tsx`
- `src/components/three/PostFX.tsx`
- `src/components/three/TickerLED.tsx`
- `src/lib/auth.ts` (verify it allow-lists `ADMIN_GITHUB_LOGIN`)
- `src/lib/ai.ts` (Phase 1 — extend, do not rewrite the system prompt)
- `src/lib/kv.ts`, `src/lib/blob.ts`, `src/lib/github.ts` (extend type signatures per `02-architecture.md`)
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/dispatches/compose/route.ts` (preserve streaming logic; refit response shape if needed)
- `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json` (extend, don't replace)

## Files to DELETE during R2 (Reset phase)

> NOTE: All R3F train components — including `MetroWallScene.tsx`, `WallTiles.tsx`, `WallPoster.tsx`, `WallLighting.tsx`, `PosterFrame.tsx`, `PosterLinksOverlay.tsx` — are **KEPT**. The in-scene CLICK HERE poster + contact popup is the in-scene contact affordance and is working.

```
src/components/sections/AboutSection.tsx
src/components/sections/AboutEnvelope.tsx
src/components/sections/AboutBulletinModal.tsx
src/components/projects/MetroMap.tsx
src/components/projects/ProjectCard.tsx
src/components/projects/ProjectLightbox.tsx
src/components/blog/MDXComponents.tsx
src/components/layout/Footer.tsx
src/components/ui/Slideshow.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/admin/settings/**           # Settings is dropped from scope
src/components/admin/TweaksPanel.tsx # if it exists from any prototype port
```

(If any of those don't exist in the user's tree, skip silently — they're part of the Phase 1 partial port.)

## Environment files

Add to `.env.example` (not actual values):

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
ADMIN_GITHUB_LOGIN=rehanmollick
ANTHROPIC_API_KEY=
GROQ_API_KEY=
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
BLOB_READ_WRITE_TOKEN=
GH_REPO_OWNER=rehanmollick
GH_REPO_NAME=rehanmd.tech
GH_BRANCH=main
GH_BOT_TOKEN=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

## Seed data

On first run with empty KV, `lib/about.ts` returns `DEFAULT_ABOUT` derived from `docs/prototype/data.js` `aboutData`. Same for projects: `src/data/projects.ts` ships with the prototype's seed projects so the site is non-empty on day 1.

For seed dispatches, copy any `*.mdx` already present in the user's `src/content/blog/` to keep history. If the directory is empty, ship one welcome dispatch:

`src/content/blog/welcome.mdx`:
```mdx
---
title: "The line is open."
date: "2026-05-01"
excerpt: "First dispatch from the new line. Mostly just to prove the press works."
tags: ["meta", "first-issue"]
pinned: true
hero: "/textures/paper-noise.png"
thumbColor: "amber"
---

# The line is open.

This is the first dispatch from the rebuilt rehanmd.tech.
```

## Tailwind config additions

Add to `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      'bg-primary': 'var(--bg-primary)',
      'bg-secondary': 'var(--bg-secondary)',
      'bg-tertiary': 'var(--bg-tertiary)',
      accent: 'var(--accent)',
      'accent-light': 'var(--accent-light)',
      'accent-dim': 'var(--accent-dim)',
      'accent-glow': 'var(--accent-glow)',
      paper: 'var(--paper)',
      'paper-dark': 'var(--paper-dark)',
      'paper-text': 'var(--paper-text)',
      'paper-eyebrow': 'var(--paper-eyebrow)',
      'news-paper': 'var(--news-paper)',
      'news-text': 'var(--news-text)',
      'news-rule': 'var(--news-rule)',
    },
    fontFamily: {
      pixel: ['var(--font-pixel)'],
      mono: ['var(--font-mono)'],
      serif: ['var(--font-serif)'],
      'body-serif': ['var(--font-body-serif)'],
      'news-body': ['Georgia', '"Times New Roman"', 'serif'],
    },
  },
},
```
