# Context

## What this project is

`rehanmd.tech` is a personal portfolio built as a dark, immersive Next.js site. The hero is the centerpiece: a first-person 3D subway/train interior rendered with React Three Fiber, where identity and links are embedded into the scene instead of shown as a normal HTML hero block.

## Current hero scene concept

- The landing view is an in-train passenger shot, not an exterior train shot.
- The scene is a stylized procedural subway car with a looping tunnel outside the windows.
- Rehan's branding is in-scene:
  - a scrolling LED ticker on the right wall
  - a clickable transit-style poster/ad on the right wall
- Regular page sections (`About`, `Projects`, `Contact`) continue below the 3D hero.

## Current camera / POV

- The camera is hard-set in [`src/components/three/SubwayScene.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/SubwayScene.tsx).
- Current position: `(-1.0, 1.55, 0.5)`
- Current look target: `(2.5, 1.7, -1.5)`
- Practical read of the shot:
  - seated on the left side of the subway car
  - looking diagonally across toward the right-side windows
  - framing the right wall poster and LED ticker
  - slight upward bias, not downward
- Camera shake is currently disabled because it was overriding orientation.

## Current scene contents

- `TrainInterior`: procedural car geometry with walls, windows, doors, benches, poles/bars, ceiling details, lights, and interior props.
- `TunnelEnvironment` + `TunnelLights`: looping dark tunnel and warm orange light panels moving past the windows to imply train motion.
- `TunnelLightSpill`: moving orange point light inside the car to fake tunnel light passing through the windows.
- `PosterFrame`: transit-ad style identity card; click opens the HTML links overlay.
- `LEDTicker`: scrolling marquee with name / role / site.
- `DustParticles` + post-processing: haze/grit/cinematic mood.

## Useful implementation anchors

- [`src/app/page.tsx`](/Users/rehan/Documents/rehanmd.tech/src/app/page.tsx): page structure
- [`src/components/three/HeroScene.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/HeroScene.tsx): hero wrapper + poster click overlay
- [`src/components/three/SubwayScene.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/SubwayScene.tsx): canvas, camera, lighting, scene composition
- [`src/components/three/TrainInterior.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/TrainInterior.tsx): subway car geometry
- [`src/components/three/PosterFrame.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/PosterFrame.tsx): in-scene poster content
- [`src/components/three/LEDTicker.tsx`](/Users/rehan/Documents/rehanmd.tech/src/components/three/LEDTicker.tsx): scrolling ticker content
- [`.claude/TRAIN-SCENE-V2.md `](/Users/rehan/Documents/rehanmd.tech/.claude/TRAIN-SCENE-V2.md%20): desired overhaul direction; note that it does not exactly match the current implemented camera height/tilt

## Important note for future iterations

The intended direction and the implemented shot are close, but not identical. The current build already reads as "left-seat passenger looking across the car," but the actual camera is higher and more level/upward than the overhaul note that calls for a lower, slightly downward seated POV.
