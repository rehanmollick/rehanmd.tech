"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// TunnelLights - Bright emissive panels on
// the tunnel wall that scroll past the train
// windows, creating the classic subway
// light-streak effect.
//
// Uses InstancedMesh for performance: a single
// draw call renders all light panels. Positions
// are mutated each frame via a pre-allocated
// dummy Object3D to avoid GC pressure.
// ============================================

// --- Constants ---

/** Distance between consecutive light panels along Z */
const LIGHT_SPACING = 22;

/** Light panel dimensions (width x height) */
const LIGHT_WIDTH = 0.4;
const LIGHT_HEIGHT = 2.5;

/**
 * X position: offset to the right, near the tunnel wall.
 * The train right wall is at x ~= 2.15 (CAR_WIDTH/2 + WALL_THICKNESS).
 * Tunnel lights sit further out so they are visible through the windows.
 */
const LIGHT_X = 2.9;

/**
 * Y position: roughly at window height so the lights
 * streak past at eye level for a seated passenger.
 */
const LIGHT_Y = 1.8;

/**
 * Z scroll speed in units per frame at 60fps.
 * Negative Z = lights move toward the camera (train moves forward).
 * We use delta-time scaling so the speed is frame-rate independent.
 * Base speed: ~0.6 units/frame at 60fps = ~36 units/second.
 */
const SCROLL_SPEED = 18;

// --- Pre-allocated objects (created once, reused every frame) ---

const COLOR_TUNNEL_LIGHT = new THREE.Color("#FFB366");

// --- Component ---

export interface TunnelLightsProps {
  /** Optional position offset for the entire lights group */
  position?: [number, number, number];
  /** Scroll speed multiplier (default 1.0) */
  speedMultiplier?: number;
  /** Which side of the train the light panels are on */
  side?: "left" | "right";
  /** Brightness multiplier for one side */
  intensityMultiplier?: number;
  /** Number of active passing lights */
  count?: number;
  /** Local Z center for the passing lights */
  zOffset?: number;
}

export default function TunnelLights({
  position = [0, 0, 0],
  speedMultiplier = 1.0,
  side = "right",
  intensityMultiplier = 1.0,
  count = 6,
  zOffset = 0,
}: TunnelLightsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-allocate a dummy Object3D for computing instance matrices.
  // This avoids creating new objects every frame inside useFrame.
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Track each light's current Z offset. We store a simple number array
  // rather than Vector3s since only Z changes per frame.
  const offsets = useMemo(() => {
    const arr = new Float32Array(count);
    const span = (count - 1) * LIGHT_SPACING;
    const start = -span / 2;
    for (let i = 0; i < count; i++) {
      arr[i] = start + i * LIGHT_SPACING;
    }
    return arr;
  }, [count]);

  // Geometry: a simple plane for each light panel
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(LIGHT_WIDTH, LIGHT_HEIGHT),
    [],
  );

  // Material: MeshBasicMaterial with the warm tunnel light color.
  // toneMapped: false so the bright color passes through to the
  // postprocessing bloom effect without being clamped to [0,1].
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR_TUNNEL_LIGHT,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    // Boost color beyond 1.0 for stronger bloom pickup
    mat.color.multiplyScalar(3 * intensityMultiplier);
    return mat;
  }, [intensityMultiplier]);

  // Set initial instance matrices on first render.
  // useFrame will update them every frame, but we need valid matrices
  // for the first paint to avoid a single-frame glitch.
  useMemo(() => {
    // This runs synchronously before the first commit, so meshRef
    // is not yet assigned. We rely on the first useFrame tick to
    // set correct matrices. InstancedMesh defaults to identity
    // matrices which is acceptable for a single frame.
  }, []);

  // --- Animation loop ---
  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Clamp delta to avoid huge jumps when the tab is backgrounded
    const dt = Math.min(delta, 0.1);
    const frameSpeed = SCROLL_SPEED * speedMultiplier * dt;

    const span = count * LIGHT_SPACING;
    const wrapBehind = span / 2;
    const wrapFront = -span / 2;

    for (let i = 0; i < count; i++) {
      // Move this light toward positive Z (toward and past the camera)
      offsets[i] += frameSpeed;

      if (offsets[i] > wrapBehind) {
        offsets[i] = wrapFront;
      }

      const sideX = side === "right" ? LIGHT_X : -LIGHT_X;
      dummy.position.set(sideX, LIGHT_Y, offsets[i] + zOffset);

      dummy.rotation.set(0, side === "right" ? -Math.PI / 2 : Math.PI / 2, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    // Flag the instance attribute buffer for upload to the GPU
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
}
