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

/** Number of light panels in the recycling pool */
const LIGHT_COUNT = 10;

/** Distance between consecutive light panels along Z */
const LIGHT_SPACING = 20;

/** Total span of the light pool before wrapping */
const POOL_LENGTH = LIGHT_COUNT * LIGHT_SPACING;

/** Light panel dimensions (width x height) */
const LIGHT_WIDTH = 0.3;
const LIGHT_HEIGHT = 2.0;

/**
 * X position: offset to the right, near the tunnel wall.
 * The train right wall is at x ~= 2.15 (CAR_WIDTH/2 + WALL_THICKNESS).
 * Tunnel lights sit further out so they are visible through the windows.
 */
const LIGHT_X = 5.5;

/**
 * Y position: roughly at window height so the lights
 * streak past at eye level for a seated passenger.
 */
const LIGHT_Y = 1.8;

/**
 * Z scroll speed in units per frame at 60fps.
 * Negative Z = lights move toward the camera (train moves forward).
 * We use delta-time scaling so the speed is frame-rate independent.
 * Base speed: ~0.4 units/frame at 60fps = ~24 units/second.
 */
const SCROLL_SPEED = 24;

// --- Pre-allocated objects (created once, reused every frame) ---

const COLOR_TUNNEL_LIGHT = new THREE.Color("#FFB366");

// --- Component ---

export interface TunnelLightsProps {
  /** Optional position offset for the entire lights group */
  position?: [number, number, number];
  /** Scroll speed multiplier (default 1.0) */
  speedMultiplier?: number;
}

export default function TunnelLights({
  position = [0, 0, 0],
  speedMultiplier = 1.0,
}: TunnelLightsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-allocate a dummy Object3D for computing instance matrices.
  // This avoids creating new objects every frame inside useFrame.
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Track each light's current Z offset. We store a simple number array
  // rather than Vector3s since only Z changes per frame.
  const offsets = useMemo(() => {
    const arr = new Float32Array(LIGHT_COUNT);
    for (let i = 0; i < LIGHT_COUNT; i++) {
      // Spread lights evenly along negative Z (ahead of camera)
      // so they start distributed in front of the train.
      arr[i] = -i * LIGHT_SPACING;
    }
    return arr;
  }, []);

  // Geometry: a simple plane for each light panel
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(LIGHT_WIDTH, LIGHT_HEIGHT),
    [],
  );

  // Material: MeshBasicMaterial with the warm tunnel light color.
  // toneMapped: false so the bright color passes through to the
  // postprocessing bloom effect without being clamped to [0,1].
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLOR_TUNNEL_LIGHT,
        toneMapped: false,
        side: THREE.DoubleSide,
        // Boost apparent brightness beyond 1.0 for bloom pickup.
        // MeshBasicMaterial.color is multiplied by this in the shader.
      }),
    [],
  );

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

    // The camera is roughly at Z = 0 (seated in the train).
    // Lights that scroll past Z > POOL_LENGTH / 2 (behind the camera)
    // get recycled back to the front of the pool.
    const wrapBehind = POOL_LENGTH / 2;
    const wrapFront = -POOL_LENGTH / 2;

    for (let i = 0; i < LIGHT_COUNT; i++) {
      // Move this light toward positive Z (toward and past the camera)
      offsets[i] += frameSpeed;

      // Wrap: if the light has passed well behind the camera, send
      // it back to the front of the pool.
      if (offsets[i] > wrapBehind) {
        offsets[i] -= POOL_LENGTH;
      }

      // Set the dummy's transform and push it into the instanced buffer
      dummy.position.set(LIGHT_X, LIGHT_Y, offsets[i]);

      // Rotate the plane to face the train (toward negative X).
      // PlaneGeometry faces +Z by default; rotate -90 deg around Y
      // so it faces -X (toward the train interior).
      dummy.rotation.set(0, -Math.PI / 2, 0);
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
        args={[geometry, material, LIGHT_COUNT]}
        frustumCulled={false} // Always render; they wrap around the camera
      />
    </group>
  );
}
