# 12 · Acceptance Checklist

Run this list at the end of the build (Phase E1). Mark each `[x]` / `[ ]` in your PR description. Do not declare done until every box is ticked or has a written reason.

## A · Setup

- [ ] Branch `feat/full-redesign-2026` exists and is checked out
- [ ] `.env.example` matches `02-architecture.md` exactly
- [ ] `pnpm install` (or `npm install`) succeeds with no peer warnings
- [ ] `pnpm dev` boots without errors
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes (no `any` introduced for new code)

## B · Reset (R2 deletions)

- [ ] `WallPoster.tsx`, `WallTiles.tsx`, `WallLighting.tsx`, `MetroWallScene.tsx`, `PosterFrame.tsx`, `PosterLinksOverlay.tsx` deleted
- [ ] No file in repo references those modules (grep returns 0)
- [ ] `AboutSection.tsx`, `AboutEnvelope.tsx` (Phase 1) deleted
- [ ] Old `MetroMap.tsx`, `ProjectCard.tsx`, `ProjectLightbox.tsx` deleted
- [ ] Old `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` deleted
- [ ] `src/app/admin/settings/**` deleted
- [ ] No `TweaksPanel` references anywhere

## C · Train scene

- [ ] `<SubwayScene />` mounts ONLY on `app/page.tsx`
- [ ] `/blog`, `/blog/[slug]`, `/admin/**` do NOT render the Canvas
- [ ] CLICK HERE wall poster INSIDE the R3F scene still works (click → contact-details popup) — KEPT, not removed
- [ ] Train Canvas has `pointer-events:none` on wrapper
- [ ] Camera shake disabled when `prefers-reduced-motion: reduce`
- [ ] Post-FX disabled when viewport `< 900px`
- [ ] Static fallback renders on phones with `hardwareConcurrency < 4`

## D · Hero & About envelope

- [ ] Hero panel copy matches prototype verbatim
- [ ] Marquee scrolls at `40s` linear infinite; pauses on `prefers-reduced-motion`
- [ ] Scroll cue rule animates downward
- [ ] About envelope is rendered in `<AboutSection />` BELOW the train, not inside the R3F scene
- [ ] First visit: sealed envelope renders, flap animates `0 → -180deg` over `900ms`
- [ ] First visit: letter slides up at `t=400ms`
- [ ] First visit: clicking "OPEN" sets `localStorage['rehanmd:envelope-opened']='1'` and opens bulletin
- [ ] Subsequent visit: pull-tab poster renders, no animation
- [ ] Letter content does not overflow paper area (fix from Phase 1)
- [ ] Reduced motion: envelope opens instantly on first visit

## E · About bulletin

- [ ] Modal backdrop is `rgba(0,0,0,.94)` with `backdrop-filter: blur(6px)`
- [ ] Train scene does NOT bleed through the bulletin (verified visually)
- [ ] World map is real-world (Equal Earth projection), not transit-style
- [ ] Austin terminus pin pulses (or is static under reduced motion) and shows ★
- [ ] Pacific-crossing dashed rope drawn with `stroke-dasharray: 6 4` and `stroke-dashoffset` animation
- [ ] Now Playing widget polls `/api/now-playing` every 30s
- [ ] Equalizer bars freeze at 50% under reduced motion
- [ ] Ask Claude widget calls `window.claude.complete` (artifact) or `/api/ask` (real domain)
- [ ] Ask Claude rejects > 280 chars and disables submit
- [ ] Bulletin renders correctly at < 780px (single column)
- [ ] Esc closes; click on backdrop closes; focus traps inside modal

## F · The Line

- [ ] Arrivals board renders with no row text overlap at any breakpoint
- [ ] Status pip colors match: live green, in-progress amber, shipped orange, archived muted
- [ ] Metro track is one continuous SVG path (no branches, no parallel rails)
- [ ] Stations alternate columns A and B
- [ ] No abandoned/dead branches anywhere
- [ ] Station signage plaques render the project's `station` field
- [ ] Plaques never overlap the line at the 120px gutter
- [ ] On `< 900px`, all plaques render right of a single-column line
- [ ] Section is fully opaque against the train (background `var(--bg-primary)`)

## G · Plaque & lightbox

- [ ] Plaque has 3px outer + 1px inner orange frame with 4 bolt corners
- [ ] Media carousel autoplay pauses on hover
- [ ] Single-media plaques hide carousel controls
- [ ] Empty media renders striped placeholder + mono caption
- [ ] Lightbox opens with click on media, opens at correct slide index
- [ ] Lightbox keyboard: ←/→/Esc/Space (video) all work
- [ ] Lightbox info drawer toggle works on desktop and mobile
- [ ] Closing lightbox while video playing pauses and resets video
- [ ] About photo strip lightbox stacks above bulletin (`z-index: 250`)

## H · Newsstand & newspaper

- [ ] `/blog` mounts no R3F Canvas
- [ ] Wall paginates 9 cards per wall
- [ ] Pan within a wall works (pointer-down/move/up + clamping)
- [ ] Prev/next jumps walls and disables at boundaries
- [ ] Search filters across title/excerpt/tags and updates pagination count
- [ ] Pinned dispatches sort first regardless of date
- [ ] Each card has a thumbtack and tape strip
- [ ] Card hover lifts and clears rotation; reduced motion: no transform
- [ ] `/blog/[slug]` newspaper mounts no R3F
- [ ] Nameplate "THE REHAN HERALD" renders with double-rule below
- [ ] Multi-column body works at >= 900px, collapses to single at < 900px
- [ ] Drop cap renders on first paragraph
- [ ] Pullquote spans both columns
- [ ] Sidebar "FROM THE WIRES" renders with 3 mini cards
- [ ] 404 dispatch renders the "PULLED FROM THE PRESS" page
- [ ] Print stylesheet collapses sidebar and forces single-column

## I · Footer

- [ ] No orange strip at the top (Phase 1 mistake removed)
- [ ] "LET'S DO IT." bobbles letter-by-letter on hover with stagger
- [ ] Reduced motion: no bobble, color shift only
- [ ] Contact links match prototype list (EMAIL, GITHUB, LINKEDIN, RESUME ⇣, TWITTER)
- [ ] "MIND THE GAP…" line opens contact modal on click
- [ ] Copyright row shows year + version stamp

## J · Admin

- [ ] `/admin/**` redirects to GitHub OAuth when unauthenticated
- [ ] Non-allowlist GitHub login sees "ACCESS DENIED" page
- [ ] Sidebar nav: Dashboard, Projects, Dispatches, About, Media (no Settings)
- [ ] Dashboard stat cards render real numbers (not hardcoded)
- [ ] Recent activity feed pulls from KV `admin:activity`
- [ ] Project list table supports filter, search, drag-reorder, delete confirm
- [ ] Project edit form has live `<StationPlaque>` preview that debounces 200ms
- [ ] Saving a project commits `src/data/projects.ts` via Octokit and revalidates `/`
- [ ] Dispatch list shows DRAFT vs PUBLISHED status
- [ ] Brain-dump composer streams from `/api/dispatches/compose` (Phase 1 endpoint preserved)
- [ ] Compose vibe selector wires through to the LLM call
- [ ] PUBLISH NOW commits MDX and redirects with toast
- [ ] About form's hometown geocode button suggests lat/lng
- [ ] Photos repeatable rows persist captions on save
- [ ] Media uploader rejects > 10MB and non-image/video MIME types
- [ ] Media tile DELETE prompts confirm and removes from Blob

## K · Auth & API

- [ ] `middleware.ts` matches `/admin/:path*` and protected `/api/*` paths
- [ ] All mutating endpoints re-check session inside the handler (don't trust middleware alone)
- [ ] `GET /api/about` is public; `PUT` is admin-only
- [ ] `GET /api/projects` and `GET /api/dispatches` are public (used by RSC)
- [ ] Error envelope shape matches `{ error, code, details? }` everywhere
- [ ] LLM rate limit: KV bucket caps at 30 / 10 min per user

## L · AI

- [ ] Anthropic primary, Groq fallback wired in `lib/ai.ts`
- [ ] Compose endpoint streams via SSE
- [ ] Ask-Claude system prompt includes facts JSON
- [ ] Ask-Claude refuses to invent facts ("That's not in this bulletin…")
- [ ] Compose vibe parameter is passed into system prompt

## M · Reduced motion (`prefers-reduced-motion: reduce`)

- [ ] Marquee static
- [ ] Envelope skip animation
- [ ] Equalizer freeze
- [ ] Bulb pulse static (R3F)
- [ ] Footer bobble disabled
- [ ] World map terminus pulse static
- [ ] Plaque carousel autoplay disabled
- [ ] Newsstand pan inertia disabled
- [ ] Camera shake disabled
- [ ] Newspaper drop-cap reveal static

## N · Responsive (verify at 360, 480, 760, 1024, 1440)

- [ ] Hero panel readable at 360px
- [ ] Envelope centered and `min(86vw, 320px)` at 360px
- [ ] Bulletin grid collapses at < 780px
- [ ] Photo strip 4 → 2 columns at < 600px
- [ ] Metro line collapses to single column at < 900px
- [ ] Plaques sit right of line at < 900px with 60px left margin
- [ ] Wall cards single-column with vertical scroll on phones
- [ ] Newspaper single-column at < 900px
- [ ] Admin grid collapses to single column at < 900px

## O · Performance & a11y

- [ ] Lighthouse Performance >= 85 on `/`
- [ ] Lighthouse Accessibility >= 95 on `/`
- [ ] Lighthouse Best Practices >= 95 on `/`
- [ ] No console errors on any public route
- [ ] No CLS shift > 0.1 on hero
- [ ] All modals trap focus and restore focus on close
- [ ] All interactive elements have visible focus rings

## P · Cleanup & PR

- [ ] No `console.log` in production code (only `console.error` for caught errors)
- [ ] No commented-out code blocks left behind
- [ ] No unused imports
- [ ] All commits authored `rehanmollick <rehanmollick07@gmail.com>` with conventional commit messages
- [ ] No commit message contains "Claude", "Anthropic", or AI-attribution language
- [ ] PR title: `Full site redesign 2026`
- [ ] PR description includes the rendered checklist with each item ticked
- [ ] PR includes screenshots of: home, bulletin open, the line, a plaque, lightbox, /blog wall, a newspaper article, admin dashboard, project edit form
