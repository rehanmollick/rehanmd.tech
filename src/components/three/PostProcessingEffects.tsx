"use client";

import { useMemo } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

// ============================================
// PostProcessingEffects
//
// Wraps all fullscreen post-processing effects
// for the subway scene in a single composable
// component. Uses @react-three/postprocessing v3
// which wraps the `postprocessing` library.
//
// Effect stack (in order):
//   1. DepthOfField  – soft blur on distant tunnel geometry
//   2. Bloom         – glow on emissive tunnel lights and ceiling strips
//   3. ChromaticAberration – very subtle RGB fringing for realism
//   4. Noise         – film-grain overlay for gritty atmosphere
//   5. Vignette      – darkened edges for cinematic framing
// ============================================

export interface PostProcessingEffectsProps {
  /** Master toggle to disable all effects (e.g. for mobile fallback) */
  enabled?: boolean;
}

export default function PostProcessingEffects({
  enabled = true,
}: PostProcessingEffectsProps) {
  // Pre-allocate the chromatic aberration offset vector so we never
  // create a new object on re-render.
  const chromaticOffset = useMemo(() => new Vector2(0.0015, 0.0015), []);

  if (!enabled) return null;

  return (
    <EffectComposer
      multisampling={0} // disable MSAA; post-fx provide enough smoothing
      enabled={enabled}
    >
      {/*
        DepthOfField — blurs objects far from the focal plane.
        focusDistance and focalLength are normalised (0-1) values relative
        to the camera near/far range. Low values keep focus very close,
        pushing the distant tunnel into a soft bokeh.
      */}
      {/* DOF disabled — too expensive, kills framerate */}

      {/*
        Bloom — makes any pixel above the luminance threshold bleed light
        outward. The emissive ceiling lights (toneMapped: false) and
        tunnel light panels will glow naturally.
        radius controls the blur kernel size of the bloom spread.
      */}
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.9}
      />

      {/*
        ChromaticAberration — shifts R and B channels by a tiny offset
        to simulate lens imperfection. The offset is in UV space so
        0.001 is extremely subtle and only visible at high-contrast edges.
      */}
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.5}
      />

      {/*
        Noise — overlays a per-frame random luminance pattern to emulate
        film grain. SOFT_LIGHT blend mode mixes the noise into the scene
        without washing out dark areas, preserving the dark subway
        aesthetic while adding textural grit.
      */}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.14}
      />

      {/*
        Vignette — darkens the screen edges with a smooth radial gradient.
        offset controls how far the darkening extends from the edges
        (lower = more of the frame is darkened). darkness controls how
        black the corners get.
      */}
      <Vignette
        offset={0.25}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
