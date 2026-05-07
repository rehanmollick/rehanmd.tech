# 01 · Design System

The prototype's tokens. Add what's missing to `tailwind.config.ts` and `globals.css`. **Do not invent new tokens.**

## Colors

| Token | Hex | When |
|---|---|---|
| `--bg-primary` | `#0a0a0a` | Page bg below the fade-to-black; admin shell bg |
| `--bg-secondary` | `#111111` | Cards, plaques, admin panels (`form-card`, `stat`) |
| `--bg-tertiary` | `#1a1a1a` | Subtle elevation (admin row alt, divider regions) |
| `--accent` | `#BF5700` | UT burnt orange — primary brand accent everywhere (line, buttons, station nodes, accent borders) |
| `--accent-light` | `#E87A2E` | Hover/glow text, headings on dark, station signs |
| `--accent-dim` | `#8B3F00` | Muted line stubs, dim borders, secondary buttons |
| `--accent-glow` | `#FF6B1A` | Bloom/glow effect color (CSS `box-shadow`, `text-shadow`) |
| `--text-primary` | `#f5f5f5` | Body copy on dark |
| `--text-secondary` | `#a1a1a1` | Subdued copy on dark |
| `--text-muted` | `#666666` | Very dim labels |
| `--tunnel-light` | `#FFB366` | Warm tunnel light tone (existing R3F) |
| `--tunnel-fog` | `#0d0d0d` | Fog (existing R3F) |
| **Bulletin (cream paper)** | | |
| `--paper` | `#f4e8c8` | Wheatpaste poster body |
| `--paper-dark` | `#1a0f05` | Bulletin headings on cream |
| `--paper-text` | `#2a1a08` | Bulletin body text on cream |
| `--paper-rule` | `rgba(80,50,20,.25)` | Bulletin section rules |
| `--paper-eyebrow` | `#7a5520` | Bulletin eyebrow text |
| `--bulletin-stamp-red` | `#9a1a1a` | Bulletin "BULLETIN №07" stamp + rope |
| `--bulletin-amber` | `#ffb43a` | Terminus pin glow on world map |
| **Newspaper** | | |
| `--news-paper` | `#f7f1dc` | Newspaper page body |
| `--news-paper-bg` | `#f2ecd8` | Reader frame around the page |
| `--news-rule` | `#6a5a38` | Dateline / column rules |
| `--news-text` | `#1a1408` | Newspaper body text |
| **Dispatch tape** | | |
| `--tape-amber` | `#ffd866` | Sticky tape on dispatch cards |

## Typography

Three font families. Load via `next/font/google` in `src/app/layout.tsx`:

| CSS var | Family | Weights | Used for |
|---|---|---|---|
| `--font-pixel` | `Press Start 2P` | 400 | Headings, station signs, eyebrow display, footer "LET'S DO IT" |
| `--font-mono` | `Space Mono` | 400, 700 | Eyebrows, meta strings, admin UI, badges, code chips |
| `--font-serif` | `Playfair Display` | 400, 600, 900 (italic for deck) | Bulletin title, newspaper masthead, headlines, deck, drop caps |
| `--font-body-serif` | `Source Serif 4` | 400 | Bulletin body paragraphs |
| `--font-news-body` | Georgia, "Times New Roman", serif | (system) | Newspaper body if `Source Serif 4` not desired |

### Type ramp

| Class / use | Family | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Hero `<h1>` (panel) | pixel | `clamp(36px, 7vw, 72px)` | 400 | 1.05 | `.04em` |
| Hero sub | mono | `12px` | 400 | 1.4 | `.3em` uppercase |
| Marquee | mono | `13px` | 400 | 1 | `.25em` uppercase |
| Section heading (`Dispatches`, `The Line`) | pixel | `clamp(40px, 6vw, 72px)` | 400 | 1.05 | `.02em` |
| Section subtitle | mono | `13px` | 400 | 1.4 | `.25em` uppercase |
| Arrivals row label | mono | `12px` | 700 | 1 | `.15em` |
| Bulletin title (`Md Rehan / Mollick`) | serif italic | `clamp(58px, 7vw, 96px)` | 900 | .95 | `-.01em` |
| Bulletin tagline | serif italic | `22px` | 400 | 1.4 | 0 |
| Bulletin section h3 | pixel | `22px` | 400 | 1.2 | `.04em` |
| Bulletin body p | body-serif | `15px` | 400 | 1.65 | 0 |
| Newspaper nameplate | serif italic | `72px` (mobile `48px`) | 900 | 1 | `.01em` |
| Newspaper headline | serif | `58px` (mobile `36px`) | 900 | 1.05 | `-.01em` |
| Newspaper deck | serif italic | `22px` | 600 | 1.35 | 0 |
| Newspaper byline | mono | `11px` | 400 | 1 | `.15em` uppercase |
| Newspaper body | news-body | `16px` | 400 | 1.65 | 0 (justified, hyphens auto) |
| Drop cap (first p) | serif | `72px` | 900 | .9 | float left |
| Pullquote | serif italic | `22px` | 600 | 1.35 | 0 |
| Plaque title | pixel | `28px` | 400 | 1.1 | `.02em` |
| Plaque desc | sans | `14px` | 400 | 1.6 | 0 |
| Plaque tech chip | mono | `10px` | 400 | 1 | `.15em` uppercase |
| Footer title `LET'S DO IT.` | pixel | `clamp(48px, 8vw, 96px)` | 400 | 1 | `.06em` |
| Admin h2 | pixel | `32px` | 400 | 1 | `.02em` |
| Admin form label | mono | `10px` | 400 | 1 | `.2em` uppercase |
| Admin button | mono | `11px` | 400 | 1 | `.1em` uppercase |

## Spacing

Use these values literally. No arbitrary `gap-7` sprinkle.

```
4 · 6 · 8 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 30 · 36 · 40 · 48 · 60 · 80 · 100 px
```

Section vertical padding is **`80px` top + `80px` bottom** for all dark sections (Dispatches, The Line, Footer). The Bulletin modal interior uses `60px 60px 80px` desktop / `30px 24px 40px` mobile.

## Radii

Almost everything is **`0px`** — flat retro. Exceptions:

| Element | Radius |
|---|---|
| Round buttons (lightbox close `✕`, wall nav arrows) | `50%` if circular, else `0` |
| Bolt decoration on plaques + lightbox | `50%` |
| Station node dot | `50%` |
| World-map pin circles | `50%` |
| Admin "switch" toggle | `9px` track / `50%` thumb |

## Borders

- Plaques and lightbox: `3px solid var(--accent)` outside, `1px solid var(--accent-dim)` inside `padding:4px` margin (creates the bolted-frame look)
- Bulletin border: `4px solid var(--paper-dark)` outer + inner `1px dashed var(--paper-dark)` on `.ap-body`
- Admin inputs: `1px solid #2a2a2a`, focus border `var(--accent)`
- World map frame: `2px solid var(--accent)` with inset glow `inset 0 0 60px rgba(191,87,0,.1)`
- Newspaper masthead bottom: `3px double var(--paper-dark)`

## Shadows

- Plaque media hover: none (flat). The frame already does the work.
- Lightbox frame: `0 0 60px rgba(191,87,0,.3)` outer glow
- Bulletin modal: `0 30px 60px rgba(0,0,0,.5)`, the `.about-modal` overlay itself uses `backdrop-filter: blur(6px)` over `rgba(0,0,0,.94)`
- Tweaks panel: removed (out of scope)
- Footer title text-shadow: `0 0 24px rgba(255,140,50,.45), 0 4px 0 #6a2a00`

## Z-index layers

| Layer | z |
|---|---|
| Train R3F Canvas | `0` |
| Train HTML overlays (envelope, marquee, hero panel) anchored via `<Html>` | `1` |
| Page sections (relative content) | `10` |
| Sticky nav | `50` |
| Toasts | `90` |
| Lightbox / Bulletin / Reader modals | `200` |
| Admin save-bar (sticky) | `5` (within admin shell only) |

## Animation timing

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(.25,.46,.45,.94)` |
| `--ease-spring` | spring `{ damping: 22, stiffness: 220 }` (Framer Motion) |
| `--dur-micro` | `150ms` |
| `--dur-default` | `300ms` |
| `--dur-section` | `600ms` |
| `--dur-envelope-flap` | `900ms` |
| `--dur-envelope-letter` | `700ms` (after flap) |
| `--dur-bulb-pulse` | `1.6s` linear infinite |
| `--dur-eq-bar` | `1s` ease-in-out infinite |
| `--dur-bobble` | `1.4s` ease-in-out infinite |
| `--dur-marquee` | `40s` linear infinite (full loop) |

## Breakpoints

```
mobile portrait   <  480px
mobile landscape  >= 480px and < 760px
tablet            >= 760px and < 1024px
desktop           >= 1024px
wide              >= 1320px
```

Behavior callouts:

- **Nav `<ul>`** hides at `< 900px` (collapses to brand + ADMIN button only). Add a hamburger mini-sheet that lists the same routes (this is new vs. prototype — prototype simply hides; do the same and document).
- **Metro stations**: at `< 900px` collapse to single column with `40px 1fr` grid; left/right alternation disappears, all plaques on the right of the line, line shifts to `left:20px`.
- **Bulletin body grid**: 2 columns desktop → 1 column at `< 780px`. Photo strip 4 → 2 columns.
- **Reader columns**: 2 cols desktop → 1 col at `< 900px`. Headline `58px → 36px`. Nameplate `72px → 48px`.
- **Admin chrome**: `240px 1fr` desktop → 1 col at `< 900px`. Form grid `1fr 360px` → 1 col.
- **Wall viewport**: height `min(80vh, 720px)` desktop → `600px` at `< 900px`.

## Reduced-motion fallbacks

| Animation | Reduced state |
|---|---|
| Marquee scroll | static, single line of text |
| Envelope flap + letter slide | skip animation; show open envelope immediately |
| Equalizer bars | freeze at 50% height |
| Bulb pulse | static `opacity:.6` |
| Footer bobble | no transform; `--accent-light` color stays |
| Camera shake (R3F) | disable `<CameraShake>` |
| Plaque carousel autoplay | pause; user must use arrows |
| Newsstand corkboard pan | enabled but slowed to 50% |
| Terminus pulse on world map | static ring |
