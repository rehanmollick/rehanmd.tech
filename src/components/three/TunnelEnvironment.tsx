"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// TunnelEnvironment - Infinite scrolling subway tunnel
//
// Creates the illusion of a moving train by scrolling
// tunnel segments and support ribs along the -Z axis.
// When a segment passes behind the camera it wraps to
// the far end, producing a seamless infinite loop.
// ============================================

// --- Tunnel dimensions ---

/** The tunnel is a rectangular box rather than a cylinder,
 *  matching subway tunnel aesthetics and keeping geometry cheap. */
const TUNNEL_WIDTH = 8;
const TUNNEL_HEIGHT = 5;

/**
 * Each tunnel segment length. We tile several segments end-to-end
 * so there is always geometry visible ahead and behind the camera.
 */
const SEGMENT_LENGTH = 40;

/**
 * Number of segments in the ring buffer.
 * Total tunnel length = SEGMENT_COUNT * SEGMENT_LENGTH.
 * Three segments is enough: one behind camera, one around it, one ahead.
 */
const SEGMENT_COUNT = 4;

/** Total length of all segments combined */
const TOTAL_LENGTH = SEGMENT_COUNT * SEGMENT_LENGTH;

/** Spacing between tunnel support ribs within one segment */
const RIB_SPACING = 15;

/** Rib (cross-beam) thickness */
const RIB_DEPTH = 0.3;
const RIB_INSET = 0.15; // how far ribs protrude inward from walls

/** Scroll speed in units per frame (~0.4 at 60 fps ≈ 24 units/sec) */
const SCROLL_SPEED = 0.4;

// --- Pre-allocated colors ---
const COLOR_TUNNEL = new THREE.Color("#0d0d0d");
const COLOR_RIB = new THREE.Color("#151515");

// --- Sub-components ---

/**
 * A single tunnel segment: floor, ceiling, and two side walls forming
 * a rectangular tube. Each segment is SEGMENT_LENGTH long.
 *
 * Ribs (cross-beams) are placed at regular intervals along the segment
 * to break up the visual monotony and give depth cues for the speed
 * illusion.
 */
function TunnelSegment({ index }: { index: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // --- Materials (shared within segment, memoised) ---
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_TUNNEL,
        roughness: 0.95,
        metalness: 0.1,
        side: THREE.BackSide, // We are INSIDE the tunnel; render inner faces
      }),
    [],
  );

  const ribMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_RIB,
        roughness: 0.9,
        metalness: 0.2,
      }),
    [],
  );

  // --- Geometries ---

  // Side walls (tall thin boxes along the segment length)
  const sideWallGeo = useMemo(
    () => new THREE.PlaneGeometry(SEGMENT_LENGTH, TUNNEL_HEIGHT),
    [],
  );

  // Floor and ceiling (wide planes)
  const floorCeilGeo = useMemo(
    () => new THREE.PlaneGeometry(TUNNEL_WIDTH, SEGMENT_LENGTH),
    [],
  );

  // Rib geometry -- a rectangular torus-like frame.
  // We approximate it with four thin boxes forming a rectangle on the
  // inner surface of the tunnel cross-section.
  const ribHorizontalGeo = useMemo(
    () => new THREE.BoxGeometry(TUNNEL_WIDTH - RIB_INSET * 2, RIB_INSET, RIB_DEPTH),
    [],
  );

  const ribVerticalGeo = useMemo(
    () => new THREE.BoxGeometry(RIB_INSET, TUNNEL_HEIGHT - RIB_INSET * 2, RIB_DEPTH),
    [],
  );

  // --- Compute rib positions for this segment ---
  const ribCount = Math.floor(SEGMENT_LENGTH / RIB_SPACING);

  const ribs = useMemo(() => {
    const elements: React.JSX.Element[] = [];
    const halfSeg = SEGMENT_LENGTH / 2;

    for (let i = 0; i < ribCount; i++) {
      // z position local to the segment group
      const z = -halfSeg + RIB_SPACING * (i + 0.5);
      const halfW = TUNNEL_WIDTH / 2;
      const halfH = TUNNEL_HEIGHT / 2;

      // Top rib bar
      elements.push(
        <mesh
          key={`rib-t-${i}`}
          geometry={ribHorizontalGeo}
          material={ribMaterial}
          position={[0, halfH - RIB_INSET / 2, z]}
        />,
      );
      // Bottom rib bar
      elements.push(
        <mesh
          key={`rib-b-${i}`}
          geometry={ribHorizontalGeo}
          material={ribMaterial}
          position={[0, -halfH + RIB_INSET / 2, z]}
        />,
      );
      // Left rib bar
      elements.push(
        <mesh
          key={`rib-l-${i}`}
          geometry={ribVerticalGeo}
          material={ribMaterial}
          position={[-halfW + RIB_INSET / 2, 0, z]}
        />,
      );
      // Right rib bar
      elements.push(
        <mesh
          key={`rib-r-${i}`}
          geometry={ribVerticalGeo}
          material={ribMaterial}
          position={[halfW - RIB_INSET / 2, 0, z]}
        />,
      );
    }

    return elements;
  }, [ribCount, ribHorizontalGeo, ribVerticalGeo, ribMaterial]);

  // --- Animation: scroll this segment along -Z and wrap ---

  /**
   * Starting z for this segment so all segments tile seamlessly.
   * Segment 0 starts at z = 0, segment 1 at -SEGMENT_LENGTH, etc.
   * The camera sits near z = 0 looking toward -Z.
   */
  const initialZ = -index * SEGMENT_LENGTH + SEGMENT_LENGTH;

  // We store the accumulated offset rather than reading from the ref
  // to avoid floating-point drift over long sessions.
  const offsetRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    offsetRef.current += SCROLL_SPEED;

    // Effective position with wrapping.
    // When a segment scrolls far enough behind the camera (positive Z),
    // we wrap it back to the far end of the tunnel (negative Z).
    let z = initialZ + offsetRef.current;

    // Wrap: keep z within [-TOTAL_LENGTH + SEGMENT_LENGTH, SEGMENT_LENGTH]
    // This ensures segments cycle continuously.
    const wrapThreshold = SEGMENT_LENGTH * 1.5; // a bit past the camera
    if (z > wrapThreshold) {
      // How far past the threshold are we?
      const overshoot = z - wrapThreshold;
      // Reset offset so we jump back by TOTAL_LENGTH
      offsetRef.current -= TOTAL_LENGTH;
      z = wrapThreshold - TOTAL_LENGTH + overshoot;
    }

    groupRef.current.position.z = z;
  });

  const halfH = TUNNEL_HEIGHT / 2;
  const halfW = TUNNEL_WIDTH / 2;

  return (
    <group ref={groupRef} position={[0, halfH, initialZ]}>
      {/* Left wall -- plane facing +X (inward) */}
      <mesh
        geometry={sideWallGeo}
        material={wallMaterial}
        position={[-halfW, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Right wall -- plane facing -X (inward) */}
      <mesh
        geometry={sideWallGeo}
        material={wallMaterial}
        position={[halfW, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Floor */}
      <mesh
        geometry={floorCeilGeo}
        material={wallMaterial}
        position={[0, -halfH, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Ceiling */}
      <mesh
        geometry={floorCeilGeo}
        material={wallMaterial}
        position={[0, halfH, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Support ribs */}
      {ribs}
    </group>
  );
}

// ============================================
// Main export
// ============================================

export interface TunnelEnvironmentProps {
  /** Optional position offset for the entire tunnel group */
  position?: [number, number, number];
  /** Override scroll speed (units per frame). Default 0.4 */
  speed?: number;
}

export default function TunnelEnvironment({
  position = [0, 0, 0],
}: TunnelEnvironmentProps) {
  // Build an array of tiled tunnel segments
  const segments = useMemo(() => {
    const segs: React.JSX.Element[] = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      segs.push(<TunnelSegment key={`seg-${i}`} index={i} />);
    }
    return segs;
  }, []);

  return <group position={position}>{segments}</group>;
}
