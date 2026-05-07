# 08 · Newsstand Wall & Newspaper Reader

Two surfaces:
1. **Dispatches strip** on home (`<DispatchesSection />`) — 3 latest cards with "see all" → `/blog`.
2. **Newsstand wall** at `/blog` — pannable + paginated corkboard.
3. **Newspaper reader** at `/blog/[slug]` — multi-column poster article.

Train scene is NOT mounted on `/blog` or `/blog/[slug]`.

## Home dispatches strip (`DispatchesSection.tsx`)

Section frame:
- `id="dispatches"`, `background: var(--bg-primary)`, padding `80px 0`, max-width `1240px`, side padding `48px / 20px`.
- Heading row identical structure to The Line: eyebrow `LATEST · NEWSSTAND No. 12`, h2 `DISPATCHES.`, sub `Field notes from the carriage. Updated whenever the rails clear.`
- Right-side affordance: a tape-style button `[ SEE ALL ON THE WALL ↗ ]` mono `12px` `.2em` linking to `/blog`. Border `1px dashed var(--accent-dim)` padding `10px 14px` rotated `-1deg`. Hover: rotate `0`, accent border.

Cards: a flex row of 3 `<DispatchCard>` (the most recent), gap `28px`. Below `900px` they stack.

## `DispatchCard.tsx`

The "thumbtack on cork" card. Same component used on home strip and on the wall.

### Frame

- Background: cream `#fbf3d8` (slightly lighter than bulletin paper).
- `2px solid var(--paper-dark)` border, no radius.
- Padding `0` on outer, content padding `16px 18px 18px`.
- Slight rotation per card index: `-2deg, 1.2deg, -.6deg, 2.4deg` cycling. Set via inline `style={{ transform: \`rotate(${rot}deg)\` }}`.
- Drop shadow `0 18px 26px rgba(0,0,0,.55)`.
- Top edge: a `28px × 12px` amber tape strip `var(--tape-amber)` centered horizontally, slight `rotate(-3deg)`, opacity `.92`, with two thin parallel lines for tape texture.
- Top-left corner: `12px` thumbtack — circle `var(--bulletin-stamp-red)` (or per-card color from `thumbColor`), with a `2px` highlight quarter-circle top-left. `box-shadow: 1px 2px 3px rgba(0,0,0,.4)`.

### Content

Vertical stack:

1. Hero image (optional): `aspect-ratio: 16/10`, `object-fit:cover`, `1px solid var(--paper-dark)`. Placeholder striped if missing.
2. Eyebrow row: mono `10px` `.2em` uppercase `var(--paper-eyebrow)` — `DISPATCH ·  ${formattedDate}`. Right-side: tag pills (max 2), mono `9px` `var(--paper-dark)` bg `var(--paper)` border `1px solid var(--paper-dark)` padding `2px 6px`.
3. Title: serif (Playfair) `22px`, weight `900`, `var(--paper-dark)`, `line-height:1.15`, two-line clamp.
4. Excerpt: serif body `13px`, `line-height:1.55`, `var(--paper-text)`, three-line clamp.
5. Footer row: mono `10px` `.2em` uppercase `var(--accent)` left `READ DISPATCH ↗`, right small mono `${readMins} MIN`.

Whole card is a link to `/blog/${slug}`. Hover: rotate `0deg`, lift `translateY(-3px)`, shadow stronger. Reduced motion: no transform.

### Pinned dispatches

If `pinned: true`, render an additional `★ PINNED` chip in the eyebrow row, mono `9px` `.2em`, color `var(--bulletin-stamp-red)`. On the wall, pinned cards render first regardless of date.

## `NewsstandWall.tsx` (the `/blog` page)

The wall is a paginated corkboard. The user can pan within the current wall, and use prev/next to jump to the previous/next 9-card wall.

### Page frame

- Background: `var(--bg-primary)` outside the wall, **the wall itself** is a corkboard texture: `background-image: url('/assets/cork-tile.jpg'); background-size: 280px;` plus a subtle vignette `radial-gradient(ellipse at center, transparent 0, rgba(0,0,0,.55) 100%)`. (Cork tile is in `assets/cork-tile.jpg` — copy.)
- Page padding `60px 24px 100px`.
- Heading row (no train scene above): eyebrow `THE NEWSSTAND · WALL ${currentWall + 1} / ${totalWalls}`, h1 `READ ALL ABOUT IT.`, sub mono `Field notes, post-mortems, half-formed thoughts. ${total} dispatches, organized by hand.` Right side: search input (mono `13px`, paper bg, `1px solid var(--paper-dark)`, placeholder `SEARCH DISPATCHES…`).

### Wall viewport

```
<div class="wall" style="height: min(80vh, 720px); overflow:hidden; position:relative; cursor:grab;">
  <div class="wall-cork" style="width: 200%; height: 100%; transform: translateX(<panX>px);">
    {cardsForCurrentWall.map(...)}
  </div>
</div>
```

- Cards are absolutely positioned within `.wall-cork` in a 3×3 grid (9 per wall) with hand-tuned per-cell offsets so it feels haphazard. Use a deterministic seeded layout:
  ```
  for i in 0..8: cell = (i%3, floor(i/3))
  baseX = 80 + cell.col * 360
  baseY = 40 + cell.row * 240
  jitterX = seeded(±28)
  jitterY = seeded(±18)
  rot    = seeded(-3..3)
  ```
- Card size: `320px × auto`.
- Pan: pointer-down sets dragging, pointer-move updates `panX` clamped to `[-cork.width + viewport.width, 0]`. On pointer-up release. Cursor `grabbing` while dragging.
- Wheel horizontal: shift+wheel or trackpad-x maps to `panX`. Wheel-y reserved for browser scroll.
- Prev/next wall buttons: bottom-center pair, mono `12px` `.2em`, square `44px`, `1px solid var(--paper-dark)`, `var(--paper)` bg. Glyphs `‹ ›`. Disabled state at boundaries (opacity `.4`).
- Page indicator below buttons: mono `11px` `var(--paper-eyebrow)`: `WALL ${i+1} / ${n}`.
- A small `RESET PAN` mono link bottom-right, `10px` `.15em` uppercase `var(--accent)`.

### Card placement

Each card uses `<DispatchCard />` rendered inside a positioned wrapper:
```jsx
<div style={{ position:'absolute', left:x, top:y, width:320 }}>
  <DispatchCard {...d} indexOnWall={i}/>
</div>
```

### Empty state

`< 1 dispatch`: render a single centered cream poster `THE WALL IS EMPTY · CHECK BACK SOON` with one fake thumbtack. Hide pan and pagination.

### Search

- Filters across title, excerpt, tags. Debounce `200ms`.
- When a search returns N results, repaginate to `Math.ceil(N/9)` walls. Update header counter.
- No-match: empty cork wall + cream poster `NO DISPATCHES MATCH "${query}"`.

### Mobile (`< 760px`)

- Cards become `90vw` wide, single-column inside the wall.
- Pan disabled; replaced with vertical scroll within the wall viewport.
- Wall viewport height `600px`, swipe-y enabled.
- Prev/next jump entire walls.

### Reduced motion

- Pan still works (it's interaction, not autoplay) but the inertial coast on pointer-up is disabled.
- Card rotations reduced to half (`±1deg` max).

## `NewspaperReader.tsx` (the `/blog/[slug]` page)

A faithful newspaper poster.

### Page frame

- Outer bg: `var(--news-paper-bg)` `#f2ecd8`, padding `60px 0 100px`.
- Inner page: max-width `1100px`, centered, `var(--news-paper)` bg, padding `48px 56px 72px`, subtle paper-noise texture overlay (same paper-noise.png at 6%).
- Top: a `THE REHAN HERALD` style nameplate.

### Nameplate

A horizontal header band:

```
LEFT META  |  CENTER NAMEPLATE                    |  RIGHT META
```

- Left: mono `10px` `.2em` uppercase `var(--news-rule)`:
  ```
  VOL. III · NO. 47
  REHANMD.TECH
  AUSTIN, TX
  ```
- Center: `THE REHAN HERALD` serif italic `72px` (mobile `48px`), weight `900`, `var(--news-text)`, with `3px double var(--news-rule)` border-bottom inside the band.
- Right: mono `10px` `.2em` uppercase `var(--news-rule)`:
  ```
  ${formattedLongDate}
  ${weather() || 'CLEAR · 72°F'}
  ${readMins} MIN READ
  ```

### Dateline

A single mono row immediately under nameplate: `AUSTIN, TX — ${monthDay}` `12px` `.2em` uppercase `var(--news-text)`.

### Headline & dek

- Headline: serif `clamp(36px, 5vw, 58px)`, weight `900`, `var(--news-text)`, `line-height:1.05`, `text-wrap: balance`.
- Dek: serif italic `22px`, weight `600`, `var(--news-text)`, max-width `60ch`.
- Hairline rule under dek: `1px solid var(--news-rule)`, full content width, with a centered tiny diamond glyph `◆` overlaid on the rule (mono `12px`, `var(--news-rule)`, bg `var(--news-paper)` padding `0 8px`).

### Byline strip

Mono `11px` `.2em` uppercase `var(--news-rule)`. Three flexed parts:
- Left: `BY MD REHAN MOLLICK · STAFF CORRESPONDENT`
- Middle: tag pills (max 3), `1px solid var(--news-rule)`, padding `2px 6px`, `9px` mono uppercase
- Right: share row `EMAIL · COPY LINK · X`, each clickable

### Body

- 2-column CSS multi-column layout `column-count:2; column-gap:36px; column-rule:1px solid var(--news-rule)`.
- Paragraphs: `--font-news-body` `16px`, `line-height:1.65`, `var(--news-text)`, `text-align:justify`, `hyphens:auto`.
- First paragraph drop cap: `::first-letter { font-family: var(--font-serif); font-size:72px; font-weight:900; float:left; line-height:.9; padding:6px 8px 0 0; color: var(--news-text);}`.
- H2 within body: small-caps mono `13px` `.2em` uppercase, `var(--news-text)`, with a `1px` rule above and `8px` margin-top.
- H3: serif `20px` weight `900`.
- Pullquote (custom MDX `<PullQuote/>`): `column-span: all`, serif italic `28px`, weight `600`, padding `24px 36px`, `border-top: 3px double var(--news-rule); border-bottom: 3px double var(--news-rule)`, centered.
- Inline images (`<HeroImage/>` MDX): `column-span: all`, full-width, `2px solid var(--news-text)`, caption mono `11px` `.15em` italic `var(--news-rule)` below.
- Code blocks (`<CodeChip/>` MDX): mono `12px`, `var(--bg-primary)` bg, `var(--text-primary)` fg, padding `2px 6px`. Multi-line code blocks: `column-span: all`, `var(--bg-primary)` bg, padding `20px`, mono `13px`.

### Sidebar

A right-rail "From the wires" sidebar at top-right of body grid. On desktop only (≥ `900px`). Implemented as `column-span: all` followed by relayout, OR simpler: split body into a `grid: 1fr 280px gap:48px`, and let the LEFT cell use multi-column.

Sidebar contents:
- Header pixel `14px` `var(--news-text)`: `FROM THE WIRES`.
- Three smaller dispatch summaries, each a mini card: title serif `15px` weight `900`, date mono `9px`, link arrow.
- Below: a tape-style `MORE ON THE WALL → /blog` link.

### Footer of article

- A `3px double var(--news-rule)` rule.
- Mono row: `END OF DISPATCH · ${slug.toUpperCase()} · FILED ${formattedDate}`.
- Centered `★ ★ ★` mono separator.
- "What to read next" — two side-by-side mini cards (prev / next dispatch by date).

### Mobile (`< 900px`)

- Single-column body (multi-column off).
- Sidebar collapses to a section after the body.
- Nameplate `48px`.
- Headline `36px`.
- Page padding `28px 20px 60px`.

### Loading / error

- Loading: nameplate render immediately, body shimmer (3 bars at 100%, 95%, 70% widths, mono `16px` line height, animated brightness pulse).
- 404: render the page frame + nameplate + a centered `THIS DISPATCH HAS BEEN PULLED FROM THE PRESS` serif `36px` + a `BACK TO THE WALL ↗` link.

### MDX components

`src/components/blog/MDXComponents.tsx` exposes:
- `h2, h3, p, ul, ol, li, blockquote, hr, a, img, code, pre`
- `<PullQuote>`, `<HeroImage src alt caption>`, `<Aside>` (a paper-colored sidebar block, single-column override)
- `<Footnote n>` + a footnotes section auto-collected at body end

### Print

Add a print stylesheet so cmd+P produces a clean newspaper PDF: drop sidebar to bottom, force 1-column, hide share/footer-cards.

### Reduced motion

Nothing animates here that needs disabling, except a subtle drop-cap reveal — disable.
