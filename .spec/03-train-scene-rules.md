# 03 · Train Scene Rules

The R3F train scene from Phase 1/2 is **kept as-is**. This file defines exactly *where it shows*, *where it doesn't*, and how content composes on top.

## Architecture

- Train Canvas is mounted **once** at the top of `app/page.tsx` inside a wrapper `<div className="train-stage">` that is `position: sticky; top: 0; height: 100vh;`.
- Below the train-stage div, a single `<main className="below-train">` holds Dispatches → The Line → Footer with `position: relative; z-index: 10; background: var(--bg-primary)` so the train is fully covered as the user scrolls past.
- The hero panel and the envelope are rendered as **HTML siblings inside `train-stage`**, absolutely positioned. They do not live inside the R3F Canvas (no drei `<Html>`); they are plain divs over the canvas. This is simpler than `<Html>` and avoids occlusion math.

```jsx
<div className="train-stage" style={{ position:'sticky', top:0, height:'100vh', zIndex:0 }}>
  <SubwayScene />                  {/* full R3F Canvas — KEEPS the in-scene CLICK HERE wall poster + contact popup */}
  <HeroPanel />                    {/* abs top-left of stage */}
  <Marquee />                      {/* abs top of stage, full width */}
  <ScrollCue />                    {/* abs bottom-center */}
</div>
<main className="below-train">
  <AboutSection />                 {/* envelope card lives here, NOT inside the train */}
  <DispatchesSection />
  <LineSection />
  <Footer />
</main>
```

The **CLICK HERE wall poster inside the R3F scene stays as-is** — it's the in-scene contact affordance and is working. The envelope is a separate, post-train About section below.

## Where the train shows

- **Visible**: While the user is scrolled within the first viewport (the sticky `train-stage`).
- **Hidden by content**: As the user scrolls down, `<main>` slides up over the train (because train-stage is sticky behind it with `z-index:0` and main is `z-index:10` with opaque background).
- **About modal open**: Train continues to render, but the modal's full-screen backdrop (`rgba(0,0,0,.94)` + `backdrop-filter: blur(6px)`) at `z-index:200` covers it completely. Critical fix vs Phase 1 — the backdrop must be opaque-enough that the train no longer reads through.
- **Lightbox open** (project carousel fullscreen): same backdrop rule. Nothing of the train shows.
- **Newsstand Wall (`/blog`)**: Train Canvas is **NOT mounted on this route**. The page renders only the wall + nav + footer.
- **Newspaper Reader (`/blog/[slug]`)**: Train Canvas is **NOT mounted**.
- **Admin (`/admin/**`)**: Train Canvas is **NOT mounted**. Admin shell has its own dark layout.

## Conditional mount

Only `app/page.tsx` (the home route) mounts `<SubwayScene />`. All other routes render their own layout without it. This is enforced by NOT putting the Canvas in `app/layout.tsx` — only in `app/page.tsx`.

## Things KEPT in the train scene

The in-scene CLICK HERE wall poster + its contact-details popup are **kept and unchanged**. Do NOT delete:

- `WallPoster.tsx`
- `WallTiles.tsx`
- `WallLighting.tsx`
- `MetroWallScene.tsx`
- `PosterFrame.tsx`
- `PosterLinksOverlay.tsx`

The envelope referenced elsewhere in this spec is a **separate** card that lives in the post-train About section, not on the train wall.

## Camera and post-FX preserved

Keep:
- `<TrainInterior />`, `<TunnelEnvironment />`, `<TunnelLights />`
- `<PostFX />` (bloom + chromatic aberration)
- `<CameraShake>` — but disable when `prefers-reduced-motion: reduce`
- `<TickerLED />`

## Mobile and low-power fallback

- If `window.matchMedia('(max-width: 760px)').matches` AND `navigator.hardwareConcurrency < 4`: skip mounting `<SubwayScene />`. Render `<TrainStaticFallback />` instead — a CSS-only static rectangle with a CSS gradient mimicking the train wall, the marquee, and the envelope overlaid. The hero copy and envelope still work; just no R3F.
- If `prefers-reduced-motion: reduce` AND `< 1024px`: same fallback.
- Always disable post-FX on phones (`PostFX` accepts a `disabled` prop — set true when viewport `< 900px`).

## Scroll behavior

- Wheel/touch scroll on the home page must NOT be intercepted by the train scene. Canvas has `pointer-events: none` on the wrapper; clicks on hero/envelope still work because they're regular DOM siblings.
- Hash navigation (`#projects`, `#dispatches`) scrolls within `<main className="below-train">` normally.

## Interaction rules

- The envelope's "OPEN" button opens `<AboutBulletinModal>` (Framer Motion `<AnimatePresence>`). When open, lock body scroll (`document.body.style.overflow='hidden'`) and restore on close.
- A click anywhere on the dim backdrop closes the modal. `Esc` also closes. Same for `<ProjectLightbox>`.
- Train scene continues animating in the background while modals are open — do not pause it. The opaque backdrop hides it visually.

## Rendering performance

- Limit Canvas DPR to `[1, 1.5]` on phones, `[1, 2]` on desktop.
- `<Suspense fallback={null}>` around the heaviest sub-tree (TunnelEnvironment) to allow the page to LCP on the hero panel + envelope before the train materializes.
- LCP target: hero `<h1>` and envelope must paint < 1.8s on 4G simulated.
