# 10 · Admin

All admin lives at `/admin/**`, gated behind NextAuth GitHub OAuth allow-listed to `ADMIN_GITHUB_LOGIN=rehanmollick`. Same retro-terminal aesthetic as the public site, but denser and more functional.

## Shell (`AdminShell.tsx`)

A two-column grid `240px 1fr` desktop / single-column mobile.

- Outer bg `var(--bg-primary)`.
- Sidebar `var(--bg-secondary)`, `1px solid #1f1f1f` right border, padding `24px 18px`. Sticky `top:0; height:100vh;`.
- Topbar inside content area: height `52px`, `1px solid #1f1f1f` bottom border, padding `0 28px`. Left: breadcrumb mono `11px` `.2em` `var(--text-secondary)` `ADMIN · ${section}`. Right: signed-in user (avatar `24px` circle from GitHub + login) and a `[ SIGN OUT ↗ ]` mono button.
- Content area padding `36px 28px 100px`.

### Sidebar

Top: mono brand `REHANMD.TECH` `12px` `.25em` `var(--accent-light)` + small `[ ADMIN ]` mono `9px` chip.

Nav items (vertical stack, gap `4px`):
```
DASHBOARD     (/admin)
PROJECTS      (/admin/projects)
DISPATCHES    (/admin/dispatches)
ABOUT         (/admin/about)
MEDIA         (/admin/media)
```
Each item: mono `12px` `.2em` uppercase, padding `10px 12px`, color `var(--text-secondary)`. Active: `var(--accent-light)` color + left border `3px solid var(--accent)`. Hover: bg `rgba(255,255,255,.03)`.

Bottom: a small `BUILD ${commitSha7}` mono `10px` `var(--text-muted)` row.

### Mobile

Sidebar collapses to a topbar drawer triggered by a hamburger button. Drawer slides in from the left.

## Dashboard (`/admin`)

Three sections:

### Stat cards row

A grid of 4 cards `1fr 1fr 1fr 1fr`, gap `16px`. Each card:
- `var(--bg-secondary)` bg, `1px solid #1f1f1f`, padding `20px 22px`.
- Eyebrow mono `10px` `.2em` `var(--text-muted)` (e.g. `LIVE PROJECTS`).
- Big number pixel `40px` `var(--accent-light)`.
- Sub mono `10px` `var(--text-secondary)` (e.g. `+2 SHIPPED THIS MONTH`).

Cards: `LIVE PROJECTS`, `DISPATCHES PUBLISHED`, `MEDIA FILES`, `LAST DEPLOY` (relative time).

### Recent activity feed

A black `var(--bg-secondary)` block, padding `20px 22px`, header pixel `18px` `RECENT ACTIVITY`. Below: a list of last 8 events (project edits, dispatch publishes, media uploads, KV writes), each row mono `12px`:
```
[2026-05-04 14:22]  COMMIT  Updated project "interface-lab"  · sha 9af2c8d
```
Status icons left: `●` colored per kind (`var(--accent)` commit, `#39d353` create, `var(--bulletin-stamp-red)` delete).

Source: a single KV list `admin:activity` capped at 100 entries, written by every mutating endpoint.

### Quick actions

A row of three large mono buttons:
```
[ + NEW PROJECT ]   [ + NEW DISPATCH ]   [ + UPLOAD MEDIA ]
```
Each `padding:18px 22px`, `1px dashed var(--accent-dim)`, mono `13px` `.2em`. Hover: solid border, bg `var(--accent)`, color `#fff`.

## Projects (`/admin/projects`)

### List page

Top row: page heading `PROJECTS` (pixel `32px`) + right-aligned `[ + NEW PROJECT ]` button (mono `12px`, `1px solid var(--accent)`, padding `10px 14px`).

Filters bar:
- Status dropdown (`ALL · LIVE · IN-PROGRESS · SHIPPED · ARCHIVED`)
- Search input mono `13px`

Table:
| TRACK | TITLE | STATUS | ETA | LAST EDIT | ACTIONS |
| 60px | 1fr | 100px | 80px | 140px | 120px |

Row styles: alternating `var(--bg-secondary)` and `transparent`. Border between rows `1px solid #1f1f1f`. Padding `12px 16px`. Mono `13px`.

Status pip: same colored pip used in arrivals board.

ACTIONS: `[ EDIT ]` link + `[ DELETE ]` button (mono `10px`). Delete prompts a confirm modal.

Drag handle in TRACK column to reorder; on drop, `PATCH /api/projects/reorder` body `{ ids:[...] }`.

Empty state: striped placeholder + `NO PROJECTS YET · CREATE THE FIRST STOP` and a CTA button.

### Project edit form (`/admin/projects/[id]`)

Two-column grid `1fr 360px`, gap `36px`. Left column: form fields. Right column: live preview of `<StationPlaque>` re-rendered as fields change (debounced `200ms`).

Form fields (each row: label + input, label `mono 10px .2em uppercase var(--text-muted)`):

- Title (text input)
- Slug / id (text input, auto-suggested from title, editable)
- Status (radio: live · in-progress · shipped · archived) — segmented control
- Position (number input, min 1) + helper text `Where on the line. 1 = first stop.`
- Station label (text input, default `STOP ${pos} · ${UPPER(title)}`)
- ETA (text input, optional, e.g. `NOW`, `2W`, `Q3`)
- Description (textarea, 3 rows max-length 280, char counter)
- Tech (multi-tag input — comma or enter to add — max 8 chips)
- Links (repeatable rows, each: label + URL, with up/down/delete)
- Media (repeatable rows, each: a media picker that opens the Media Library modal, choose existing Blob asset OR upload new; per-item `alt` and `kind:image|video`)

Sticky save bar at the bottom of the form column:
- `[ CANCEL ]` ghost button
- `[ SAVE & COMMIT ]` primary mono button. Shows spinner + `COMMITTING…` while POST runs. Toast on success: `Committed 9af2c8d · /` (link to GitHub commit).

Validation: zod schema mirroring `ProjectRecord`. Inline errors mono `10px` red `#ff6b6b`.

Unsaved-changes guard: if dirty, intercept route changes with a confirm dialog.

### Inputs styling

- Bg `#0c0c0c`
- Border `1px solid #2a2a2a`, focus `var(--accent)`, error `#ff6b6b`
- Padding `10px 12px`
- Font `--font-mono 13px` for body text inputs and `Inter 14px` for description textarea (longer prose)
- Color `var(--text-primary)`, placeholder `var(--text-muted)`

## Dispatches (`/admin/dispatches`)

### List page

Same shell as projects.

Table columns:
| DATE | TITLE | TAGS | PINNED | STATUS | ACTIONS |
| 110px | 1fr | 200px | 80px | 100px | 140px |

`STATUS` is `DRAFT` (gray) or `PUBLISHED` (green). Drafts live in KV at `dispatch:draft:<slug>` until published.

Top row buttons: `[ + NEW DISPATCH ]` and `[ ⚡ BRAIN-DUMP COMPOSE ]` (links to `/admin/dispatches/new`).

### Dispatch form (`/admin/dispatches/[slug]/edit`)

Layout same as project form (two-column with live preview of `<NewspaperReader>` shrunk to `360px`).

Fields:
- Title
- Slug (auto + editable)
- Date (date picker)
- Excerpt (textarea, max 240 chars)
- Tags (tag input)
- Pinned (toggle)
- Hero image (media picker)
- Body MDX (the editor: a textarea with mono `13px`, line numbers gutter, soft-wrap. NO rich text editor — Rehan writes MDX raw.)

Save bar same as projects.

### Brain-dump composer (`/admin/dispatches/new`)

This is the Phase 1 component, which is well-loved. Restyle to match the shell but **preserve** the API at `/api/dispatches/compose`.

Layout: two stacked panes vertically.

**Pane 1 — Brain dump.** A big black textarea, mono `14px`, `var(--text-primary)`, padding `20px`, height `min(40vh, 360px)`, placeholder:
```
Dump everything you remember about the thing you want to write. Bullet points, half-sentences, links — whatever. Claude will turn it into a draft.
```

Vibe selector: segmented control above textarea — `CASUAL · TECHNICAL · REFLECTIVE`.

`[ ⚡ COMPOSE DRAFT ]` mono button — disabled until textarea has > 30 chars.

**Pane 2 — Draft.** A live-streamed MDX preview. Two tabs: `RAW MDX` (textarea editor) and `PREVIEW` (rendered NewspaperReader at small scale).

Bottom action bar:
- `[ REGENERATE ]` re-runs compose with same input
- `[ SAVE AS DRAFT ]` writes to KV `dispatch:draft:<slug>`
- `[ PUBLISH NOW ]` commits MDX via GitHub API; on success toast + redirect to `/admin/dispatches`.

Streaming: as tokens arrive from `/api/dispatches/compose` SSE, append to textarea content. Allow user to interrupt (`[ STOP ]` button replaces compose during stream).

Error states:
- `AI_ERROR`: red banner `Both Anthropic and Groq failed. Try again or write the draft yourself.`
- Rate-limited: orange banner `Hit 30 calls / 10 min limit. Cool down and retry.`

## About (`/admin/about`)

Single-column form, max-width `720px`.

Fields:
- Bio (textarea 4 rows)
- Tagline (text)
- Hometown (city + lat/lng inputs; small inline map preview using BulletinWorldMap with just the one pin)
- Pins (repeatable: city, year, kind dropdown, lat/lng). A "Geocode" button calls a lightweight nominatim wrapper at `/api/geocode?q=` to suggest lat/lng from a city name.
- Photos (repeatable: media picker + caption text)
- Facts (repeatable: label + value, drag-reorder)
- Links (repeatable: label + URL)
- Now Playing override (optional; leave blank to use Spotify integration if creds set)

Save bar: `[ SAVE TO KV ]` button — calls `PUT /api/about`. Toast confirms; revalidates `about` tag.

Inline preview pane (right rail desktop, accordion mobile): renders a scaled `<AboutBulletinModal>` to `360px` width.

## Media (`/admin/media`)

### Library

Top: `[ ⇡ UPLOAD ]` button + filter chips by kind (`ALL · IMAGE · VIDEO`).

Grid: responsive `repeat(auto-fill, minmax(180px, 1fr))`, gap `12px`. Each tile:
- Thumbnail `aspect-ratio: 4/3`, `1px solid #1f1f1f`.
- Footer strip: filename mono `10px`, size mono `9px var(--text-muted)`.
- Hover overlay: `[ COPY URL ]` `[ DELETE ]` mono buttons.

Empty: striped placeholder + `MEDIA LIBRARY IS EMPTY · UPLOAD YOUR FIRST FILE`.

### Uploader

Modal opens on `[ ⇡ UPLOAD ]`. Drop zone:
- Dashed border `2px dashed var(--accent-dim)`, padding `60px`, mono `13px` `.2em` `DROP IMAGES OR VIDEOS HERE · OR CLICK TO BROWSE`.
- Accepts `image/*, video/mp4`. Max `10MB`. Multiple allowed.
- Per-file row appears as upload progresses: filename, progress bar, status (pending → uploading → done / failed).
- On done: `URL COPIED` toast, file appears in library.

Upload endpoint: `POST /api/media` multipart. Server-side validates type and size, calls `@vercel/blob put()` with `addRandomSuffix:true`, returns `{pathname, url}`. Activity entry written.

## Toasts

Bottom-right stack, max 3 visible. Each toast:
- `var(--bg-secondary)` bg, `1px solid var(--accent)` left border `3px`, padding `12px 16px 12px 18px`, mono `12px`.
- Auto-dismiss after `4s`. Hover pauses dismiss timer.
- Variants: success (border `var(--accent)`), error (`#ff6b6b`), info (`var(--text-secondary)`).

## Confirm dialogs

Centered modal, `400px` wide, `var(--bg-secondary)` bg, `1px solid var(--accent)` border, padding `24px`. Title pixel `18px`. Body mono `13px`. Buttons: `[ CANCEL ]` ghost + `[ CONFIRM ]` (red `#ff6b6b` for destructive).

## Empty / error / loading

- Each list page has skeleton rows during fetch — striped bg shimmer.
- API errors render an inline banner above the page content: red border, mono `12px`, `[ RETRY ]` button.
- Forbidden (non-allowlist GitHub login): full-page card centered, `ACCESS DENIED · ${login} IS NOT THE OWNER. SIGN OUT AND TRY ANOTHER ACCOUNT.` with `[ SIGN OUT ]` button.
