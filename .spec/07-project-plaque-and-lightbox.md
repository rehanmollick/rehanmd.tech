# 07 · Station Plaque & Project Lightbox

The card that hangs off each metro station node, plus its fullscreen carousel.

## `StationPlaque.tsx`

The plaque is a "bolted to the wall" card, **flat retro**.

### Outer frame

- `position:absolute` (anchor logic in `06-metro-line.md`).
- `width:100%; max-width:460px;`
- Background `var(--bg-secondary)` `#111`.
- Border: `3px solid var(--accent)` outer; `4px` padding to inner; `1px solid var(--accent-dim)` inner ring (use a wrapper div).
- Four "bolts": `8px` circles `var(--accent-light)` at each corner, inset `10px` from frame, `box-shadow: inset 0 0 0 2px var(--bg-secondary)`.
- No drop shadow.

### Internal layout

Vertical stack inside frame, padding `0` on the wrapper, `20px 22px` on the content section directly below the media.

```
[ MEDIA CAROUSEL                ]   16:10 ratio, fills full width
[ STATUS PIP · STATION SIGN     ]   thin row, mono
[ TITLE                         ]   pixel
[ DESCRIPTION                   ]   sans
[ TECH CHIPS                    ]   mono row, wrap
[ LINKS                         ]   bottom row, mono
```

#### Media carousel (`PlaqueMedia.tsx`)

- Aspect ratio `16:10`, full plaque width, `overflow:hidden`.
- Background `#0a0a0a`.
- If `media[]` empty: render a striped SVG placeholder (`<pattern>` of 8px diagonal stripes `var(--accent-dim)` on `var(--bg-tertiary)`) with centered mono caption `NO MEDIA · ${project.id}`.
- If `media.length === 1`: render single media; no controls.
- If `media.length > 1`: enable carousel.

Controls (only when `> 1`):
- Bottom-center indicator strip: a row of `8px × 2px` rectangles, one per slide, gap `4px`. Active = `var(--accent-light)`, inactive = `var(--accent-dim)`. Click to jump.
- Left/right `‹ ›` mono buttons absolute mid-height, `36px` square, `var(--bg-primary)` bg, `1px solid var(--accent-dim)`. Hover: `var(--accent)` border.
- Autoplay every `5s` if user hasn't interacted in this session and `prefers-reduced-motion` is unset. Pause on hover.

Behavior:
- Images: Next `<Image>` `fill` `object-fit:cover`, `sizes="(max-width:900px) 100vw, 460px"`.
- Videos: `<video muted loop playsInline preload="metadata">`. No autoplay on phones; play on click.
- Click anywhere on media (not on arrows / indicators) opens `<ProjectLightbox>` at the current slide index.

#### Status pip + station sign row

- Flex row, gap `8px`, padding `12px 22px 0`.
- Status pip: `10px × 10px` circle, color per status (`live` green, `in-progress` amber, `shipped` orange, `archived` muted), with subtle `1.6s` pulse for `live`.
- Station sign text: mono `11px` `.2em` uppercase `var(--accent-light)` — the project's `station` string (e.g. `STOP 03 · INTERFACE LAB`).
- Right-aligned mono `10px` `var(--text-muted)`: `TRACK 0${position}`.

#### Title

- `--font-pixel` `28px` (mobile `24px`), `var(--text-primary)`, `letter-spacing:.02em`, `line-height:1.1`. Two-line max with `-webkit-line-clamp:2`.

#### Description

- System sans (Inter or platform default) `14px`, `var(--text-secondary)`, `line-height:1.6`. Three-line max via `-webkit-line-clamp:3`.

#### Tech chips

- Wrap row gap `6px`. Each chip: padding `4px 8px`, `1px solid var(--accent-dim)`, `--font-mono` `10px` `.15em` uppercase, `var(--accent-light)`. Hover: bg `var(--accent)` text `#fff`.

#### Links row

- Border-top `1px dashed var(--accent-dim)` margin-top `14px`, padding-top `12px`.
- Inline-flex links, mono `11px` `.2em` uppercase, color `var(--accent)`. Hover underline. Each label rendered as `[ LIVE ↗ ]`, `[ CODE ↗ ]`, etc. — the bracket+arrow is decorative.

### Empty / loading / error states

| State | Render |
|---|---|
| Loading (initial paint before media decode) | Striped placeholder + mono `LOADING…` |
| Image load error | Striped placeholder + mono `MEDIA UNAVAILABLE` |
| No description | Hide description row, no placeholder |
| No tech | Hide chip row |
| No links | Hide links row entirely (no border-top either) |

### Hover

The plaque itself doesn't lift — flat retro. But the frame border brightens `var(--accent) → var(--accent-light)` over `200ms`. Bolts pulse `opacity:.7 → 1`. Reduced motion: no transition.

### Mobile

- `width: calc(100% - 80px)` (margin-left `60px` to clear the line+sign).
- Media chevrons hide; user swipes (touchstart/move/end with 50px threshold).
- Tech chips wrap; max-height `60px`, then `+N` chip linking to lightbox info pane.

## `ProjectLightbox.tsx`

Fullscreen carousel for a single project's media set.

### Frame

- Backdrop `position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.96); backdrop-filter:blur(8px)`.
- Centered media area: max `90vw × 86vh`, with the same bolted-orange frame as plaques (`3px var(--accent)` outer, `4px` inset, `1px var(--accent-dim)` inner). Outer glow `box-shadow: 0 0 60px rgba(191,87,0,.3)`.
- Caption strip below frame: mono `12px` `var(--accent-light)`, project title + slide `${i+1}/${n}`.

### Media

- Same image/video rules as plaque, but `object-fit:contain`.
- Slide transition: crossfade `220ms`, NOT slide. Crisp.

### Controls

- Top-right `✕` close: `48px` square, mono `18px`, `1px solid var(--accent-dim)`, hover invert. Same bolt corner motif if desired.
- Left/right arrows: `64px` square, mono `28px`, fixed mid-height, edges of viewport (gutter `40px`). Hide if `n === 1`.
- Bottom thumbnail strip: row of `64×40` thumbnails, `2px` border (active = `var(--accent)`, inactive = `var(--accent-dim)`). Scroll horizontally if too many.
- Keyboard: `←/→` navigate, `Esc` close, `Space` toggle play if video.
- Counter: bottom-right mono `${i+1} / ${n}`.

### Info drawer (right side, optional)

A collapsible panel from the right edge containing the same project meta (title, tech, description, links). Toggle button: `INFO` button top-right next to close. Panel slides in `360px` wide, `var(--bg-secondary)` bg, padding `28px`. Uses the same typography as the plaque.

On mobile this drawer becomes a bottom sheet up to `60vh`.

### Reduced motion

- Crossfade reduced to instant.
- Drawer slide replaced by instant show/hide.

### Accessibility

- Modal a11y: `role=dialog`, `aria-modal`, focus trap, initial focus on close button.
- Each thumbnail is a button with `aria-label="View slide N: <alt>"`.
- Slide changes announced via `aria-live="polite"` on the counter.

### Edge cases

| Case | Behavior |
|---|---|
| Open with index out of range | Clamp to `[0, n-1]`. |
| Single media | Hide arrows, thumbs, counter. |
| Video that fails to load | Show striped placeholder + `VIDEO UNAVAILABLE`. |
| Network slow | Show centered mono `LOADING…` until first frame paints. |
| Closing while video playing | Pause and reset video to t=0. |
| Open from About photo strip | Same component used; pass `media: photoSet, info: undefined`. Hide info button. |
