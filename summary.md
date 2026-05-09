# rehanmd.tech — Handover Summary

A complete handover doc for **Md Rehan Mollick**'s personal portfolio.

You should be able to clear context, come back to this file, and either update the site yourself or hand it to Claude Code with one prompt and have new content added without further explanation.

---

## 1. What this is

A 1:1 implementation of a custom dark-mode underground-metro portfolio aesthetic. The hero is a procedurally-rendered React Three Fiber subway-car interior with a scrolling tunnel outside the windows. Below the train, the page reads as a stack of metro/transit metaphors:

- **About** — opens a wheatpaste poster trigger → a "Bulletin №07" cream-paper modal with a hand-drawn world map and 8 origin pins.
- **Dispatches** — a brick-wall corkboard with cream pin-up cards.
- **The Line** — an arrivals board + a single SVG metro track threading station nodes left/right with bolted "station plaques" for each project.
- **Footer** — pixel-bobble "LET'S DO IT." with contact links.

**Live**: https://rehanmd.tech
**Repo**: https://github.com/rehanmollick/rehanmd.tech

---

## 2. Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript 5.x |
| 3D | React Three Fiber 9 + drei + postprocessing |
| Animation | Framer Motion 12 + CSS keyframes |
| Styling | Tailwind CSS 4 (utility classes) + global tokens in `src/styles/globals.css` |
| MDX | `next-mdx-remote/rsc` for the newspaper reader; `gray-matter` for frontmatter parsing |
| Fonts | `next/font/google` — Press Start 2P, JetBrains Mono, Playfair Display, Source Serif 4, Special Elite |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Analytics | Vercel Analytics |

**No** auth, **no** database, **no** admin UI, **no** LLM keys. Content lives in the repo as markdown files. Edit + git push = deployed.

---

## 3. The folder system (the part you'll actually touch)

Everything you'd ever edit lives under **`public/`** in one folder per item.

```
public/
├── projects/
│   ├── karmen-playground/
│   │   ├── project.md          ← title, description, tech stack, slides, etc.
│   │   ├── hero.png            ← drop screenshots in same folder
│   │   ├── schedule.png
│   │   └── monte-carlo.gif
│   ├── gridpulse/
│   │   ├── project.md
│   │   └── (images)
│   └── (one folder per project)
│
├── dispatches/
│   ├── building-rehanmd-tech/
│   │   ├── dispatch.mdx        ← frontmatter + MDX body
│   │   └── (optional inline images)
│   └── (one folder per blog post)
│
├── about/
│   ├── about.md                ← bio, widgets, photos, facts, links
│   ├── photo-01.jpg            ← drop polaroid photos here
│   └── photo-02.jpg
│
├── data/
│   └── world-land-paths.html   ← reference data for the bulletin world map (don't touch)
│
└── textures/
    ├── paper-noise.png         ← reused texture
    └── cork-tile.jpg
```

### How to add a new project

1. `mkdir public/projects/my-thing/`
2. Create `public/projects/my-thing/project.md`:
   ```yaml
   ---
   title: My Thing
   date: 2026-05-08
   dateDisplay: May 2026
   stationName: My Thing Junction
   context: Some Hackathon 2026 — Won X
   liveUrl: https://my-thing.vercel.app
   repoUrl: https://github.com/rehanmollick/my-thing
   featured: false
   description: >-
     One- to three-sentence plaque description.
   tags:
     - ai
     - hackathon
   techStack:
     - name: Next.js
       reason: Why I picked it.
     - name: Postgres
       reason: Why I picked it.
   slides:
     - { src: hero.png, alt: "Hero screen" }
     - { src: graph.png, alt: "Graph view" }
     - { label: "media coming soon" }   # placeholder tile
   ---
   ```
3. Drop `hero.png`, `graph.png` etc. in the same folder.
4. `git add . && git commit && git push`. Vercel auto-deploys in ~30-60s.

### How to add a new dispatch (blog post)

1. `mkdir public/dispatches/my-slug/`
2. Create `public/dispatches/my-slug/dispatch.mdx`:
   ```mdx
   ---
   title: "My Post Title"
   date: "2026-05-08"
   tags: ["meta"]
   excerpt: "Short hook for the corkboard card."
   readTime: 4
   ---

   # My Post Title

   Body here. MDX supports inline components — `<PullQuote>...</PullQuote>` works.
   See `src/components/dispatches/NewspaperReader.tsx` for the full list.

   ## Section heading

   Markdown body continues...
   ```
3. Commit + push.

### How to update About

Edit `public/about/about.md`:

- **Bio / tagline / AFK**: just change the strings.
- **Stack chips**: edit the `stack:` array.
- **Sidebar widgets**: 4 widgets (currently working on / now playing / obsessed / recent win) — each has `label`, `big`, optional `small`. The "now playing" widget has 7 animated equalizer bars; just edit `big:` to whatever you're listening to.
- **Photo strip**: 4 polaroid tiles. Set `src: photo-01.jpg` (drop the file in `public/about/`) or leave `src: null` for the striped placeholder.
- **Facts**: list under `▸ FIELD NOTES`. Edit `facts:` array.
- **Links** ("THE LINKS" row): edit `links:` array — currently empty, so the row is hidden.

Atlas pins (the world map's 8 origin pins) live as **inline geometry** in `src/lib/about.ts` — they're tied to the hand-drawn SVG viewBox coords and not expected to change. If you do need to move a pin, edit `ATLAS.pins` in `src/lib/about.ts` (also has the rope path data).

---

## 4. Workflow with Claude Code

You can do all of this manually, or you can paste prompts at Claude Code and it'll do the file edits + commits + push for you. **Claude Code is your only "admin" surface now** — there's no UI.

### Adding a project (the "look at this repo and write it up for me" flow)

> "Look at https://github.com/rehanmollick/<repo>. Decide if it's worth adding to the portfolio. If yes, create the folder under `public/projects/`, write the `project.md` (description, tech stack with reasons, tags, station name, dateDisplay), and use placeholder slides until I drop screenshots in. Commit + push."

Claude will:
1. Fetch the repo's README + recent commits to understand what it is
2. Pick a slug + station name
3. Author the frontmatter
4. Commit + push → Vercel deploys → live

You then drop screenshots into the new folder, commit, and they appear in the carousel.

### Updating a specific line

> "On the GridPulse plaque, change the description to: <new text>"

Or:

> "Add a new tech entry to Karmen Playground: Postgres, with the reason '<text>'"

### Adding a dispatch

> "Write a dispatch about <topic>. Match the existing dispatch voice (newspaper, dry, observational). Tag it with <X, Y>. Pin it to the wall."

Claude will write the MDX file with frontmatter and an opinionated body matching the existing tone.

### Editing about

> "Update the now-playing widget to '<song · artist>'. Also change my AFK to mention <new hobby>."

> "Drop the photo I just attached into the about strip — set photo-01.jpg as the first tile."

---

## 5. File tree (everything else)

```
.
├── public/
│   ├── projects/<id>/project.md       (content — see §3)
│   ├── dispatches/<slug>/dispatch.mdx (content — see §3)
│   ├── about/about.md                 (content — see §3)
│   ├── data/world-land-paths.html     (reference: hand-drawn world map paths)
│   ├── textures/paper-noise.png       (paper noise overlay)
│   └── textures/cork-tile.jpg         (cork wall texture)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 (root layout — fonts, metadata, Analytics)
│   │   ├── page.tsx                   (home — composes train scene + sections)
│   │   ├── blog/page.tsx              (/blog wall — full-page newsstand)
│   │   └── blog/[slug]/page.tsx       (/blog/[slug] — newspaper reader, MDX render)
│   │
│   ├── components/
│   │   ├── three/                     (R3F train scene — DON'T MODIFY)
│   │   │   ├── HeroScene.tsx          (entry: <Canvas> + overlay)
│   │   │   ├── SubwayScene.tsx        (camera, scene root)
│   │   │   ├── TrainInterior.tsx      (procedural train car)
│   │   │   ├── TunnelEnvironment.tsx  (tunnel outside windows)
│   │   │   ├── TunnelLights.tsx       (scrolling tunnel lights)
│   │   │   ├── PostProcessingEffects.tsx (bloom, vignette, grain)
│   │   │   ├── LEDTicker.tsx          (in-scene 3D ticker)
│   │   │   ├── DustParticles.tsx
│   │   │   ├── SceneLoader.tsx
│   │   │   ├── PosterFrame.tsx        (in-scene CLICK HERE poster — 3D)
│   │   │   └── PosterLinksOverlay.tsx (HTML overlay shown when poster clicked)
│   │   │
│   │   ├── hero/
│   │   │   └── ScrollCue.tsx          (SCROLL hint at bottom)
│   │   │
│   │   ├── about/                     (about section — wheatpaste poster + bulletin modal)
│   │   │   ├── AboutSection.tsx       (server, reads about.md)
│   │   │   ├── AboutClient.tsx        (client wrapper, modal state)
│   │   │   ├── EnvelopePoster.tsx     (wheatpaste poster trigger)
│   │   │   ├── BulletinModal.tsx      (modal shell, Esc/backdrop close)
│   │   │   ├── BulletinHeader.tsx     (title bar)
│   │   │   ├── BulletinBody.tsx       (eyebrow + sections grid)
│   │   │   ├── BulletinSidebar.tsx    (4 widgets w/ equalizer)
│   │   │   ├── BulletinWorldMap.tsx   (SVG atlas + 8 pins + red rope)
│   │   │   ├── BulletinPhotoStrip.tsx (4 polaroid tiles)
│   │   │   ├── BulletinFacts.tsx      (FIELD NOTES strip)
│   │   │   └── BulletinFooter.tsx     (POSTED · VERIFIED stamp)
│   │   │
│   │   ├── dispatches/                (corkboard wall + newspaper reader)
│   │   │   ├── DispatchesSection.tsx  (paginated brick-wall corkboard)
│   │   │   ├── DispatchCard.tsx       (cream pin-up card w/ tape strip)
│   │   │   └── NewspaperReader.tsx    (server — MDX → newspaper layout)
│   │   │
│   │   ├── line/                      (the metro line)
│   │   │   ├── LineSection.tsx        (section frame + steam vents)
│   │   │   ├── LineHeading.tsx        (h2 + LIVE badge)
│   │   │   ├── LineLegend.tsx         (4-key legend)
│   │   │   ├── ArrivalsBoard.tsx      (black panel + ticking clock + 4 rows)
│   │   │   ├── MetroTrack.tsx         (SVG line — 45° jog drawing algorithm + ResizeObserver)
│   │   │   ├── StationMarker.tsx      (node + sign plate)
│   │   │   ├── StationPlaque.tsx      (bolted card per project)
│   │   │   ├── PlaqueMedia.tsx        (carousel inside plaque)
│   │   │   ├── Lightbox.tsx           (fullscreen carousel)
│   │   │   └── Terminus.tsx           (NEXT STOP · TBD / DEPARTURE markers)
│   │   │
│   │   ├── layout/
│   │   │   ├── Nav.tsx                (top nav — flush to top, anchor links)
│   │   │   └── Footer.tsx             (LET'S DO IT bobble + contact links)
│   │   │
│   │   └── icons/
│   │       └── GithubIcon.tsx         (inline GitHub mark, currentColor)
│   │
│   ├── lib/
│   │   ├── projects.ts                (reads public/projects/*/project.md)
│   │   ├── mdx.ts                     (reads public/dispatches/*/dispatch.mdx)
│   │   ├── about.ts                   (reads public/about/about.md + atlas geometry)
│   │   └── utils.ts                   (small string/cn helper)
│   │
│   └── styles/
│       └── globals.css                (CSS custom properties + keyframes)
│
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
├── README.md                          (points at this file)
└── summary.md                         (you're reading it — Claude reads this every session)
```

### Files explicitly **DROPPED** during the cleanup

- All `/admin/**` routes — gone
- All `/api/admin/**` routes — gone
- `/api/about`, `/api/ask-claude` — gone
- `src/middleware.ts` — gone (no more auth gate)
- `src/lib/github.ts`, `serialize-projects.ts`, `rate-limit.ts`, `llm.ts`, `auth.ts` — gone
- `src/components/admin/**` — gone
- `src/components/providers/SessionProviderClient.tsx` — gone
- `src/data/projects.ts` — replaced by `public/projects/<id>/project.md`
- `src/content/blog/*.mdx` — replaced by `public/dispatches/<slug>/dispatch.mdx`
- `next-auth`, `@vercel/kv`, `@vercel/blob`, `@octokit/rest`, `@anthropic-ai/sdk`, `groq-sdk` deps — gone

---

## 6. Page anatomy (top to bottom)

| Section | Component | What you see |
|---|---|---|
| 1. Top nav | `components/layout/Nav.tsx` | `rehanmd.tech` brand · ABOUT · PROJECTS · CONTACT · BLOG. Anchor links scroll smoothly. Hugs the very top edge. |
| 2. Hero (sticky 100vh) | `components/three/HeroScene.tsx` | R3F subway-car interior. The `Md Rehan Mollick` wall poster + "Click Here" arrow are in-scene 3D, not HTML. SCROLL cue at bottom. |
| 3. About envelope poster | `components/about/AboutSection.tsx` | Wheatpaste cream poster ("WHO IS THIS GUY?") on dark bg. Click → bulletin modal. |
| 4. Bulletin modal | `components/about/BulletinModal.tsx` | Cream-paper modal. Headline / tagline / About + Stack + AFK / 4-widget sidebar / world atlas / photo strip / facts / footer. |
| 5. Dispatches wall | `components/dispatches/DispatchesSection.tsx` | Brick-wall corkboard. Cream pin-up cards with tape + thumbtacks. WALL i / n pagination. |
| 6. The Line | `components/line/LineSection.tsx` | Arrivals board + 7-station metro track + station plaques. Each plaque has a 16:9 carousel, tech chips, ▸ WHY THIS STACK toggle, REPO link. |
| 7. Footer | `components/layout/Footer.tsx` | Bouncing `LET'S DO IT.` title in Press Start 2P. Contact links. Credit line. |

---

## 7. Design tokens (live in `globals.css`)

Don't override these inline. Reference via CSS vars or Tailwind class shortcuts:

| Token | Hex | Use |
|---|---|---|
| `--page-outer` | `#050505` | Body background |
| `--bg-primary` | `#0a0a0a` | Main dark bg |
| `--bg-secondary` | `#131313` | Card / panel bg |
| `--bg-tertiary` | `#1d1d1d` | Subtle elevation |
| `--accent` | `#bf5700` | UT burnt orange — primary brand |
| `--accent-light` | `#e07a2e` | Hover / glow text |
| `--accent-dim` | `#6b3100` | Muted borders |
| `--text-primary` | `#e8e3da` | Body |
| `--text-secondary` | `#c0b9ac` | Subdued |
| `--text-muted` | `#7a7265` | Very dim |
| `--paper`, `--paper-dark`, `--paper-text`, `--paper-eyebrow` | (cream) | Bulletin modal |
| `--news-paper`, `--news-text`, `--news-rule` | (newsprint) | Newspaper reader |

Fonts are loaded via `next/font/google` in `src/app/layout.tsx`. Reference via `--font-pixel` (Press Start 2P), `--font-mono` (JetBrains Mono), `--font-serif` (Playfair Display), `--font-body-serif` (Source Serif 4), `--font-type` (Special Elite).

---

## 7b. Hard rules for Claude Code (read every session)

1. **Author every commit as `rehanmollick <rehanmollick07@gmail.com>`.** Don't
   change git config. Verify with `git config user.name && git config user.email`.
2. **Never** include "Claude", "Anthropic", or any AI attribution in commit
   messages, PR descriptions, or `Co-Authored-By` trailers.
3. **Conventional commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
   Granular — one logical change per commit.
4. **Push after every commit** so the contributions graph reflects the work in
   real time. Rehan explicitly wants high commit volume on his account.
5. **Don't propose re-adding admin / NextAuth / Vercel KV / Vercel Blob / LLM
   endpoints.** All of that was removed. Content is git-managed.
6. **Don't regress aesthetics** — see §8 below for the full guardrail list.
7. **Don't modify the R3F train components** unless explicitly asked. Rehan
   worked hardest on those (`src/components/three/*`).
8. **Open + merge a PR for each logical chunk** with `gh pr merge <n> --merge
   --admin --delete-branch` — keeps the activity feed showing PR opens/merges.

## 8. Aesthetic guardrails

These are the rules I (Rehan) care about. **Do not regress them when editing.**

1. **Hero stays the R3F train scene.** Don't replace it with HTML or remove it. Don't add the prototype's `Md Rehan Mollick` HTML panel back over the canvas.
2. **No light mode**, no white card backgrounds outside the cream paper / newspaper aesthetics.
3. **Retro typography stays jagged** — Press Start 2P for display, no anti-aliased smoothing of pixel fonts.
4. **The metro line is jagged**, not smooth-curved. Vertical → 45° diagonal → vertical. Real transit map style.
5. **Train scene Canvas mounts on `/` only.** Never on `/blog`, `/blog/[slug]`, or anywhere else.
6. **The in-scene CLICK HERE poster (3D, in the train wall) stays.** Don't delete `WallPoster`, `WallTiles`, `WallLighting`, `MetroWallScene`, `PosterFrame`, `PosterLinksOverlay`.
7. **All copy is verbatim** from the prototype unless I explicitly change it — don't paraphrase headings, marquee strings, station names, etc.

---

## 9. Known intentional placeholders

These are visible on the live site by design, edit when ready:

| Placeholder | Where | How to fix |
|---|---|---|
| `[ song · artist ]` in NOW PLAYING widget | bulletin sidebar | edit `widgets.nowPlaying.big` in `public/about/about.md` |
| `[ project name ]` in CURRENTLY WORKING ON | bulletin sidebar | edit `widgets.currentProject.big` |
| `[ a movie / show / topic / random thing ]` | OBSESSED WITH widget | edit `widgets.obsessed.big` |
| `[ latest accomplishment ]` | RECENT WIN widget | edit `widgets.win.big` |
| 4 striped polaroids in photo strip | bulletin | drop image files in `public/about/`, set `photos[*].src` |
| Striped placeholder slides on every project plaque | The Line | drop screenshots in `public/projects/<id>/`, replace `{ label: "..." }` with `{ src: "file.png", alt: "..." }` |
| Empty `links:` row in bulletin | bulletin | populate `links:` array in `about.md` |

---

## 10. Deploy

Vercel watches `main`. Every push to `main` triggers a build. No GitHub Actions, no manual deploy step.

Build command: `next build`
Output: `.next/`
Production URL: `https://rehanmd.tech`

Local dev: `npm run dev` → `http://localhost:3000` (or `:3001` if `:3000` is occupied).

---

## 11. Important things NOT to delete

- All R3F train components (`src/components/three/*`) — the hero would break.
- `public/data/world-land-paths.html` — the bulletin world map fetches this at runtime to render land outlines.
- `public/textures/*` — `paper-noise.png` (bulletin), `cork-tile.jpg` (in case you ever want a literal cork-board variant).

---

## 12. Quick reference — where to edit what

| I want to... | Edit |
|---|---|
| Add a project | new folder `public/projects/<id>/project.md` |
| Update a project's description | `public/projects/<id>/project.md` (`description:`) |
| Add screenshots to a project's carousel | drop into `public/projects/<id>/`, list under `slides:` |
| Add a blog post | new folder `public/dispatches/<slug>/dispatch.mdx` |
| Update bio | `public/about/about.md` (`bio:`) |
| Change "now playing" | `public/about/about.md` (`widgets.nowPlaying.big`) |
| Add a contact link to bulletin | `public/about/about.md` (`links:`) |
| Add a real photo to bulletin | drop in `public/about/`, set `src:` in `photos:` |
| Update footer contact links | `src/components/layout/Footer.tsx` (`LINKS` array) |
| Change accent colors | `src/styles/globals.css` (CSS vars under `:root`) |
| Update fonts | `src/app/layout.tsx` |
| Tweak the metro line shape | `src/components/line/MetroTrack.tsx` (algorithm) + `STATION_LAYOUT` constant |

---

## 13. The single prompt for Claude Code

When you come back fresh and want to add new content, paste this:

> "Read summary.md to understand the architecture. Then [DO THE THING]."

Replace `[DO THE THING]` with your ask. Examples:
- "Add the github.com/rehanmollick/<repo> repo as a portfolio project. Write the project.md, pick a station name, use placeholder slides."
- "Write a dispatch about [topic]. Match the existing voice."
- "Update the now-playing widget to '<song · artist>'."
- "Replace the description on the GridPulse plaque with: <new text>."

That's it. Claude reads this file, understands the system, and executes.
