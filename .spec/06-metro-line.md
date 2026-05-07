# 06 · The Line (Metro Projects Section)

A real-metro-feel section — a single colored line shifting through multi-curve bends with station nodes branching off to plaques. Topped by an arrivals board overlay. **No straight track. No abandoned/dead branches. No name overlap.**

## Section frame (`LineSection.tsx`)

- `<section id="projects">` `background: var(--bg-primary)`, `padding: 80px 0 100px`, `position:relative; z-index:10`.
- Max-width `1240px`, centered, horizontal padding `48px` (mobile `20px`).

### Section heading row

Three-row stack at top:
```
EYEBROW   STOPS · LINE 01 · BURNT ORANGE
H2        THE LINE.
SUB       Currently boarding 7 stops · Live arrivals updated by Rehan.
```
- Eyebrow `--font-mono 13px .25em` uppercase `var(--accent-light)`.
- H2 `--font-pixel clamp(40px,6vw,72px)` `var(--text-primary)`. Letter-spacing `.02em`.
- Sub `--font-mono 12px .15em` `var(--text-secondary)`.

Right-aligned at the same row: an "operating hours" mono ticker `OPERATING · 24/7 · DESTINATION AUSTIN`, `11px`, `var(--accent-dim)`.

## Arrivals board (`ArrivalsBoard.tsx`)

A horizontal black strip directly under the heading, full width, height `auto` (~`220px`).

- Background `#050505`, top + bottom border `1px solid var(--accent-dim)`, inner shadow `inset 0 0 60px rgba(0,0,0,.8)`.
- Padding `20px 28px`.
- Top header row inside: mono `10px` `.25em` uppercase, two columns `LINE 01 · BURNT ORANGE` (left) and `LIVE ARRIVALS` (right). A `1px var(--accent-dim)` rule below.

### Rows

A grid of 4 rows max, each row is a project sorted by `position`. Columns:
```
[ NEXT/STATUS | LINE | DESTINATION | TRACK | ETA | TECH ]
   80px        60px     1fr           60px    80px   140px
```

- `NEXT/STATUS`: a colored chip. `LIVE` = green `#39d353`, `IN-PROG` = amber `#ffb43a`, `SHIPPED` = orange `var(--accent)`, `ARCHIVE` = `var(--text-muted)`. Mono `10px` `.2em` uppercase. Padding `4px 6px`. Square corners.
- `LINE`: `01` mono `12px` `var(--accent-light)`.
- `DESTINATION`: project title, mono `14px` `var(--text-primary)`. Truncate with `...` after 1 line. **Never overlap** — use `min-width:0` + `text-overflow:ellipsis`.
- `TRACK`: position number with leading zero, mono `11px` `var(--text-secondary)`.
- `ETA`: mono `11px` `var(--accent-light)`. For LIVE: `NOW`. For others: a relative humanized like `2W` or `Q3`. Source: project record `eta` (admin-editable, optional).
- `TECH`: first 2 tech chips inline, mono `9px` `.15em` uppercase, separated by ` · `, `var(--text-secondary)`.

Row hover: background `rgba(191,87,0,.06)`, cursor pointer. Click scrolls to that station's plaque smoothly (`scroll-margin-top: 80px`).

### Split-flap effect (subtle, optional)

When a row's value changes (e.g. ETA tick), trigger a 200ms split-flap animation: char rotates `0 → 90deg` invisible mid-flip, then new char rotates `-90 → 0`. Pure CSS keyframes per character. Reduced motion: skip.

### Edge cases

- 0 projects: render a single dim row `NO ARRIVALS · CHECK BACK SOON`.
- 1 project: render that one row, plus 3 dimmed `—` placeholder rows at 30% opacity.
- > 4 projects: show first 4 in board, but the metro track below shows ALL.

## Metro track (`MetroTrack.tsx`)

A single SVG that spans the full content width, height grows with project count.

### Geometry

- For N stations, total height `H = 200 + (N - 1) * 220` px.
- Width = container width.
- The line is one `<path>` drawn as a SERIES OF BEZIER CURVES, never two parallel rails. Stroke `var(--accent)`, `stroke-width: 6`, `stroke-linecap: round`, `fill: none`.
- A second `<path>` UNDER it, same `d`, `stroke="var(--accent-glow)"`, `stroke-width:14`, `opacity:.25`, `filter: url(#blur)` — gives the line a halo.
- Track shifts: alternate the line's x-position between two columns:
  - Column A: `x = container_width * 0.32`
  - Column B: `x = container_width * 0.68`
- Stations alternate: odd index attaches to Column A side (plaque renders on the LEFT of the line at column A), even index attaches to Column B (plaque renders on the RIGHT of the line at column B). When the line transitions between columns, use a smooth S-curve cubic Bezier with control-point offsets of `±100px` vertically.

### Path generation

```ts
function buildLinePath(stations) {
  const cmds = [];
  let prev = null;
  stations.forEach((s, i) => {
    const isA = i % 2 === 0;
    const x = isA ? colA : colB;
    const y = 80 + i * 220;
    if (!prev) cmds.push(`M ${x} ${y}`);
    else {
      const cy1 = prev.y + 110;
      const cy2 = y - 110;
      cmds.push(`C ${prev.x} ${cy1}, ${x} ${cy2}, ${x} ${y}`);
    }
    prev = { x, y };
  });
  // Extend past last station to suggest continuation
  cmds.push(`L ${prev.x} ${prev.y + 60}`);
  return cmds.join(' ');
}
```

No branches. No dead stubs. The line MUST be one continuous path.

### Station nodes

At each station's `(x, y)`, render:
- Outer ring `circle r=14 fill="var(--bg-primary)" stroke="var(--accent)" stroke-width="3"`.
- Inner dot `circle r=6 fill="var(--accent-light)"`.
- Status mini-pip top-right (3px circle): green/amber/orange/dim per status.
- Station tick: small `1px var(--accent)` line `40px` perpendicular to the track in the direction of the plaque side.

### Station signage plaque (shorthand label, NOT the project plaque)

A small mono "sign" anchored ~`24px` from the node toward the plaque side. Black bg `#050505`, `1px solid var(--accent)`, `padding:4px 8px`, mono `10px` `.2em` uppercase `var(--accent-light)`. Text: project's `station` field (e.g. `01 · LIVE`). 

Two screws: `3px var(--accent-dim)` circles top-left and bottom-right.

This sign is decorative — clicks pass through to the actual plaque card.

## Project plaques placement

Plaques (`StationPlaque.tsx`, fully specced in `07-project-plaque-and-lightbox.md`) are placed inside the same SVG-relative container with absolute positioning, anchored to each station's `y` coordinate.

```
plaque.style.top = `${station.y - 90}px`;
plaque.style.left = stationIsA ? '0' : '50%';
plaque.style.right = stationIsA ? '50%' : '0';
plaque.style.marginRight = stationIsA ? '120px' : '0';
plaque.style.marginLeft  = stationIsA ? '0' : '120px';
plaque.style.maxWidth = '460px';
```

The `120px` gutter ensures plaques never collide with the line at column A/B.

## Mobile (`< 900px`)

- Line collapses to single column at `left: 32px`.
- All plaques render to the right of the line.
- Curves become small "kicks" `±30px` not `±200px`.
- Arrivals board: drop TECH column; reduce row height; reduce font scale by 1px.
- Section heading row: stack vertically; right-aligned operating ticker moves under heading.

## Reduced motion

- Disable split-flap; values change instantly.
- Disable any subtle "train glide" animation along the line (if added later).

## Edge cases

| Case | Behavior |
|---|---|
| 0 stations | Show only arrivals board placeholder + a centered mono `LINE NOT YET IN SERVICE`. Hide track. |
| 1 station | Track is a short vertical segment with one node. |
| Very long project title | Truncate plaque title to 2 lines with `line-clamp:2`; arrivals board to 1 line. |
| Missing media | Plaque shows a striped placeholder (see `07`). |
| Project with `position` collision | Sort stable by `position` then by `id`. |
| Section in viewport | Each station node fades in `0 → 1` + `scale .8 → 1` `400ms` as it enters viewport (IntersectionObserver). Skip on reduced motion. |
