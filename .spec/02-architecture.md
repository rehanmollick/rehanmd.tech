# 02 · Architecture

## Final `src/` file tree

```
src/
├── middleware.ts                            # NextAuth route gate for /admin/**
├── app/
│   ├── layout.tsx                           # next/font loaders, providers, base globals
│   ├── globals.css                          # tokens from 01-design-system.md
│   ├── page.tsx                             # Home: train scene + envelope + Dispatches + The Line + Footer
│   ├── blog/
│   │   ├── page.tsx                         # Newsstand wall (paginated + pannable)
│   │   └── [slug]/page.tsx                  # NewspaperReader for one MDX dispatch
│   ├── admin/
│   │   ├── layout.tsx                       # Admin shell (sidebar + content)
│   │   ├── page.tsx                         # Dashboard (stat cards + recent activity)
│   │   ├── projects/
│   │   │   ├── page.tsx                     # Project list
│   │   │   └── [id]/page.tsx                # Project edit form (id="new" for create)
│   │   ├── dispatches/
│   │   │   ├── page.tsx                     # Dispatch list
│   │   │   └── new/page.tsx                 # Brain-dump composer (Phase 1 — keep, restyle)
│   │   ├── about/page.tsx                   # About config (now-playing, photo strip, pins)
│   │   └── media/page.tsx                   # Media library + uploader
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts      # NextAuth GitHub provider
│   │   ├── projects/
│   │   │   ├── route.ts                     # GET list, POST create -> commits projects.ts
│   │   │   └── [id]/route.ts                # GET / PUT / DELETE
│   │   ├── dispatches/
│   │   │   ├── route.ts                     # GET list, POST create -> commits MDX
│   │   │   ├── [slug]/route.ts              # GET / PUT / DELETE
│   │   │   └── compose/route.ts             # Brain-dump LLM composer (already exists Phase 1)
│   │   ├── about/route.ts                   # GET (public) / PUT (admin) -> KV
│   │   ├── now-playing/route.ts             # GET / PUT -> KV
│   │   └── media/
│   │       ├── route.ts                     # GET list -> Blob, POST upload -> Blob
│   │       └── [pathname]/route.ts          # DELETE
├── components/
│   ├── three/                               # KEEP existing R3F train scene as-is
│   │   ├── SubwayScene.tsx                  # mount point edits only (envelope anchor)
│   │   ├── TrainInterior.tsx
│   │   ├── TunnelEnvironment.tsx
│   │   ├── TunnelLights.tsx
│   │   ├── PostFX.tsx
│   │   └── TickerLED.tsx
│   ├── envelope/
│   │   ├── EnvelopePoster.tsx               # HTML overlay; routes to first-visit anim or pull-tab
│   │   ├── SealedEnvelope.tsx               # First-visit: flap unfolds + letter slides
│   │   └── PullTabPoster.tsx                # Subsequent visits: flat poster
│   ├── about/
│   │   ├── AboutBulletinModal.tsx           # Modal wrapper (Framer Motion)
│   │   ├── BulletinHeader.tsx
│   │   ├── BulletinFacts.tsx
│   │   ├── BulletinWorldMap.tsx             # SVG d3-geo + pins + dashed rope
│   │   ├── BulletinPhotoStrip.tsx           # 4-up photo grid w/ captions
│   │   ├── BulletinNowPlaying.tsx           # Real-time spotify or KV-backed
│   │   └── BulletinAskClaude.tsx            # window.claude.complete bound to facts
│   ├── dispatches/
│   │   ├── DispatchesSection.tsx            # Homepage strip with 3 latest + "see all"
│   │   ├── DispatchCard.tsx
│   │   ├── NewsstandWall.tsx                # /blog: pannable + paginated cork wall
│   │   └── NewspaperReader.tsx              # /blog/[slug]
│   ├── line/
│   │   ├── LineSection.tsx                  # Section frame + arrivals board + track
│   │   ├── ArrivalsBoard.tsx                # Top header w/ split-flap rows
│   │   ├── MetroTrack.tsx                   # SVG curved line + station nodes
│   │   ├── StationPlaque.tsx                # Bolted plaque w/ media carousel + meta
│   │   └── ProjectLightbox.tsx              # Fullscreen carousel
│   ├── footer/
│   │   └── Footer.tsx                       # "LET'S DO IT" bobble + contact links
│   ├── nav/
│   │   ├── TopNav.tsx                       # Sticky tape-strip nav
│   │   └── MobileSheet.tsx
│   ├── admin/
│   │   ├── AdminShell.tsx                   # Sidebar + topbar + content
│   │   ├── AdminSidebar.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── DispatchForm.tsx
│   │   ├── DispatchComposer.tsx             # Brain-dump → drafts → publish (Phase 1; restyle)
│   │   ├── AboutConfigForm.tsx
│   │   ├── MediaLibrary.tsx
│   │   ├── MediaUploader.tsx
│   │   └── ui/                              # AdminButton, AdminInput, AdminSwitch, AdminCard
│   └── ui/
│       ├── Marquee.tsx
│       ├── Modal.tsx                        # Backdrop + Portal + Esc/click-outside close
│       ├── Toast.tsx
│       └── ScrollCue.tsx
├── content/
│   └── blog/
│       └── *.mdx                            # GitHub-committed dispatches
├── data/
│   └── projects.ts                          # GitHub-committed projects array
├── lib/
│   ├── auth.ts                              # NextAuth config (GitHub provider, allowlist)
│   ├── kv.ts                                # @vercel/kv wrapper w/ typed namespaces
│   ├── blob.ts                              # @vercel/blob wrapper (put/list/del)
│   ├── github.ts                            # Octokit Contents API (read+commit MDX & TS)
│   ├── ai.ts                                # Anthropic primary + Groq fallback
│   ├── about.ts                             # Read/write About config to KV
│   ├── projects.ts                          # Read projects.ts via dynamic import + cache
│   ├── dispatches.ts                        # Read MDX list + frontmatter
│   ├── mdx.ts                               # MDX serialization for reader
│   └── revalidate.ts                        # On-demand ISR triggers
└── styles/
    └── (none — tokens live in globals.css)
```

## Data flow

| Concern | Source of truth | Read path | Write path |
|---|---|---|---|
| Projects list | `src/data/projects.ts` (committed) | static import in server component → cached `unstable_cache` 60s | Admin form → `/api/projects` → `lib/github.ts` PUT Contents API → revalidate `/`, `/blog` |
| Dispatch posts | `src/content/blog/*.mdx` (committed) | `lib/dispatches.ts` reads frontmatter at build (or RSC) | Admin composer → `/api/dispatches` → commit MDX → revalidate `/blog`, `/blog/[slug]` |
| About config (bio, pins, photo URLs, captions, hometown) | Vercel KV `about:config` (JSON) | `/api/about` GET (public) | `/api/about` PUT (admin) |
| Now playing | Vercel KV `about:now-playing` (manual) OR `/api/now-playing` proxy to Spotify if creds set | KV first, Spotify if `SPOTIFY_REFRESH_TOKEN` set | Admin form PUT KV |
| Image uploads | Vercel Blob | Public URLs returned at upload time, stored in projects/dispatches/about | Admin uploader |
| Auth | NextAuth GitHub provider, allow-list `ADMIN_GITHUB_LOGIN` | `getServerSession()` in server actions / API routes | OAuth callback |

### Revalidation

- After project commit: `revalidatePath('/'); revalidateTag('projects')`
- After dispatch commit: `revalidatePath('/blog'); revalidatePath('/blog/[slug]', 'page'); revalidateTag('dispatches')`
- About KV write: `revalidateTag('about')`. About modal data is fetched at section render time with `next: { tags:['about'], revalidate: 60 }`.

## Auth boundary

`src/middleware.ts` runs on `matcher: ['/admin/:path*', '/api/((?!auth).)*']`. Logic:

1. If route starts with `/admin` and no NextAuth session → redirect to `/api/auth/signin?callbackUrl=...`.
2. If route is a protected `/api/*` (anything except `/api/auth/*`, `/api/about` GET, `/api/now-playing` GET, `/api/dispatches` GET, `/api/projects` GET) and no session → 401.
3. If session present but `session.user.login !== process.env.ADMIN_GITHUB_LOGIN` → 403.

Never trust client claims; always re-check `getServerSession(authOptions)` inside any mutating route handler.

## API contracts

All endpoints return JSON. All errors:
```json
{ "error": "string", "code": "INVALID_INPUT" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "GITHUB_ERROR" | "AI_ERROR" | "INTERNAL", "details"?: any }
```
Status codes: 400 / 401 / 403 / 404 / 409 / 502 / 500 respectively.

### `GET /api/projects`
**Resp 200**:
```json
{ "projects": [ProjectRecord, ...] }
```
`ProjectRecord`:
```ts
{
  id: string,           // slug, kebab-case
  title: string,
  status: "live" | "in-progress" | "shipped" | "archived",
  station: string,      // station label e.g. "01 · LIVE"
  position: number,     // line ordering (1..n)
  description: string,  // 1–2 sentence plaque description
  tech: string[],       // chip labels
  links: { label: string, href: string }[],
  media: { src: string, kind: "image" | "video", alt: string }[]
}
```

### `POST /api/projects` (admin)
**Body**: `Omit<ProjectRecord, 'id'> & { id?: string }` — id auto-derived from `slugify(title)` if missing.
**Resp 201**: `{ project: ProjectRecord, commitSha: string }`
**Side effect**: `lib/github.ts.commitProjects(projects)` rewrites `src/data/projects.ts` and pushes one commit `feat(projects): add "<title>"`.

### `PUT /api/projects/[id]` (admin)
**Body**: partial `ProjectRecord`
**Resp 200**: `{ project, commitSha }`
**409** if `id` collision on rename.

### `DELETE /api/projects/[id]` (admin)
**Resp 200**: `{ deletedId: string, commitSha: string }`

### `GET /api/dispatches`
**Resp 200**:
```json
{ "dispatches": [DispatchSummary, ...] }
```
```ts
{
  slug: string,
  title: string,
  date: string,        // ISO
  excerpt: string,
  hero?: string,       // image URL
  tags: string[],
  pinned: boolean,
  thumbColor?: "amber" | "red" | "blue" | "green"   // thumbtack color on Newsstand
}
```

### `POST /api/dispatches` (admin)
**Body**:
```json
{ "title": "string", "date": "ISO", "excerpt": "string", "hero": "string?", "tags": ["string"], "pinned": false, "body": "MDX string" }
```
**Resp 201**: `{ slug, commitSha }`. Slug derived from title. Body becomes `src/content/blog/<slug>.mdx` with frontmatter.

### `GET /api/dispatches/[slug]`
**Resp 200**: `{ dispatch: { ...DispatchSummary, body: string } }`

### `PUT /api/dispatches/[slug]` (admin) — same body as POST minus optional id
### `DELETE /api/dispatches/[slug]` (admin) — `{ deletedSlug, commitSha }`

### `POST /api/dispatches/compose` (admin) — **Phase 1 already implemented; preserve**
**Body**: `{ braindump: string, vibe?: "casual" | "technical" | "reflective" }`
**Resp 200 (streaming)**: server-sent events `data: { delta: string }`, terminator `data: [DONE]`.
Provider: Anthropic `claude-haiku-4-5` first; on rate-limit / 5xx fall through to Groq `llama-3.1-70b-versatile`. System prompt in `lib/ai.ts` constant `DISPATCH_COMPOSER_SYSTEM` — see Phase 1 file; do not change.

### `GET /api/about` (public)
**Resp 200**:
```json
{
  "bio": "string", "tagline": "string",
  "facts": [{ "label": "string", "value": "string" }],
  "hometown": { "name": "string", "lat": number, "lng": number },
  "pins": [{ "city": "string", "lat": number, "lng": number, "year": number, "kind": "lived"|"visited"|"family"|"school" }],
  "photos": [{ "src": "string", "caption": "string" }],
  "links": [{ "label": "string", "href": "string" }]
}
```

### `PUT /api/about` (admin) — same body, validates with zod, writes to KV `about:config`.

### `GET /api/now-playing` — `{ track: string, artist: string, album: string, isPlaying: boolean, art?: string }` — never throws, returns `isPlaying:false` on any failure.

### `GET /api/media` (admin)
**Resp 200**: `{ items: [{ pathname, url, size, uploadedAt, contentType }] }` — proxies `@vercel/blob` `list()`.

### `POST /api/media` (admin)
multipart/form-data field `file` (max 10MB, image/* or video/mp4 only). Returns `{ pathname, url }`.

### `DELETE /api/media/[pathname]` (admin) — `{ deletedPathname }`.

## AI wiring (`lib/ai.ts`)

```ts
export async function callLLM({ system, messages, stream }: LLMArgs): Promise<ReadableStream | string>
```

Order of attempts:
1. Anthropic `claude-haiku-4-5` via `@anthropic-ai/sdk` server-side, key `ANTHROPIC_API_KEY`. Stream when `stream:true`.
2. On HTTP 429 or 5xx, retry once after `2000ms` jittered.
3. On second failure → fallback to Groq `llama-3.1-70b-versatile` via `groq-sdk`, key `GROQ_API_KEY`. Same shape.
4. On both failures → throw `{ code:'AI_ERROR' }`.

Constants in `lib/ai.ts`:
- `DISPATCH_COMPOSER_SYSTEM` — preserved from Phase 1; instructs the model to emit a draft MDX dispatch with frontmatter, headline, dek, 3-paragraph body, suggested tags. **DO NOT alter the prompt body** beyond minor refactors needed for typing.
- `ABOUT_ASK_SYSTEM` — new. Receives `aboutFacts` JSON in system, answers user questions in 1–3 sentences in first person as Rehan, never inventing facts.

Rate limit: per user (NextAuth session id), 30 LLM calls / 10 min, enforced via Vercel KV bucket `rate:llm:<userId>`.

## How admin writes propagate to live site

1. Admin saves a project → `/api/projects` validates and calls `commitProjects()` in `lib/github.ts` which:
   - Reads `src/data/projects.ts` from `main` (Octokit `repos.getContent`).
   - Splices in / removes / updates the record.
   - Re-serializes the file with `prettier.format(...)`.
   - Commits via `repos.createOrUpdateFileContents`.
2. Vercel webhook fires → new deploy.
3. ALSO call `revalidatePath('/')` immediately so users on existing pages get fresh data within `revalidate:60` of the section.

For dispatches the same flow applies but writes to `src/content/blog/<slug>.mdx`.

For About config, no commit — just KV write + `revalidateTag('about')`.

## Environment variables

```
NEXTAUTH_URL
NEXTAUTH_SECRET
GITHUB_ID
GITHUB_SECRET
ADMIN_GITHUB_LOGIN=rehanmollick

ANTHROPIC_API_KEY
GROQ_API_KEY

KV_URL
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN

BLOB_READ_WRITE_TOKEN

GH_REPO_OWNER=rehanmollick
GH_REPO_NAME=rehanmd.tech
GH_BRANCH=main
GH_BOT_TOKEN              # PAT with repo scope used by lib/github.ts

# Optional
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REFRESH_TOKEN
```

## Caching

- `unstable_cache` keys: `projects:list` (tag `projects`, ttl 60), `dispatches:list` (tag `dispatches`, ttl 60), `about:config` (tag `about`, ttl 60).
- Static assets in `public/` use Next default immutable headers.
- Lightbox images use Next `<Image fill>` with `priority={false}` and `sizes` per breakpoint.
