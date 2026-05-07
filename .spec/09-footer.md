# 09 · Footer

Bottom of the home page. Lives in `<main className="below-train">` after `<LineSection />`.

## Frame

- `<footer>` background `var(--bg-primary)`, padding `100px 0 60px`, position relative, z-index `10`.
- Top edge: a `1px solid var(--accent-dim)` rule that fades to transparent on both ends (mask-image gradient).
- Centered content max-width `1240px`, padding `0 48px / 20px`.
- **NO orange strip** at the top edge (this was a Phase 1 mistake — explicitly remove it).

## Title bobble — `LET'S DO IT.`

Centered, dominant element.

- `--font-pixel`, `clamp(48px, 8vw, 96px)`, color `var(--accent-light)`, letter-spacing `.06em`, line-height `1`.
- `text-shadow: 0 0 24px rgba(255,140,50,.45), 0 4px 0 #6a2a00;`
- Wrap each character in a `<span>` so we can stagger the bobble.
- On hover anywhere within the title's bounding box, all characters bobble:
  - Each span: `animation: bobble 1.4s ease-in-out infinite`.
  - `@keyframes bobble { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`
  - Stagger via `style={{ animationDelay: \`${i * 60}ms\` }}`.
- On hover-out, animations stop after current cycle (use `animation-iteration-count: infinite` while a `data-hover` attribute is set; remove the attribute to stop). For simplicity, use CSS `:hover` selector on the wrapping `<button>` and reset on leave.
- Reduced motion: no bobble. Color slightly brightens `var(--accent-light) → #ffae5c` on hover instead.

Below the title:
- Small mono `11px` `.2em` uppercase `var(--text-secondary)`: `THIS IS THE PART WHERE YOU EMAIL ME.`

## Contact links row

A flexed row directly under the small mono line, gap `16px`, wrap on mobile.

Each link is a "ticket stub" button:
- Padding `12px 18px`
- `1px dashed var(--accent-dim)`
- Mono `12px` `.2em` uppercase
- Color `var(--accent)`
- Hover: bg `var(--accent)`, color `var(--bg-primary)`, border `1px solid var(--accent)`. Slight rotate `-1.5deg → 0deg`.

Links (verbatim from prototype):
```
EMAIL  → mailto:rehanmollick07@gmail.com
GITHUB → https://github.com/rehanmollick
LINKEDIN → https://www.linkedin.com/in/rehanmollick
RESUME ⇣ → /resume.pdf
TWITTER → https://x.com/rehanmollick
```

(If About config has different links, defer to it. Hardcoded list is the bootstrap.)

## "Train wall" affordance — train popup

The prototype has a small "train" button that pops a small contact text card. Replace this with a single line at the very bottom of the footer:

- Centered mono `10px` `.2em` uppercase `var(--text-muted)`: `MIND THE GAP · BETWEEN THE TRAIN AND THE PLATFORM.`
- Hover: text turns `var(--accent-light)`.
- Click: opens a small `<Modal>` (300×auto), `var(--bg-secondary)` bg, `1px solid var(--accent-dim)` border, padding `24px`, with the same contact links list as above + a one-liner `still here? get in touch.`

This replaces the broken "train wall popup" from Phase 1.

## Copyright row

Final row at the bottom edge:
- Flex space-between
- Left: mono `10px` `.15em` uppercase `var(--text-muted)`: `© ${year} MD REHAN MOLLICK · BUILT IN AUSTIN`
- Right: mono `10px` `.15em` uppercase `var(--text-muted)`: `LINE 01 · BURNT ORANGE · v2026.1`

## Mobile

- Title scales fluidly (already clamp).
- Links wrap to 2 columns at `< 480px`.
- Copyright row stacks vertically, both rows centered.

## Accessibility

- The bobble title is a `<button>` (or a heading wrapping a `<button>` if interaction needed) with `aria-label="Open contact options"` since it triggers the same modal as MIND THE GAP. Click on title also opens the contact modal.
- Focus ring: `outline: 2px solid var(--accent-light); outline-offset: 4px;`
- All links have visible text and `rel="noopener noreferrer"` for external.
