# CLAUDE.md - rehanmd.tech Portfolio

## Project Overview & Current State

Personal portfolio for Md Rehan Mollick (rehanmd.tech). An immersive, 3D-heavy, dark-themed, underground metro-inspired tech portfolio.

**WHAT ALREADY EXISTS (DO NOT REBUILD THESE):**
- Next.js 15 project with TypeScript and Tailwind v4 is fully set up and running
- Root layout (`src/app/layout.tsx`) with Space Mono, Inter, JetBrains Mono fonts loaded
- Floating nav component (`src/components/layout/Nav.tsx`) with links to About, Projects, Contact, Blog
- Global CSS (`src/styles/globals.css`) with dark theme variables, scrollbar, glassmorphism styles
- Tailwind config with custom burnt orange color system
- **The 3D train scene (Phase 2) is COMPLETE and working.** It includes:
  - Procedural subway car interior with seats, poles, grab bars, windows, doors, ceiling panels
  - LED ticker/marquee scrolling "Your Destination: Awaits... Time Until Destination: Unknown... Enjoy Your Journey"
  - Interactive poster on the train wall (click to expand) showing name, GitHub, LinkedIn, UT Email, Gmail
  - Tunnel environment with scrolling orange lights
  - Post-processing: Bloom, Vignette, Film Grain, Depth of Field, Chromatic Aberration
  - CameraShake for train rumble
  - Fog and atmospheric dust particles
  - SceneLoader with Suspense
- Project data file (`src/data/projects.ts`) with 7 projects pre-populated
- MDX blog utilities (`src/lib/mdx.ts`)
- Starter blog post (`src/content/blog/hello-world.mdx`)
- Sub-agents defined in `.claude/agents/`

**WHAT NEEDS TO BE BUILT (this document defines it):**
1. Scroll behavior: train scene stays fixed, content scrolls over it
2. About Me section — overlays ON TOP of the still-visible train scene as a pixel-art/retro-game styled card. Train keeps animating behind it.
3. Fade-to-black transition — gradient that "leaves the train behind" as user scrolls past About Me
4. Blog section — new dark area with procedural 3D metro station wall, blog posts as posters
5. Projects section — metro line map style timeline with station nodes
6. Contact footer

---

## Git Configuration

Commit after EVERY SINGLE FILE you create or every meaningful change. I want a very granular commit history — 50+ commits minimum for this build. Each component, each visual tweak, each section gets its own commit.

ALL commits MUST be attributed to:
- Name: `rehanmollick`
- Email: `rehanmollick07@gmail.com`

Before any commit, verify with: `git config user.name && git config user.email`

Conventional commit messages:
- `feat: add metro line map timeline component`
- `style: adjust about section fade-in timing`
- `content: add blog wall poster layout`
- `fix: resolve scroll overlap with train canvas`

NEVER let "Claude Code" or "Anthropic" or "AI" appear in any commit message or author field.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15+ | SSR, routing, MDX blog |
| Language | TypeScript | 5.x | Type safety everywhere |
| 3D Engine | React Three Fiber | 9.x | Declarative Three.js |
| 3D Helpers | @react-three/drei | latest | Camera, controls, effects |
| 3D Post-FX | @react-three/postprocessing | latest | Bloom, vignette, grain |
| Animation | Framer Motion | 11+ | Scroll animations, transitions |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Blog | MDX (next-mdx-remote) | latest | Markdown + JSX blog posts |
| Analytics | Vercel Analytics | latest | Privacy-friendly analytics |
| Hosting | Vercel | - | Auto-deploy from GitHub |

---

## MCP Server Usage

### Context7 MCP
- ALWAYS query Context7 before writing R3F, drei, postprocessing, Next.js, Framer Motion, or Tailwind code
- This prevents hallucinating deprecated APIs. R3F v9 has breaking changes from v8.

### Puppeteer MCP
- Use to visually verify sections render correctly
- Screenshot after major visual changes
- Test scroll behavior and responsive breakpoints

---

## Design System

### Colors
```
bg-primary:    #0a0a0a     // Main background, the "darkness" between sections
bg-secondary:  #111111     // Cards, elevated surfaces
bg-tertiary:   #1a1a1a     // Subtle elevation

accent:        #BF5700     // UT burnt orange (primary accent everywhere)
accent-light:  #E87A2E     // Hover/glow state
accent-dim:    #8B3F00     // Muted accent
accent-glow:   #FF6B1A     // Neon glow (bloom effects, active nodes)

text-primary:  #f5f5f5     // Main text
text-secondary:#a1a1a1     // Subdued text
text-muted:    #666666     // Very subdued

tunnel-light:  #FFB366     // Warm tunnel light color
tunnel-fog:    #0d0d0d     // Fog color
```

### Typography
- Display/Headings: `Space Mono` (monospace, techy)
- Body: `Inter`
- Code: `JetBrains Mono`
- All via next/font/google

### Animation Standards
- Scroll reveals: Framer Motion `useInView` with fade-up (y: 20→0, opacity 0→1)
- Duration: 0.6s default, 0.3s micro-interactions
- Easing: [0.25, 0.46, 0.45, 0.94]
- 3D scenes: 60fps target, all animation in `useFrame`
- Respect `prefers-reduced-motion`

---

## THE SCROLL ARCHITECTURE (Critical — Read Carefully)

The entire site is ONE continuous scroll page. The structure from top to bottom:

```
┌─────────────────────────────────────────┐
│  TRAIN SCENE (position: fixed)          │  ← Stays pinned at top, NEVER moves
│  Full viewport, z-index: 0              │  ← Always behind everything
│  The existing 3D train scene            │
│  With poster, LED ticker, everything    │
└─────────────────────────────────────────┘
          ↓ user scrolls ↓
┌─────────────────────────────────────────┐
│  SCROLL CONTENT (position: relative)    │  ← This scrolls OVER the train
│  z-index: 10                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  SPACER (100vh, transparent)    │    │  ← First screen: user sees full train scene
│  │  (no background)                │    │     through this transparent section
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ABOUT ME OVERLAY               │    │  ← STILL TRANSPARENT BACKGROUND
│  │  (bg: transparent)              │    │     Train scene is STILL VISIBLE behind this
│  │  (~80-100vh tall)               │    │     About Me content floats on a stylized
│  │                                 │    │     pixel-art / retro-game card ON TOP of
│  │  ┌───────────────────────┐      │    │     the train. The card is semi-opaque with
│  │  │  RETRO/PIXEL CARD     │      │    │     a video-gamey, pixelated border style.
│  │  │  About Me text inside │      │    │     The train keeps animating behind it.
│  │  └───────────────────────┘      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  FADE-TO-BLACK GRADIENT         │    │  ← Gradient from transparent → #0a0a0a
│  │  (about 30-50vh tall)           │    │     This is where the train scene finally
│  │                                 │    │     disappears. User is "leaving the train."
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  BLOG SECTION                   │    │  ← bg: #0a0a0a (fully opaque, train hidden)
│  │  Procedural 3D metro wall scene │    │     Its own R3F Canvas
│  │  (~80-100vh)                    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  PROJECTS SECTION               │    │  ← bg: #0a0a0a
│  │  Metro line map timeline        │    │     SVG/HTML metro map
│  │  (variable height, tall)        │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  CONTACT FOOTER                 │    │  ← bg: #0a0a0a
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation:
1. The existing train scene Canvas gets `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;`
2. A scroll container div wraps ALL content sections with `position: relative; z-index: 10;`
3. First child of scroll container is a transparent spacer div (100vh, `background: transparent`) — user sees the full train scene through this. This is the initial landing view.
4. Second child is the About Me section — ALSO with `background: transparent` so the train scene is STILL VISIBLE behind it. The About Me content itself sits inside a stylized card that floats over the train. More detail in the About Me section spec below.
5. Below About Me is a gradient div (30-50vh) that transitions from `transparent` to `#0a0a0a`. This is the "leaving the train" moment. The train fades away behind the darkness.
6. Below the gradient, ALL sections have `background: #0a0a0a` (fully opaque). The train is completely hidden.
7. The nav bar stays `position: fixed; z-index: 50;` so it's always visible above everything.

---

## SECTION 1: ABOUT ME (Overlays on Train Scene)

### Scroll position: Directly after the 100vh spacer
### Background: TRANSPARENT — the train scene is still fully visible behind this section
### Height: ~80-100vh

This section does NOT have its own background. The 3D train scene is still running and visible behind it. The About Me content floats ON TOP of the train in a stylized card.

### The Card — Pixel Art / Retro Game Style:

The About Me text sits inside a card that looks like it belongs in a retro video game UI or a pixel-art RPG dialog box. Think: the kind of textbox you'd see in an indie game, or a hacker terminal window, but with personality.

**Card visual spec:**
- Background: `rgba(10, 10, 10, 0.85)` — dark, very slightly transparent so a hint of the train bleeds through
- Border: A pixelated/stepped border style. This can be achieved with:
  - CSS `border-image` using a pixel-art 9-slice border image
  - OR a CSS-only stepped/blocky border using `box-shadow` stacking (multiple inset shadows at 1-2px offsets to create a pixel-grid edge)
  - OR a `clip-path` with intentionally jagged/stepped edges
  - The border color should be burnt orange (#BF5700) or a slightly glowing variant
- Size: `max-width: 700px`, centered horizontally, centered vertically in the section (or offset slightly toward the left/bottom third — wherever looks best with the train behind it)
- Padding: generous, at least `p-8` to `p-12`
- The card should have a subtle pixel-art corner decoration or a small icon in the corner (like a terminal cursor blinking, or a small pixel train icon)
- Optional: a thin scanline effect overlay on the card (horizontal lines at 2px intervals, very low opacity) for CRT/retro feel

**Card header:**
- "About" or "> ABOUT_ME" in Space Mono, burnt orange, slightly larger font
- Could look like a terminal prompt: `rehan@metro:~$ cat about.txt`

**Card body text:**
- 3-4 paragraphs of placeholder text in `text-primary` (#f5f5f5), Inter font
- Placeholder content (Rehan will replace):
  > "I'm a computer science student at UT Austin who builds things because I can't sit still. Hackathons, startups, side projects at 2am — if there's a problem and a keyboard nearby, I'm probably already working on it."
  > "I think the best way to learn is to ship. Every project I build teaches me something the classroom can't. Right now I'm deep into full-stack web dev, blockchain, and AI tooling."
  > "When I'm not coding, I'm probably climbing, swimming, or figuring out how to optimize something that doesn't need optimizing."
- Text should appear with a typewriter effect OR a line-by-line fade-in as the card scrolls into view

**Card entrance animation:**
- The card fades in + scales up slightly (0.95 → 1.0) as user scrolls into this section
- Use Framer Motion `useScroll` + `useTransform` for scroll-linked opacity and scale
- The card should feel like it "materializes" over the train scene

**Important:** The train scene keeps running behind this section. The camera still shakes, lights still pass by, particles still float. The About card is just floating on top of it. This creates a layered, immersive feel — you're reading about Rehan while still "on the train."

---

## SECTION 2: BLOG SECTION (Procedural 3D Metro Station Wall)

### Location in scroll: Below About Me
### Height: ~80-100vh

This is a SECOND R3F Canvas (separate from the train scene). It renders a procedural 3D scene of a metro station wall.

### The Scene — Metro Station Wall POV:

Imagine you've stepped off the train and you're standing on the platform, looking at the station wall. Here's exactly what the viewer sees:

**THE WALL:**
- A flat wall made of white/off-white ceramic tiles (like a real NYC/London/Paris metro station)
- The tiles are slightly uneven, some cracked, with dark grout lines between them
- Use a procedural grid pattern for the tiles: small rectangular tiles (~0.15 x 0.08 units each), laid in a brick-like offset pattern
- Material: `MeshStandardMaterial` with high roughness (0.9), low metalness (0.05), off-white color (#e8e4de)
- Add subtle normal map or bump map for tile texture (can be procedural using noise)

**LIGHTING:**
- Very dim. This is an underground station at night or off-hours
- One or two warm point lights from above (simulating old station lights), casting pools of light on the wall
- The edges of the scene fade into deep shadow/darkness
- The light has a slight warm orange tint (not burnt orange, more like old incandescent: #FFD4A0)
- Slight bloom on the light sources
- Vignette effect (heavy, dark edges)
- Film grain

**THE POSTERS:**
Each blog post is represented as a poster on the wall. Posters are rectangular planes mounted on the tile wall with slight depth (extruded frame).

For now there is ONE poster (more will be added as blog posts are written):

**Poster 1 (right side of the wall):**
- Title: "Building rehanmd.tech"
- Subtitle/date: "March 2026"
- Brief visible text on the poster itself (like a real transit ad): "The making of this portfolio. Expanding horizons, increasing surface area for luck, and making the right connections at the right stops."
- The poster has a dark background (#111111) with burnt orange accent border/trim
- White text in Space Mono font
- Rendered as a canvas texture mapped onto a plane geometry
- When hovered: slight glow effect, cursor changes
- When clicked: expands into a full-screen overlay (or navigates to /blog/building-rehanmd-tech) showing the full blog post content
- The poster should look slightly weathered — maybe a subtle paper texture or slight corner peel effect

**Additional atmospheric details:**
- A faint "EXIT →" sign in the upper right, dimly lit in red/orange
- Maybe a subtle metro line diagram on the far left of the wall (small, decorative, not interactive)
- Dust particles floating in the light beams
- Slight fog/haze in the air
- The floor in front of the wall is barely visible — dark concrete, slightly reflective from moisture
- Sound of distant rumbling train (optional, only if easily implemented)

**Camera:**
- Static or very slight idle sway
- Looking straight at the wall from about 2-3 units away
- Slight upward angle as if the viewer is a normal height person looking at wall-mounted posters

**Section heading:** 
- "Blog" or "Dispatches" or "Field Notes" rendered as HTML overlay text above the Canvas, fading in on scroll
- Burnt orange, Space Mono font

### How Blog Posts Map to Posters:
- Each blog post in `src/content/blog/*.mdx` becomes a poster on the wall
- Posters are positioned left to right, newest on the right
- For 1-3 posts: all visible on the wall
- For 4+ posts: the Camera can pan left/right (drag or scroll within the section) to see more posters
- Poster data comes from the MDX frontmatter (title, date, excerpt)

---

## SECTION 3: PROJECTS SECTION (Metro Line Map)

### Location in scroll: Below Blog Section
### Background: Solid #0a0a0a

This is the centerpiece of the portfolio content. It uses a METRO LINE MAP layout — like an actual transit system map — to display projects chronologically.

### The Metro Map Concept:

Think of a real metro/subway system map (like the London Underground map, NYC subway map, or DC Metro map). The map has:
- **A main line** running through the center/left of the viewport — this is YOUR journey
- **Station nodes** along the main line — each one is a project or milestone
- **Branch lines** that fork off at various points — these are decorative, they don't lead anywhere meaningful, but they make the map look like a real transit system. They have their own nodes with cryptic/cool station names.
- **The line color** is burnt orange (#BF5700)

### Section heading:
- "The Line" or "Routes" or "Stations" — rendered in Space Mono, burnt orange
- Below it, a subtitle like: "Every project is a stop. Every stop is a lesson."

### Map Layout — Detailed Specification:

The map is rendered as an SVG or HTML/CSS layout (NOT 3D — keep this performant). It scrolls vertically.

```
                    ┌─── Decorative Branch ──── ○ "Signal Lost"
                    │
 ● "Origin"  ───────┤
 (start node)       │
                    │
                    ├─── Decorative Branch ──── ○ "Echo Chamber" ──── ○ "Dead Freq"
                    │
 ■ Karmen Playground ─────────── [ PROJECT CARD ]
 (March 2026)       │
                    │
                    ├─── Decorative Branch ──── ○ "Phantom Route"
                    │
 ■ GridPulse ────────────────── [ PROJECT CARD ]
 (January 2026)     │
                    │
 ■ FlightSense ─────────────── [ PROJECT CARD ]
 (January 2026)     │
                    │
                    ├─── Decorative Branch ──── ○ "Undervolt" ──── ○ "Rust Belt"
                    │
 ■ SplitPay Escrow ─────────── [ PROJECT CARD ]
 (November 2025)    │
                    │
 ■ Orbit ────────────────────── [ PROJECT CARD ]
 (October 2025)     │
                    │
                    ├─── Decorative Branch ──── ○ "Sidetrack"
                    │
 ■ Aegis Dashboard ─────────── [ PROJECT CARD ]
 (October 2025)     │
                    │
 ■ Mp3 Player ───────────────── [ PROJECT CARD ]
 (June 2025)        │
                    │
 ◎ "Next Stop: TBD"
 (end node)
```

### Map Visual Details:

**The main line:**
- A thick burnt orange line (3-4px) running vertically down the left-center of the viewport
- The line has rounded corners at turns
- The line should have a subtle glow/bloom effect (CSS `box-shadow: 0 0 8px rgba(191,87,0,0.4)`)
- It should look like a transit map line — clean, geometric, with 45-degree angles when it turns

**Project station nodes (■):**
- Square with rounded corners, burnt orange fill, white border
- Size: ~16x16px
- When the node is in viewport (scroll-triggered): it pulses/glows
- Node has the project name next to it in Space Mono, white text
- Date below the name in text-muted

**Decorative branch lines:**
- Thinner lines (2px), same burnt orange but at 40% opacity
- Fork off the main line at 45-degree angles
- Lead to 1-3 small circular nodes (○) with mysterious/cool station names
- Station name ideas (use these or similar): "Signal Lost", "Echo Chamber", "Dead Frequency", "Phantom Route", "Undervolt", "Rust Belt", "Sidetrack", "Dark Pool", "Null Island", "Off-Grid", "Last Beacon", "Buried Line"
- These branches add visual complexity and make it feel like a real transit system
- They are NOT interactive, purely decorative

**Start node (●):**
- Circle, burnt orange, labeled "Origin" or "First Commit" or "Departure"
- At the very top of the map
- Subtitle: "Where it all started"

**End node (◎):**
- Double circle (ring), burnt orange
- Labeled "Next Stop: TBD" or "Terminal: Under Construction"
- At the very bottom
- Subtitle: "The journey continues"

### Project Cards:

Each project station node connects (via a horizontal line) to a PROJECT CARD on the right side. The card contains:

```
┌──────────────────────────────────────────────┐
│  ┌────────────────────────┐                  │
│  │                        │  Project Title   │
│  │   SLIDESHOW            │  Date            │
│  │   (images/GIFs)        │  Brief desc      │
│  │   with dots/arrows     │                  │
│  │                        │  [Live Demo] [Repo] │
│  └────────────────────────┘                  │
│                                              │
│  Tech Stack: [Next.js] [Python] [Groq] ...   │
│                                              │
│  [ ▼ Why this stack? ]                       │
│  ┌──────────────────────────────────────┐    │
│  │  Next.js: Needed SSR for SEO and... │    │  ← Expanded panel (hidden by default)
│  │  Python: Data pipeline for...       │    │
│  │  Groq: Sub-200ms inference for...   │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Card styling:**
- Background: `bg-secondary` (#111111) with 1px border `bg-tertiary`
- Rounded corners (12px)
- Slight backdrop-blur if overlapping anything
- Entrance animation: fade-in + slide from right as it scrolls into view

**Slideshow:**
- Image carousel with left/right arrows and dot indicators
- Supports variable number of images per project (defined in projects.ts)
- Images come from `public/projects/{project-id}/`
- Smooth crossfade transition between slides

**Links:**
- "Live Demo" button (if `liveUrl` exists in projects.ts): burnt orange outline button, opens in new tab
- "Repo" button: subtle ghost button with GitHub icon, opens in new tab
- If no live URL, only show Repo button

**Tech Stack:**
- Row of small pill badges: dark background, burnt orange text, tech name + optional small icon
- Below the badges: a "Why this stack?" button
- Clicking it expands a panel (Framer Motion `AnimatePresence`) showing per-technology explanations
- Each tech item shows: tech name (bold) + reason (from projects.ts `techStack[].reason`)
- The expanded panel has a subtle burnt orange left border

**ALL project data comes from `src/data/projects.ts`.** Never hardcode project info in components.

### Responsive Behavior:
- Desktop: map on left (~30% width), cards on right (~70% width)
- Tablet: map collapses to thin left rail, cards take full width
- Mobile: map becomes a simple vertical line with nodes, cards stack below each node

---

## SECTION 4: CONTACT FOOTER

### Location: Bottom of the page
### Background: #0a0a0a, subtle gradient to slightly darker at bottom

### Content:
- Section anchor: `id="contact"`
- Heading: "End of the Line" or "Last Stop" (train themed)
- Subtext: "But every end is a new beginning" or similar
- Links (same as poster on train, but as clean HTML):
  - GitHub: github.com/rehanmollick
  - LinkedIn: linkedin.com/in/rehanmollick
  - UT Email: rehanmollick07@utexas.edu
  - Gmail: rehanmollick07@gmail.com
- A simple "Back to top" link that smooth-scrolls to the train scene
- Small footer text: "© 2026 Md Rehan Mollick" and "Built with Next.js, R3F, and too much coffee"

---

## Build Order (Execute These Phases Sequentially)

### Phase A: Scroll Architecture (DO THIS FIRST)
1. Modify `src/app/page.tsx` to implement the fixed train + scrolling content architecture
2. Make the existing train Canvas `position: fixed; z-index: 0`
3. Create the scroll content wrapper (`position: relative; z-index: 10`)
4. Add the transparent spacer (100vh, `background: transparent`) — user sees full train
5. Add the About Me section area (ALSO `background: transparent` — train still visible)
6. Add the fade-to-black gradient div (30-50vh, from `transparent` to `#0a0a0a`) — this is where the train vanishes
7. Add placeholder divs for Blog, Projects, and Contact sections (all with `background: #0a0a0a`)
8. Verify scrolling works: train stays fixed behind everything, about me overlays on train, gradient hides train, lower sections are fully dark
9. COMMIT: `feat: implement fixed train scene with scroll-over content architecture`

### Phase B: About Me Overlay Card
1. Build the AboutSection component with transparent background
2. Create the pixel-art / retro-game style card (see Section 1 spec for exact visual details)
3. Implement the pixelated/stepped border in CSS (burnt orange)
4. Add the terminal-style header ("> ABOUT_ME" or "rehan@metro:~$ cat about.txt")
5. Add placeholder body text with typewriter effect or line-by-line fade-in
6. Implement scroll-linked entrance animation (fade-in + scale, using Framer Motion useScroll/useTransform)
7. Verify the train scene is still visible and animating behind the card
8. COMMIT after EACH sub-step above

### Phase C: Blog Section (Metro Station Wall)
1. Build a new R3F Canvas for the metro station wall scene
2. Create the tile wall geometry (procedural grid of tiles)
3. Add dim station lighting with warm point lights
4. Add poster geometry for blog posts (read from MDX files)
5. Create canvas textures for poster content (title, date, excerpt)
6. Add hover/click interaction on posters
7. Add atmospheric effects (dust particles, fog, bloom, vignette)
8. Create the blog post overlay/navigation when poster is clicked
9. COMMIT after EACH sub-step above

### Phase D: Projects Metro Map Timeline
1. Create the MetroMap component with SVG/HTML layout
2. Draw the main line (vertical burnt orange)
3. Add the start node ("Origin") and end node ("Next Stop: TBD")
4. Add project station nodes along the main line (from projects.ts, newest first)
5. Add decorative branch lines with creative station names
6. Build the ProjectCard component (slideshow, info, links, tech stack)
7. Connect project nodes to their cards with horizontal connector lines
8. Add scroll-triggered animations (node glow, card fade-in)
9. Add the "Why this stack?" expandable panel
10. Build the Slideshow component
11. COMMIT after EACH sub-step above

### Phase E: Contact Footer
1. Build the footer component with train-themed copy
2. Add links, back-to-top, copyright
3. COMMIT: `feat: add contact footer with train-themed copy`

### Phase F: Blog Post Pages
1. Create `/blog` index page that lists posts
2. Create `/blog/[slug]` dynamic route for individual posts
3. Write the first real blog post: "Building rehanmd.tech" (src/content/blog/building-rehanmd-tech.mdx)
4. Style MDX rendering with custom components (code blocks, headings, links)
5. COMMIT after each step

### Phase G: Polish
1. Responsive testing at 1440px, 768px, 375px — fix issues
2. Mobile fallback for 3D scenes (static image or simplified)
3. Lighthouse audit (target 90+)
4. Meta tags, Open Graph image, favicon
5. `prefers-reduced-motion` support
6. Lazy loading for images
7. Vercel Analytics
8. COMMIT after each fix

---

## File Structure Reference

```
rehanmd.tech/
  .claude/
    agents/
      r3f-specialist.md
      design-reviewer.md
  public/
    projects/
      karmen-playground/
      gridpulse/
      flightsense/
      splitpay-escrow/
      orbit/
      aegis-dashboard/
      mp3-player/
  src/
    app/
      layout.tsx                 # ALREADY EXISTS — root layout
      page.tsx                   # MODIFY — implement scroll architecture
      blog/
        page.tsx                 # Blog index page
        [slug]/
          page.tsx               # Individual blog post
    components/
      three/
        SubwayScene.tsx          # ALREADY EXISTS — train scene
        TrainInterior.tsx        # ALREADY EXISTS
        TunnelEnvironment.tsx    # ALREADY EXISTS
        TunnelLights.tsx         # ALREADY EXISTS
        PostProcessingEffects.tsx # ALREADY EXISTS
        CameraEffects.tsx        # ALREADY EXISTS
        SceneLoader.tsx          # ALREADY EXISTS
        MetroWallScene.tsx       # NEW — blog section 3D station wall
        WallTiles.tsx            # NEW — procedural tile wall geometry
        WallPoster.tsx           # NEW — blog post poster on wall
        WallLighting.tsx         # NEW — station lighting
      ui/
        Button.tsx
        Badge.tsx
        ExpandPanel.tsx
        Slideshow.tsx
      layout/
        Nav.tsx                  # ALREADY EXISTS
        Footer.tsx               # NEW — contact footer
      projects/
        MetroMap.tsx             # NEW — the full metro line map SVG/HTML
        MetroLine.tsx            # NEW — the main burnt orange line
        StationNode.tsx          # NEW — project station dot
        BranchLine.tsx           # NEW — decorative branch with fake stations
        ProjectCard.tsx          # NEW — project display card
        TechStackDisplay.tsx     # NEW — tech badges + expand
      blog/
        BlogWallSection.tsx      # NEW — wrapper for the 3D wall scene
        BlogOverlay.tsx          # NEW — expanded blog post overlay
        MDXComponents.tsx        # NEW — custom MDX rendering components
      sections/
        AboutSection.tsx         # NEW — transparent section with pixel-art card overlaying train
        AboutCard.tsx            # NEW — the retro/pixel-art style card component
        FadeToBlack.tsx          # NEW — the gradient transition that hides the train
        ScrollArchitecture.tsx   # NEW — the spacer + section wrapper
    data/
      projects.ts                # ALREADY EXISTS — all project data
    content/
      blog/
        hello-world.mdx          # ALREADY EXISTS
        building-rehanmd-tech.mdx # NEW — first real blog post
    lib/
      mdx.ts                     # ALREADY EXISTS
      utils.ts                   # ALREADY EXISTS
    styles/
      globals.css                # ALREADY EXISTS
```

---

## Content Management

### Adding a new project:
1. Add object to top of `projects` array in `src/data/projects.ts`
2. Drop images/GIFs into `public/projects/{project-id}/`
3. The metro map automatically adds a new station node
4. Commit and push. Vercel auto-deploys.

### Adding a blog post:
1. Create `src/content/blog/my-slug.mdx` with frontmatter (title, date, tags, excerpt)
2. A new poster automatically appears on the metro station wall
3. Commit and push.

---

## Critical Rules

1. NEVER use light mode or white backgrounds (except the metro station tiles which are off-white BY DESIGN to contrast with the dark surroundings).
2. NEVER use generic/corporate design. Underground. Personal. Atmospheric.
3. ALWAYS use Context7 MCP before writing any R3F/drei/postprocessing code.
4. ALWAYS commit after every meaningful unit of work. Granular history.
5. Target 60fps on all 3D scenes. The blog wall scene is a SECOND Canvas — watch performance.
6. NEVER add class year, Alumnus Capital, or graduation date anywhere.
7. DO NOT rebuild or modify the existing train scene. It is done.
8. All project data from projects.ts. All blog data from MDX files. Never hardcode content.
9. Mobile: graceful fallback for both 3D scenes.
10. The metro map is SVG/HTML, NOT 3D. Keep it performant.
11. Decorative branch lines on the metro map must have creative, evocative station names. Not generic.
12. Every section transition should feel smooth — no jarring jumps or broken scroll behavior.
