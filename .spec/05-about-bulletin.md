# 05 · About Bulletin Modal

Triggered by clicking the envelope/poster. A wheatpaste-style cream "bulletin" pinned to a dark backdrop.

## Modal frame

- Backdrop: `position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.94); backdrop-filter:blur(6px)`. Fades in over 200ms.
- Modal: cream paper `var(--paper)`, `4px solid var(--paper-dark)` border, max-width `980px`, max-height `min(92vh, 1100px)`, centered. Inner padding `48px 56px 64px`. Box-shadow `0 30px 60px rgba(0,0,0,.5)`.
- Subtle paper texture: layered CSS `background-image: url('/assets/paper-noise.png'), var(--paper)` with `background-blend-mode: multiply` at 6% opacity. (The noise PNG is in `assets/paper-noise.png` — copy it.)
- Close button (top-right, `28px` from corners): `36px × 36px` square, `2px solid var(--paper-dark)`, glyph `✕`, `--font-mono`, `16px`. Hover: invert.
- Body scroll: locked while open.

## Header

Three rows stacked, all left-aligned:

1. Eyebrow row (between rules):
   ```
   ──────────────  BULLETIN №07 · A DISPATCH FROM THE CONDUCTOR  ──────────────
   ```
   Mono `11px` `.25em` uppercase `var(--paper-eyebrow)`. Two flexed `1px` rules in `var(--paper-rule)`.

2. Title block (flex row, gap `40px`):
   - Left: serif italic `Md Rehan` then linebreak `Mollick` — sizes per ramp. Optical kerning. `var(--paper-dark)`.
   - Right: a small bordered "stamp" rotated `-6deg`: red border `var(--bulletin-stamp-red)`, mono uppercase `10px`, three lines: `OFFICIAL`, `BULLETIN`, `№07`.

3. Tagline: serif italic `22px`, `var(--paper-dark)`, max-width `60ch`:
   > Engineer who designs, designer who ships. Operating from Austin, raised between four cities.

## Body grid

Two-column grid `1.4fr 1fr`, gap `48px`. Below `780px`: single column.

### Left column — World map + Now Playing

#### `BulletinWorldMap.tsx`

A real-world map, NOT transit-style.

- SVG width `100%`, aspect `1.6:1`, viewBox `0 0 1600 1000`.
- Source: `assets/land-110m.json` (Natural Earth land). Project with d3-geo `geoEqualEarth().fitSize([1600,1000], land)`.
- Land path: fill `#1f160a` (dark earth), stroke `#3a2a14` `0.5px`.
- Ocean: page paper color via the wrapper — DO NOT fill ocean inside the SVG; let the cream paper show through.
- Frame: `2px solid var(--accent)` outside the SVG container, with `inset 0 0 60px rgba(191,87,0,.1)` glow.

Pins (8 max, fed from `/api/about` `pins[]`). Per pin:
- A `circle r=6` dot, fill `var(--accent)` for `lived/family/school`, fill `#c97a3a` for `visited`.
- A short label to the right: mono `10px` uppercase `.15em`, `#5a3a14`, e.g. `LONDON · 2009`.
- Pins fade in stagger `60ms` each on modal open.

Terminus pin (Austin, identified by `kind:'terminus'` or `name==='Austin'`):
- `r=10` outer ring `var(--accent)` filled `var(--accent-light)`.
- A `★` glyph centered at the pin, `--font-mono` `12px` `#fff`.
- A pulsing ring: SVG `<animate>` `r 10→22`, `opacity 0.8→0`, `dur 1.6s`, `repeatCount=indefinite`.
- Mono label `AUSTIN · NOW` `12px` `var(--accent)`.

Pacific-crossing dashed rope: an SVG `path` from the leftmost-non-Austin pin (or hometown if defined) across the Pacific to Austin, drawn with `stroke="var(--bulletin-stamp-red)"`, `stroke-dasharray="6 4"`, `stroke-width="1.5"`, `fill="none"`. Use d3-geo `geoInterpolate(a, b)` to sample 60 points so the rope curves on the projection. Add a `<animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" />` once on mount.

#### `BulletinNowPlaying.tsx`

Card directly under the map. Cream paper, `1px dashed var(--paper-rule)` border, padding `16px 18px`. Layout flex row gap `14px`:
- Left: `52px × 52px` album art (Image with `border:1px solid var(--paper-dark)`); fallback solid `var(--accent-dim)`.
- Right: stacked
  - Eyebrow mono `9px` `.25em` `var(--paper-eyebrow)`: `NOW PLAYING · SPOTIFY` (or `RECENT · SPOTIFY` if `isPlaying:false`).
  - Title serif `16px` `var(--paper-dark)`.
  - Artist serif italic `13px` `var(--paper-text)`.
  - Right-edge: an equalizer of 4 vertical bars (`3px × 14px`, `var(--accent)`) animating heights `1s ease-in-out infinite`, `animation-delay` staggered. Reduced motion: bars freeze at 50%.

Polls `/api/now-playing` every `30s`. On `isPlaying:false`, dim equalizer to `opacity:.4` and label changes to `RECENT`.

### Right column — Facts + Photo strip + Ask Claude + Links

#### `BulletinFacts.tsx`

A header `THE FACTS` (pixel `22px`) then a key-value list rendered as a tight `<dl>`. Each row:
- `<dt>` mono `10px` uppercase `.2em` `var(--paper-eyebrow)` width `120px`.
- `<dd>` body-serif `15px` `var(--paper-text)`.

Source: `/api/about facts[]`. Required keys (validation in admin form): `Born`, `Lives`, `Studies`, `Studies at`, `Builds`, `Believes`, `Currently`. Display in array order — admin reorders by drag in the form (covered in `10-admin.md`).

#### `BulletinPhotoStrip.tsx`

Header `THE STRIP` then a 4-column grid (gap `12px`). At `< 600px` collapses to 2 columns.

Each tile:
- `aspect-ratio: 4/5`
- `2px solid var(--paper-dark)` border, `1px` cream inset (looks like a polaroid)
- `<img>` with `object-fit:cover`
- Caption strip below image: mono `9px` `.15em` uppercase, `var(--paper-eyebrow)`, padding `6px 8px`, max 2 lines, ellipsis on overflow.
- Slight `rotate(-1.5deg → 1.5deg)` per index using `nth-child` for variety.
- Tap on mobile or click on desktop: open in a small lightbox (re-use `<ProjectLightbox>` with the photo set).

Source: `/api/about photos[]`. Show first 4 by default; if more exist, render a `+ N MORE` tile that opens the strip lightbox at the first overflow photo.

#### `BulletinAskClaude.tsx`

Header `ASK ME ANYTHING (REALLY, ASK CLAUDE)`.

Body:
- Textarea (cream `#fbf3d8`, `2px solid var(--paper-dark)`, mono `13px`, padding `10px 12px`, rows `2`, max 280 chars), placeholder `"What's your favorite project? Why Austin?"`.
- Submit button next to textarea: square `54px`, `var(--paper-dark)` bg, `var(--paper)` fg, mono `11px` `.15em` uppercase `ASK ↵`. Disabled while loading; shows a 4-dot ellipsis loop at `0.6s/dot`.
- Below: answer area, body-serif `15px`, line-height `1.65`, `var(--paper-text)`. Stream tokens in. Max 600 char visible.
- A small mono `10px` line under the answer: `— answered by claude · facts pulled from this bulletin`.

Implementation: client component calls `window.claude.complete({ messages: [{role:'user', content: q}], system: ABOUT_ASK_SYSTEM(facts) })`. If `window.claude` not present (running on real domain), fall back to `fetch('/api/ask', {method:'POST', body:{q}})` which uses `lib/ai.ts` server-side.

System prompt: see `02-architecture.md` `ABOUT_ASK_SYSTEM`. Context object includes `facts`, `bio`, `tagline`, list of `pins`. Answer in first person as Rehan. **NEVER invent facts not present in context.** If unanswerable: `"That's not in this bulletin. Ask Rehan directly via the links below."`.

#### `BulletinLinks.tsx`

Header `THE LINKS`. Inline-flex row of buttons, gap `8px`. Each button is a "ticket stub" `padding:8px 12px`, `1px dashed var(--paper-dark)`, mono `10px` `.2em` uppercase, hover invert. Examples (from About config `links[]`): `EMAIL`, `GITHUB`, `LINKEDIN`, `RESUME ⇣`, `TWITTER`.

## Footer of bulletin

A bottom rule + mono row aligned space-between:
- Left: `END OF BULLETIN №07`
- Right: `ISSUED FROM AUSTIN, TX · ${YYYY-MM-DD}`

Both `10px` `.2em` uppercase `var(--paper-eyebrow)`.

## Animations

- Modal enter: scale `.96 → 1`, opacity `0 → 1`, `400ms` `--ease-out`.
- Backdrop: `200ms` fade.
- Pins: stagger fade `0 → 1` + `scale .6 → 1`, `60ms` each.
- Rope: `dashoffset 200 → 0` over `2s` `--ease-out`.
- Section reveal (left/right columns): each `<section>` slides up `12px → 0` + fade in, stagger `80ms`.

Reduced motion disables stagger and rope draw — pins appear instantly.

## Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title.
- Focus trap inside modal (tab loops between close, ask textarea, ask submit, links).
- Initial focus on close button.
- `Esc` closes. Click on backdrop closes. Click inside modal does not close.
- Each section heading is a real `<h3>`; the `<h2>` is the title block.

## Edge cases

| Case | Behavior |
|---|---|
| `/api/about` 404 / no KV value | Use a hardcoded fallback in `lib/about.ts.DEFAULT_ABOUT` (the prototype's `data.js` `aboutData` literal). |
| `< 4` photos | Render only what exists; no placeholder tiles. |
| `> 8` photos | Show first 4 + `+N MORE` tile. |
| `< 4` pins | Render what exists; no rope if only Austin. |
| `pin.lat` invalid | Filter out at fetch boundary; never render broken pin. |
| Ask Claude rate-limited | Inline error in answer area: `"Ask hit a limit. Try again in a minute."` |
| Ask Claude empty input | Submit disabled until non-empty. |
| Ask Claude > 280 char | Counter turns red; submit disabled. |
| Photo lightbox open above modal | Stack as `z-index: 250`. Close lightbox first on Esc, then modal on second Esc. |
