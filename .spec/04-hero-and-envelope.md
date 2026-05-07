# 04 · Hero Panel & About Envelope

Two distinct surfaces:
1. **Hero panel + marquee + scroll cue** — HTML overlays sitting over the R3F train Canvas in the first viewport.
2. **About envelope card** — lives in a dedicated `<AboutSection />` BELOW the train, replacing the Phase 1 broken envelope. It is NOT mounted inside the R3F scene.

The CLICK HERE wall poster inside the R3F scene is a separate component that already works (in-scene contact-details popup) and is **kept as-is**. Do not confuse it with the About envelope.

## Hero panel (`HeroPanel.tsx`)

Absolute, top-left of `train-stage`, `padding: 60px 60px 0`. Contains:

```
EYEBROW          MD REHAN MOLLICK · AUSTIN, TX
H1               BUILT BY HAND.
                 SHIPPED ON TRACK.
SUB              Engineer · Designer · Operator
                 ─────────
                 Currently aboard the Burnt Orange Line.
```

- Eyebrow: `font-mono`, `12px`, `letter-spacing:.3em`, `text-transform:uppercase`, color `var(--text-secondary)`.
- H1: `font-pixel`, `clamp(36px,7vw,72px)`, color `var(--text-primary)`, line-height `1.05`. Two lines, `<br>` between.
- Sub: `font-mono`, `12px`, `letter-spacing:.2em`, uppercase, `var(--text-primary)`, then a `36px × 1px` rule in `var(--accent)`, then a tagline line in `var(--accent-light)` italic-style mono.

Mobile (< 760px): collapse padding to `28px 20px`, h1 size `clamp(28px,9vw,44px)`, eyebrow `10px`.

## Marquee (`Marquee.tsx`)

Top of stage, full width, `position:absolute; top:0; left:0; right:0; height:36px;`. Background `rgba(10,10,10,.6)` with `backdrop-filter: blur(8px)` and a `1px solid rgba(255,255,255,.06)` bottom border. Inside: a `flex` row that animates `translateX(-50%)` over `40s linear infinite`, looping the same string set twice.

Strings (verbatim from prototype, separated by ` · ` glyph):
```
NOW BOARDING — THE BURNT ORANGE LINE · DESTINATION: AUSTIN ·
LIVE FROM REHANMD.TECH · NEXT STOP: SHIP IT · MIND THE GAP ·
FOLLOW THE LINE · NOW BOARDING — THE BURNT ORANGE LINE
```

Font `--font-mono`, `13px`, `letter-spacing:.25em`, uppercase, color `var(--accent-light)`.

Reduced motion: stop animation, show static segment, allow horizontal overflow.

## Scroll cue (`ScrollCue.tsx`)

`position:absolute; bottom:32px; left:50%; transform:translateX(-50%);` Two stacked elements:
- Mono label `FOLLOW THE LINE ↓`, `11px`, `.2em` tracking, `var(--accent-light)`.
- A `1px × 56px` orange rule beneath that animates a vertical highlight downward (CSS `::after` 12px tall, gradient `linear-gradient(to bottom, transparent, var(--accent-light))`, animated `translateY` `0 → 56px` over `1.6s` ease-in-out infinite).

## About section + envelope (`AboutSection.tsx` → `EnvelopePoster.tsx`)

`<AboutSection id="about">` lives in `<main className="below-train">`, immediately after the hero/train viewport. It is the FIRST scroll-revealed section the user encounters when they scroll past the train.

Section frame:
- `background: var(--bg-primary)`, padding `100px 0 80px`, max-width `1240px` centered, side padding `48px / 20px`.
- Three-row heading like other sections: eyebrow `INTRODUCTIONS · SECTION 01`, h2 `WHO'S DRIVING THIS THING?`, sub mono `Slide open the bulletin to find out.`
- Below the heading: the envelope card centered horizontally, max-width `clamp(320px, 40vw, 480px)`, aspect ~5:7.

Surrounding the envelope, decorative "wheatpaste-around-the-poster" treatment: a few mono `--font-mono` `9px` `var(--text-muted)` torn-paper labels at random rotations near the corners (`POSTED 05·24`, `BULLETIN №07`, `DO NOT REMOVE`). Optional flourish, can be omitted if it clutters mobile.

`EnvelopePoster.tsx` wraps `SealedEnvelope` (first visit) and `PullTabPoster` (subsequent). On mount:
```ts
const opened = typeof window !== 'undefined' && localStorage.getItem('rehanmd:envelope-opened') === '1';
const [mode, setMode] = useState<'sealed'|'flat'>(opened ? 'flat' : 'sealed');
```

### Sealed envelope (first visit)

A 2D HTML/CSS envelope, NOT 3D. Layers (z-stacked):

| Layer | Description |
|---|---|
| `.env-back` | Cream paper rectangle `var(--paper)`, `4px solid var(--paper-dark)` border, `box-shadow: 0 14px 30px rgba(0,0,0,.55)` |
| `.env-letter` | White paper `#fff8e7` rectangle inset `12px`, holds the letter content. Hidden until flap opens. |
| `.env-flap` | Triangular SVG flap colored `var(--paper)` slightly darkened (`#e8d9aa`), `transform-origin: top center`, initial `rotateX(0deg)` (closed), animates to `-180deg` |
| `.env-seal` | Red wax circle `var(--bulletin-stamp-red)`, `36px`, centered at flap bottom, with `★` glyph. Initial scale 1; on open animates `scale(0)` over 200ms |

Sequence on first mount (Framer Motion):
1. `t=0`: All visible, sealed, slight `y:[0,-4,0]` 1.4s loop "breathing" inviting click.
2. On click of envelope:
   - Wax seal scales to 0 (200ms).
   - Flap rotates `0 → -180deg` over `900ms` ease-out (`--ease-out`).
   - At `t=400ms` letter slides up `y: 24px → 0`, `opacity: 0 → 1` over `700ms`.
   - At `t=1100ms` show "OPEN" CTA at letter bottom (`24px` mono uppercase, orange).
3. Click "OPEN" → set `localStorage['rehanmd:envelope-opened']='1'` → open `<AboutBulletinModal />`.
4. On modal close, the envelope remains visually "open" until next page load. On next page load it loads as `<PullTabPoster />`.

### Letter content sizing (fixes the Phase 1 overflow bug)

Internal letter area:
- Width: `calc(100% - 24px)` (12px inset)
- Height: `calc(100% - 28px)` (12px inset top, 16px inset bottom for the "OPEN" button)
- Padding: `20px 22px`
- Font: `--font-body-serif`, `13px`, `line-height:1.5`, `color: var(--paper-text)`.
- Max 6 lines of body text. Use `text-wrap: balance` and `hyphens: auto`.
- Headline at top: `--font-pixel`, `12px`, `var(--paper-dark)`, `letter-spacing:.05em` — text: `A LETTER`.
- Sub-headline below: `--font-serif italic`, `15px`, `var(--paper-dark)` — `from your conductor.`
- Body: 3 short lines, e.g.:
  > Glad you boarded. This carriage is mostly under construction, but the seats are warm.
  > Pull the tab to read the full bulletin — it covers who I am, where I've been, and what's currently in the workshop.
  > — Rehan

`overflow:hidden` on letter container; if content ever overflows in user testing, **shrink font to 12.5px**, do not clip.

### Pull-tab poster (subsequent visits)

Static poster, no animation on mount. Same outer dimensions as sealed envelope.

Layout:
- Cream paper `var(--paper)`, `4px solid var(--paper-dark)` border, slight rotate `-1.5deg`.
- Top eyebrow: `BULLETIN №07` mono `10px` `.2em` uppercase, color `var(--bulletin-stamp-red)`.
- Big serif italic title centered: `who is rehan?` `42px` italic.
- Mono sub: `PULL TAB TO READ` `11px` `.25em`.
- Bottom: a "ticket stub" — dashed rule top, then a flex row `[ TAB ⟶ ]` mono `13px`, full-width as the clickable button.
- Subtle CSS `box-shadow: 0 12px 24px rgba(0,0,0,.55)` and four `::before/::after` pseudos at the corners faking pushpins (`8px` red circles).

Click anywhere on the poster opens `<AboutBulletinModal />`.

### Hover and focus

- Sealed: cursor `pointer`, slight `scale(1.02)` on hover, accessible button role with `aria-label="Open the bulletin from Rehan"`.
- Pull-tab: same; the `[ TAB ⟶ ]` row gets `background: var(--paper-dark); color: var(--paper);` on hover.

### Edge cases

| Case | Behavior |
|---|---|
| `localStorage` unavailable (SSR or private mode) | Default to `sealed`. Save attempt is wrapped in try/catch. |
| User completes the open animation but never clicks "OPEN" | Don't write the localStorage flag yet. Only write after they actually open the modal. |
| Reduced motion + first visit | Skip flap and slide; render letter open immediately, "OPEN" button visible at t=0. |
| Viewport `< 480px` | Envelope centered, width `min(86vw, 320px)`. Letter font `12px`. Body shrinks to 4 lines (drop the "Pull the tab…" line). |
| Long About modal load | Show a `<Toast>` "Loading bulletin…" if `fetch /api/about` exceeds 600ms. |

### State diagram

```
        first-visit                    subsequent-visit
[Sealed] --click--> [Opening anim]      [Flat poster]
   |                      |                  |
   |                  [Open CTA]              |
   |                      |                  |
   +-----> [Modal] <-+----+------------------+
                    |
                    +-----[Esc / backdrop]----> [back to envelope state]
```

`<EnvelopePoster />` exports a `mode` and `modalOpen` from a small zustand store (`stores/envelope.ts`) so the modal close handler can clean up correctly.
