# CLAUDE.md - rehanmd.tech Portfolio

## Project Overview

Personal portfolio website for Md Rehan Mollick (rehanmd.tech). An immersive, 3D-heavy, dark-themed tech portfolio built with Next.js, React Three Fiber, and Framer Motion. The hero is a first-person procedural subway train scene. The site features a scroll-driven timeline of projects, a minimal blog, and data-driven content management.

This is NOT a generic portfolio. The aesthetic is dark, underground, techy, with UT Austin burnt orange (#BF5700) as the signature accent. Every section should feel atmospheric and intentional.

---

## Git Configuration

ALL commits MUST be attributed to:
- Name: `rehanmollick`
- Email: `rehanmollick07@gmail.com`

Before any commit, verify with: `git config user.name && git config user.email`

If not set, run:
```bash
git config user.name "rehanmollick"
git config user.email "rehanmollick07@gmail.com"
```

Commit early and commit often. Use descriptive conventional commit messages:
- `feat: add subway car interior geometry`
- `style: adjust tunnel fog density and bloom`
- `content: add GridPulse project data and slides`
- `fix: resolve scroll-snap jank on projects timeline`

NEVER let "Claude Code" or "Anthropic" or "AI" appear in any commit message or author field.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15+ | SSR, routing, MDX blog |
| Language | TypeScript | 5.x | Type safety everywhere |
| 3D Engine | React Three Fiber | 9.x | Declarative Three.js |
| 3D Helpers | @react-three/drei | latest | Camera, controls, effects helpers |
| 3D Post-FX | @react-three/postprocessing | latest | Bloom, vignette, film grain |
| Animation | Framer Motion | 11+ | Scroll animations, page transitions |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Blog | MDX (next-mdx-remote) | latest | Markdown + JSX blog posts |
| Analytics | Vercel Analytics | latest | Privacy-friendly analytics |
| Hosting | Vercel | - | Auto-deploy from GitHub |

---

## MCP Server Usage

Claude Code has access to these MCP servers. USE THEM:

### GitHub MCP
- Use for ALL git operations: commits, pushes, branch management
- Check repo status before and after operations
- Create meaningful commit messages

### Context7 MCP
- ALWAYS query Context7 before writing R3F, drei, postprocessing, Next.js, Framer Motion, or Tailwind code
- Query pattern: "resolve react-three/fiber" or "resolve @react-three/drei" or "resolve framer-motion"
- This prevents hallucinating deprecated APIs
- Especially critical for R3F v9 which has breaking changes from v8

### Puppeteer MCP
- Use to visually verify the 3D scene renders correctly
- Screenshot the page after major visual changes
- Test scroll behavior and responsive breakpoints

---

## Sub-Agent Strategy

This project benefits from parallel sub-agents for independent workstreams. The main agent (orchestrator) should delegate as follows:

### When to spawn sub-agents:
- Building independent components (e.g., train scene + timeline component simultaneously)
- Research tasks (e.g., looking up drei API while implementing a different component)
- Optimization passes (e.g., performance audit of 3D scene while building blog pages)

### Agent definitions (in .claude/agents/):
1. `r3f-specialist.md` - Handles all React Three Fiber, drei, and postprocessing code. Queries Context7 for R3F docs before writing any 3D code.
2. `design-reviewer.md` - Reviews visual output via Puppeteer screenshots. Checks color consistency, spacing, typography, and overall aesthetic against the design system.

### When NOT to use sub-agents:
- Sequential work where output depends on previous step
- Small changes or fixes
- Content updates (projects.ts, blog posts)

---

## Build Phases (Execute in Order)

### Phase 1: Foundation (Do First)
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up the app directory structure
3. Configure tailwind.config.ts with custom color system
4. Create the global CSS with dark theme variables
5. Create the layout shell (nav + scroll container)
6. Set up the data layer (projects.ts with all 7 projects pre-populated)
7. First commit and push

### Phase 2: Hero / 3D Train Scene (PRIORITY)
This is the most important and complex part. Build it carefully.

#### Scene Architecture:
```
<Canvas> (full viewport, 100vh)
  <SubwayScene>
    <TrainInterior>          // Procedural geometry: walls, floor, ceiling, seats, poles, windows
      <WindowPanels />       // Transparent/reflective panels showing tunnel
    </TrainInterior>
    <TunnelEnvironment>      // Infinite scrolling tunnel outside windows
      <TunnelWalls />        // Dark cylindrical geometry
      <TunnelLights />       // Emissive planes that scroll past periodically
      <Particles />          // Dust/fog particles for atmosphere
    </TunnelEnvironment>
    <Lighting>
      <ambientLight />       // Very dim, ~0.05 intensity
      <pointLight />         // Warm dim interior light (burnt orange tinted)
      <RectAreaLight />      // Simulates fluorescent tube on train ceiling (flickering)
    </Lighting>
    <PostProcessing>
      <Bloom />              // Glow on tunnel lights and interior light
      <Vignette />           // Dark edges for cinematic feel
      <FilmGrain />          // Subtle grain for grit
      <DepthOfField />       // Slight blur on distant tunnel
      <ChromaticAberration /> // Very subtle, adds realism
    </PostProcessing>
    <CameraEffects>
      <CameraShake />        // Subtle periodic shaking (train rumble)
    </CameraEffects>
  </SubwayScene>
</Canvas>
```

#### Train Interior Details:
- Camera POV: Seated passenger, looking toward windows on one side
- Material: Dark metallic for walls/ceiling (MeshStandardMaterial, roughness 0.8, metalness 0.3)
- Floor: Slightly reflective dark surface
- Seats: Simple box geometry with dark fabric material
- Poles: Cylindrical, metallic, slightly reflective
- Windows: Large rectangular cutouts with slight blue-tint transparent material
- Interior light: One or two ceiling-mounted rectangles with emissive material (warm white, slight flicker animation via useFrame)

#### Tunnel Details:
- Geometry: Long cylinder or box tunnel, scrolling via UV animation or position offset in useFrame
- Tunnel lights: Bright emissive rectangular planes spaced ~20 units apart, scrolling past at train speed
- Speed: Fast enough to feel like motion but not nauseating (~0.5 units/frame)
- Fog: Use Three.js fog (FogExp2, dark color, density ~0.015)
- Occasional slight camera shake intensification (simulating track bumps)

#### Overlay (HTML on top of Canvas):
- Position: absolute, z-index above canvas
- Top-left or centered: "Md Rehan Mollick" in a clean white font (font: Space Mono or JetBrains Mono)
- Below name: "Software Engineer" or "Building Things My Own Way"
- Links row: GitHub icon, LinkedIn icon, Email icon (subtle, white, hover glow burnt orange)
- Navigation: Subtle floating nav dots or text links to sections below
- All text should have slight text-shadow for readability over 3D scene
- Consider glassmorphism card (backdrop-blur, semi-transparent bg) for the text block

#### Scroll Transition:
- As user scrolls past 100vh, the train scene should:
  - Either fade to black with opacity transition
  - Or zoom the camera forward into the tunnel (creating a "entering the darkness" effect)
  - The About section emerges from the darkness below

### Phase 3: About Section
- Brief section (50vh max)
- Fade-in text animation on scroll (Framer Motion useInView)
- 3-4 sentences about who Rehan is
- Personality-forward, not resume-dump
- Subtle parallax or reveal effect
- Placeholder text that Rehan will replace with his own words

### Phase 4: Projects Timeline (Core Feature)
Architecture:
```
<ProjectsSection>
  <Timeline>                    // Vertical line with nodes, left side
    <TimelineNode active />     // Glows burnt orange when active
    <TimelineNode />
    ...
  </Timeline>
  <ProjectCards>                // Right side, scroll-driven
    <ProjectCard>
      <Slideshow />             // Image/GIF carousel with dots/arrows
      <ProjectInfo>
        <Title />
        <Date />
        <Description />
        <Links>                 // Live demo + repo buttons
          <LiveDemoButton />
          <RepoButton />
        </Links>
        <TechStack>             // Row of tech badges
          <TechBadge />
          <TechBadge />
        </TechStack>
        <ExpandButton />        // "Why this stack?" - expands panel
        <ExpandedPanel>         // Per-technology explanation
          <TechExplanation />
          <TechExplanation />
        </ExpandedPanel>
      </ProjectInfo>
    </ProjectCard>
  </ProjectCards>
</ProjectsSection>
```

- Timeline is sticky on the left as user scrolls through projects
- Active project node glows burnt orange
- Scroll-snap so each project gets its moment
- Slideshow supports variable number of images/GIFs per project
- Tech stack badges are small, pill-shaped with icon + name
- "Why this stack?" expand uses Framer Motion AnimatePresence
- Projects are rendered from `src/data/projects.ts` (newest first, chronological)

### Phase 5: Contact Footer
- Simple, clean section
- Email (mailto link), GitHub, LinkedIn
- "Let's build something" or similar CTA
- Subtle callback to train aesthetic (distant tunnel lights in background?)

### Phase 6: Blog (/blog route)
- Separate page, same dark theme and nav shell
- Lists all .mdx posts from src/content/blog/ sorted by date (newest first)
- Each post shows: title, date, optional tags, brief excerpt
- Individual post pages at /blog/[slug]
- MDX renders with custom components (code blocks with syntax highlighting, images, callouts)
- Minimal design inspired by damkam.tech/garden

### Phase 7: Polish and Optimization
- Lighthouse performance audit (target 90+)
- 3D scene: implement lazy loading (show loading state, then reveal scene)
- Add `loading="lazy"` to all project images
- Implement `<Suspense>` around Canvas
- Add proper meta tags, Open Graph image
- Test all breakpoints (mobile, tablet, desktop)
- Mobile: 3D scene should either simplify or show a static fallback
- Ensure all animations respect `prefers-reduced-motion`
- Add Vercel Analytics script

---

## Design System

### Colors (Tailwind Config)
```
colors: {
  bg: {
    primary: '#0a0a0a',      // Main background
    secondary: '#111111',     // Cards, elevated surfaces
    tertiary: '#1a1a1a',      // Subtle elevation
  },
  accent: {
    DEFAULT: '#BF5700',       // UT burnt orange
    light: '#E87A2E',         // Hover/glow state
    dim: '#8B3F00',           // Muted accent
    glow: '#FF6B1A',          // Neon glow variant (for bloom effects)
  },
  text: {
    primary: '#f5f5f5',       // Main text
    secondary: '#a1a1a1',     // Subdued text
    muted: '#666666',         // Very subdued
  },
  tunnel: {
    light: '#FFB366',         // Warm tunnel light color
    fog: '#0d0d0d',           // Fog color
  }
}
```

### Typography
- Display/Headings: `Space Mono` (monospace, techy feel) or `JetBrains Mono`
- Body: `Inter` with adjusted letter-spacing for readability
- Code blocks: `JetBrains Mono`
- Import via next/font/google for optimal loading

### Spacing
- Use Tailwind's default scale
- Generous whitespace between sections
- Projects timeline: each project card gets at least 80vh of scroll space

### Animations
- Scroll reveals: Framer Motion useInView with fade-up (y: 20 to 0, opacity 0 to 1)
- Duration: 0.6s default, 0.3s for micro-interactions
- Easing: [0.25, 0.46, 0.45, 0.94] (ease-out-quad)
- 3D scene: 60fps target, use useFrame for all animations
- Respect prefers-reduced-motion: disable all scroll animations and camera shake

---

## File Structure Reference

```
rehanmd.tech/
  .claude/
    agents/
      r3f-specialist.md          # Sub-agent for 3D work
      design-reviewer.md         # Sub-agent for visual QA
  public/
    projects/
      karmen-playground/         # Drop screenshots/GIFs here
      gridpulse/
      flightsense/
      splitpay-escrow/
      orbit/
      aegis-dashboard/
      mp3-player/
    og-image.png                 # Open Graph image (1200x630)
    favicon.ico
  src/
    app/
      layout.tsx                 # Root layout with fonts, metadata, analytics
      page.tsx                   # Main scroll page (hero + about + projects + contact)
      blog/
        page.tsx                 # Blog index
        [slug]/
          page.tsx               # Individual blog post
      api/                       # Reserved for future API routes
    components/
      three/
        SubwayScene.tsx          # Main 3D scene orchestrator
        TrainInterior.tsx        # Procedural train car geometry
        TunnelEnvironment.tsx    # Scrolling tunnel with lights
        TunnelLights.tsx         # Emissive light panels
        PostProcessingEffects.tsx # Bloom, vignette, grain, DOF
        CameraEffects.tsx        # Shake, scroll-driven camera
        SceneLoader.tsx          # Suspense + loading state wrapper
      ui/
        Button.tsx
        Badge.tsx
        ExpandPanel.tsx          # Animated expand/collapse
        Slideshow.tsx            # Image/GIF carousel
      layout/
        Nav.tsx                  # Floating navigation
        Footer.tsx               # Contact footer
        ScrollProgress.tsx       # Optional scroll progress indicator
      projects/
        ProjectsSection.tsx      # Full projects section with timeline
        Timeline.tsx             # Vertical timeline with active states
        TimelineNode.tsx         # Individual timeline dot
        ProjectCard.tsx          # Single project display
        TechStackDisplay.tsx     # Tech badges + expandable explanations
      blog/
        BlogList.tsx             # Blog post list
        BlogPost.tsx             # Individual post layout
        MDXComponents.tsx        # Custom MDX component overrides
    data/
      projects.ts                # ALL project data lives here
    content/
      blog/
        hello-world.mdx          # Starter blog post
    lib/
      mdx.ts                     # MDX processing utilities
      utils.ts                   # General utilities
    styles/
      globals.css                # Global styles, CSS variables, Tailwind directives
  tailwind.config.ts
  tsconfig.json
  next.config.mjs
  package.json
  .gitignore
  README.md
```

---

## Content Management (How Rehan Adds Content)

### Adding a new project:
1. Add an object to the `projects` array in `src/data/projects.ts`
2. Drop image/GIF files into `public/projects/{project-id}/`
3. Commit and push. Vercel auto-deploys. Done.

### Adding a blog post:
1. Create `src/content/blog/my-post-slug.mdx`
2. Add frontmatter (title, date, tags, excerpt)
3. Write in markdown (with optional JSX components)
4. Commit and push. Done.

### Updating about text:
1. Edit the about section in `src/app/page.tsx`
2. Or extract to a separate content file if preferred

---

## Critical Rules

1. NEVER use light mode or white backgrounds. The entire site is dark.
2. NEVER use generic/corporate design patterns. This should feel underground and personal.
3. ALWAYS use Context7 MCP before writing R3F/drei/postprocessing code. The APIs change frequently.
4. ALWAYS commit after completing each meaningful unit of work.
5. ALWAYS test 3D scene performance. Target 60fps on mid-range hardware.
6. NEVER add UT Austin class year, Alumnus Capital, or graduation date to the site.
7. The 3D train scene is the FIRST thing to build after foundation. It is the centerpiece.
8. Mobile devices: provide a graceful fallback for the 3D scene (static atmospheric image or simplified scene).
9. All project data comes from projects.ts. Never hardcode project info in components.
10. Blog posts are .mdx files. The blog system auto-discovers them. No manual routing needed.
