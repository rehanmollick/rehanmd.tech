"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraShake } from "@react-three/drei";
import type { ShakeController } from "@react-three/drei/core/CameraShake";

// ============================================
// CameraEffects - Subtle train rumble/vibration
//
// Simulates the feeling of being a seated passenger
// on a moving subway train. Uses drei CameraShake
// for the base rumble, with periodic intensity spikes
// to simulate track bumps and rail joints.
// ============================================

// --- Constants ---

/** Base shake intensity (gentle constant rumble) */
const BASE_INTENSITY = 0.15;

/** Peak intensity during a track bump */
const BUMP_INTENSITY = 0.45;

/**
 * Approximate interval between bumps in seconds.
 * Actual timing uses a randomised window around this value
 * so bumps feel organic rather than metronomic.
 */
const BUMP_INTERVAL_MIN = 4;
const BUMP_INTERVAL_MAX = 8;

/** How long a bump takes to decay back to base (seconds) */
const BUMP_DECAY_DURATION = 0.6;

// --- Reduced motion hook ---

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

// --- Main component ---

export interface CameraEffectsProps {
  /** Override base intensity (0-1). Defaults to 0.15 */
  intensity?: number;
  /** Disable track bump spikes entirely */
  disableBumps?: boolean;
}

export default function CameraEffects({
  intensity = BASE_INTENSITY,
  disableBumps = false,
}: CameraEffectsProps) {
  const prefersReduced = usePrefersReducedMotion();
  const shakeRef = useRef<ShakeController>(null);

  // Pre-allocated timing state to avoid allocations in useFrame.
  // nextBumpTime: clock time when the next bump should fire.
  // bumpStartTime: clock time when the current bump started (0 = no active bump).
  const bumpState = useRef({
    nextBumpTime: BUMP_INTERVAL_MIN + Math.random() * (BUMP_INTERVAL_MAX - BUMP_INTERVAL_MIN),
    bumpStartTime: 0,
  });

  // Schedule the next random bump after the current one finishes.
  const scheduleNextBump = useCallback((currentTime: number) => {
    const jitter = BUMP_INTERVAL_MIN + Math.random() * (BUMP_INTERVAL_MAX - BUMP_INTERVAL_MIN);
    bumpState.current.nextBumpTime = currentTime + jitter;
  }, []);

  // Drive intensity spikes for track bumps.
  // CameraShake handles the actual camera rotation offsets;
  // we just modulate its intensity value over time.
  useFrame((state) => {
    if (prefersReduced || disableBumps || !shakeRef.current) return;

    const t = state.clock.elapsedTime;
    const bs = bumpState.current;

    // Check if it is time to trigger a new bump
    if (bs.bumpStartTime === 0 && t >= bs.nextBumpTime) {
      bs.bumpStartTime = t;
    }

    // If a bump is active, lerp intensity up then back down
    if (bs.bumpStartTime > 0) {
      const elapsed = t - bs.bumpStartTime;
      const progress = elapsed / BUMP_DECAY_DURATION;

      if (progress >= 1) {
        // Bump finished -- reset to base and schedule next
        shakeRef.current.setIntensity(intensity);
        bs.bumpStartTime = 0;
        scheduleNextBump(t);
      } else {
        // Sharp attack (first 20% of duration), smooth decay (remaining 80%).
        // This mimics the feel of a wheel hitting a rail joint:
        // quick jolt followed by a damped settle.
        let factor: number;
        if (progress < 0.2) {
          // Attack phase: quick ramp up
          factor = progress / 0.2;
        } else {
          // Decay phase: ease-out from 1 -> 0
          const decayProgress = (progress - 0.2) / 0.8;
          factor = 1 - decayProgress * decayProgress;
        }

        const currentIntensity = intensity + (BUMP_INTENSITY - intensity) * factor;
        shakeRef.current.setIntensity(currentIntensity);
      }
    }
  });

  // When reduced motion is preferred, render nothing
  if (prefersReduced) {
    return null;
  }

  return (
    <CameraShake
      ref={shakeRef}
      intensity={intensity}
      maxYaw={0.01}
      maxPitch={0.005}
      maxRoll={0.005}
      yawFrequency={0.5}
      pitchFrequency={0.3}
      rollFrequency={0.2}
    />
  );
}
