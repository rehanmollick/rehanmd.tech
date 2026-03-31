"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// TrainInterior - Procedural subway car geometry
// Viewed from a seated passenger POV looking
// toward the windows on the right wall.
// ============================================

// --- Constants ---

/** Full interior dimensions (in world units) */
const CAR_LENGTH = 20;
const CAR_WIDTH = 4;
const CAR_HEIGHT = 3;

/** Wall thickness so geometry has visible depth */
const WALL_THICKNESS = 0.15;

/** Window layout along the right wall */
const WINDOW_COUNT = 4;
const WINDOW_WIDTH = 2.2;
const WINDOW_HEIGHT = 1.6;
/** Vertical offset of window centre from floor */
const WINDOW_Y = 1.6;
/** Spacing between window centres */
const WINDOW_SPACING = CAR_LENGTH / (WINDOW_COUNT + 1);

/** Seat dimensions */
const SEAT_WIDTH = 0.6;
const SEAT_DEPTH = 0.5;
const SEAT_HEIGHT = 0.5;
const SEAT_BACK_HEIGHT = 0.7;
const SEAT_Y = SEAT_HEIGHT / 2; // bottom of seat at floor level
const SEATS_PER_SIDE = 6;

/** Pole dimensions */
const POLE_RADIUS = 0.03;
const POLE_COUNT = 3;

/** Ceiling light strip */
const LIGHT_LENGTH = 3;
const LIGHT_WIDTH = 0.25;

// --- Reusable colors (created once, never in render) ---
const COLOR_WALL = new THREE.Color("#222222");
const COLOR_FLOOR = new THREE.Color("#141414");
const COLOR_SEAT = new THREE.Color("#252525");
const COLOR_POLE = new THREE.Color("#3a3a3a");
const COLOR_LIGHT = new THREE.Color("#FFE4CC");
const COLOR_WINDOW_FRAME = new THREE.Color("#222222");

// --- Helper: build the right wall with window cutouts via CSG-like shape extrusion ---

/**
 * Creates a right-wall geometry with rectangular window holes.
 *
 * Because Three.js BoxGeometry cannot have holes, we build the wall from
 * five horizontal strips and the narrow columns between windows using a
 * merged BufferGeometry approach (via ShapeGeometry extruded, but simpler:
 * we use a THREE.Shape with holes and ExtrudeGeometry).
 */
function createRightWallShape(): THREE.Shape {
  const halfLen = CAR_LENGTH / 2;
  const shape = new THREE.Shape();

  // Outer rectangle of the wall (viewed from inside, looking at +x face)
  // We draw in the ZY plane: z is horizontal (along car length), y is vertical
  shape.moveTo(-halfLen, 0);
  shape.lineTo(halfLen, 0);
  shape.lineTo(halfLen, CAR_HEIGHT);
  shape.lineTo(-halfLen, CAR_HEIGHT);
  shape.lineTo(-halfLen, 0);

  // Cut window holes
  for (let i = 0; i < WINDOW_COUNT; i++) {
    const centreZ = -halfLen + WINDOW_SPACING * (i + 1);
    const halfW = WINDOW_WIDTH / 2;
    const halfH = WINDOW_HEIGHT / 2;
    const bottomY = WINDOW_Y - halfH;
    const topY = WINDOW_Y + halfH;

    const hole = new THREE.Path();
    hole.moveTo(centreZ - halfW, bottomY);
    hole.lineTo(centreZ + halfW, bottomY);
    hole.lineTo(centreZ + halfW, topY);
    hole.lineTo(centreZ - halfW, topY);
    hole.lineTo(centreZ - halfW, bottomY);
    shape.holes.push(hole);
  }

  return shape;
}

// --- Sub-components ---

/** Floor plane */
function Floor() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_FLOOR,
        roughness: 0.6,
        metalness: 0.4,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(CAR_WIDTH, CAR_LENGTH),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    />
  );
}

/** Left wall (solid, no windows) */
function LeftWall() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WALL,
        roughness: 0.8,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.BoxGeometry(WALL_THICKNESS, CAR_HEIGHT, CAR_LENGTH),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[-CAR_WIDTH / 2, CAR_HEIGHT / 2, 0]}
    />
  );
}

/** Right wall with window cutouts (extruded shape) */
function RightWall() {
  const geometry = useMemo(() => {
    const shape = createRightWallShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: WALL_THICKNESS,
      bevelEnabled: false,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // The extrude produces geometry in the ZY plane extending along X.
    // We need to position it so X = CAR_WIDTH/2
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WALL,
        roughness: 0.8,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // ExtrudeGeometry was drawn in the ZY plane (z = along car, y = up).
  // The extrusion direction is the local +z axis, which we want to align
  // with the world +x axis (so the wall faces inward).
  // Rotate 90 degrees around Y to swap local z -> world x.
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[CAR_WIDTH / 2 + WALL_THICKNESS, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

/** Window frames -- thin rectangular borders around each cutout */
function WindowFrames() {
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WINDOW_FRAME,
        roughness: 0.7,
        metalness: 0.4,
      }),
    [],
  );

  const frameThickness = 0.06;
  const frameDepth = WALL_THICKNESS + 0.04; // slightly proud of wall

  const halfLen = CAR_LENGTH / 2;

  // Pre-compute frame segment geometries (top/bottom and left/right)
  const hGeo = useMemo(
    () =>
      new THREE.BoxGeometry(
        frameDepth,
        frameThickness,
        WINDOW_WIDTH + frameThickness * 2,
      ),
    [],
  );
  const vGeo = useMemo(
    () =>
      new THREE.BoxGeometry(
        frameDepth,
        WINDOW_HEIGHT + frameThickness * 2,
        frameThickness,
      ),
    [],
  );

  const frames: React.JSX.Element[] = [];

  for (let i = 0; i < WINDOW_COUNT; i++) {
    const centreZ = -halfLen + WINDOW_SPACING * (i + 1);
    const x = CAR_WIDTH / 2 + WALL_THICKNESS / 2;
    const halfH = WINDOW_HEIGHT / 2;

    // Top bar
    frames.push(
      <mesh
        key={`wf-t-${i}`}
        geometry={hGeo}
        material={frameMaterial}
        position={[x, WINDOW_Y + halfH, centreZ]}
      />,
    );
    // Bottom bar
    frames.push(
      <mesh
        key={`wf-b-${i}`}
        geometry={hGeo}
        material={frameMaterial}
        position={[x, WINDOW_Y - halfH, centreZ]}
      />,
    );
    // Left bar
    frames.push(
      <mesh
        key={`wf-l-${i}`}
        geometry={vGeo}
        material={frameMaterial}
        position={[x, WINDOW_Y, centreZ - WINDOW_WIDTH / 2]}
      />,
    );
    // Right bar
    frames.push(
      <mesh
        key={`wf-r-${i}`}
        geometry={vGeo}
        material={frameMaterial}
        position={[x, WINDOW_Y, centreZ + WINDOW_WIDTH / 2]}
      />,
    );
  }

  return <group>{frames}</group>;
}

/** Ceiling -- flat plane at the top */
function Ceiling() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WALL,
        roughness: 0.85,
        metalness: 0.25,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(CAR_WIDTH, CAR_LENGTH),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, CAR_HEIGHT, 0]}
    />
  );
}

/** Rows of seats on both sides of the car */
function Seats() {
  const seatMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_SEAT,
        roughness: 0.95,
        metalness: 0.0,
      }),
    [],
  );

  const seatGeo = useMemo(
    () => new THREE.BoxGeometry(SEAT_DEPTH, SEAT_HEIGHT, SEAT_WIDTH),
    [],
  );

  const backGeo = useMemo(
    () =>
      new THREE.BoxGeometry(
        WALL_THICKNESS,
        SEAT_BACK_HEIGHT,
        SEAT_WIDTH,
      ),
    [],
  );

  const seats: React.JSX.Element[] = [];

  const halfLen = CAR_LENGTH / 2;
  const spacing = (CAR_LENGTH - 1) / (SEATS_PER_SIDE - 1);

  // Left-side seats (against left wall)
  const leftX = -CAR_WIDTH / 2 + SEAT_DEPTH / 2 + 0.05;
  for (let i = 0; i < SEATS_PER_SIDE; i++) {
    const z = -halfLen + 0.5 + spacing * i;
    seats.push(
      <group key={`seat-l-${i}`} position={[leftX, 0, z]}>
        {/* Seat cushion */}
        <mesh
          geometry={seatGeo}
          material={seatMaterial}
          position={[0, SEAT_Y, 0]}
        />
        {/* Seat back */}
        <mesh
          geometry={backGeo}
          material={seatMaterial}
          position={[
            -SEAT_DEPTH / 2 + WALL_THICKNESS / 2,
            SEAT_HEIGHT + SEAT_BACK_HEIGHT / 2,
            0,
          ]}
        />
      </group>,
    );
  }

  // Right-side seats (against right/window wall)
  const rightX = CAR_WIDTH / 2 - SEAT_DEPTH / 2 - 0.05;
  for (let i = 0; i < SEATS_PER_SIDE; i++) {
    const z = -halfLen + 0.5 + spacing * i;
    seats.push(
      <group key={`seat-r-${i}`} position={[rightX, 0, z]}>
        <mesh
          geometry={seatGeo}
          material={seatMaterial}
          position={[0, SEAT_Y, 0]}
        />
        <mesh
          geometry={backGeo}
          material={seatMaterial}
          position={[
            SEAT_DEPTH / 2 - WALL_THICKNESS / 2,
            SEAT_HEIGHT + SEAT_BACK_HEIGHT / 2,
            0,
          ]}
        />
      </group>,
    );
  }

  return <group>{seats}</group>;
}

/** Vertical grab poles spaced evenly along the car */
function Poles() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_POLE,
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.CylinderGeometry(POLE_RADIUS, POLE_RADIUS, CAR_HEIGHT, 12),
    [],
  );

  const poles: React.JSX.Element[] = [];
  const halfLen = CAR_LENGTH / 2;
  const spacing = CAR_LENGTH / (POLE_COUNT + 1);

  for (let i = 0; i < POLE_COUNT; i++) {
    const z = -halfLen + spacing * (i + 1);
    // Poles stand between the seat rows, slightly toward the centre
    poles.push(
      <mesh
        key={`pole-${i}`}
        geometry={geometry}
        material={material}
        position={[0, CAR_HEIGHT / 2, z]}
      />,
    );
  }

  return <group>{poles}</group>;
}

/**
 * Ceiling-mounted rectangular light strips.
 * Uses an emissive material with a flicker effect driven by useFrame.
 * The flicker is a subtle sinusoidal variation between 0.8 and 1.0
 * intensity, with a faster irregular component to simulate fluorescent
 * tube instability.
 */
function CeilingLights() {
  const lightRef1 = useRef<THREE.Mesh>(null);
  const lightRef2 = useRef<THREE.Mesh>(null);

  const material1 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_LIGHT,
        emissive: COLOR_LIGHT,
        emissiveIntensity: 2.5,
        roughness: 0.2,
        metalness: 0.0,
        toneMapped: false,
      }),
    [],
  );

  const material2 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_LIGHT,
        emissive: COLOR_LIGHT,
        emissiveIntensity: 2.5,
        roughness: 0.2,
        metalness: 0.0,
        toneMapped: false,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(LIGHT_WIDTH, LIGHT_LENGTH),
    [],
  );

  // Flicker animation -- uses pre-allocated math to avoid GC pressure.
  // Two overlapping sine waves at different frequencies create a natural
  // fluorescent-tube flicker pattern.
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow sway (breathing)  +  fast irregular flicker
    const flicker1 =
      0.9 + 0.1 * Math.sin(t * 2.3) * Math.sin(t * 7.1 + 0.5);
    const flicker2 =
      0.9 + 0.1 * Math.sin(t * 1.9 + 1.0) * Math.sin(t * 8.3 + 2.0);

    material1.emissiveIntensity = flicker1;
    material1.opacity = flicker1;

    material2.emissiveIntensity = flicker2;
    material2.opacity = flicker2;
  });

  const y = CAR_HEIGHT - 0.01; // just below ceiling

  return (
    <group>
      {/* Front light strip */}
      <mesh
        ref={lightRef1}
        geometry={geometry}
        material={material1}
        position={[0, y, -CAR_LENGTH / 6]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Rear light strip */}
      <mesh
        ref={lightRef2}
        geometry={geometry}
        material={material2}
        position={[0, y, CAR_LENGTH / 6]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

/** Back wall (solid, closes the rear end of the car) */
function BackWall() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WALL,
        roughness: 0.8,
        metalness: 0.3,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.BoxGeometry(CAR_WIDTH, CAR_HEIGHT, WALL_THICKNESS),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, CAR_HEIGHT / 2, -CAR_LENGTH / 2]}
    />
  );
}

/** Front wall (solid, closes the front end) */
function FrontWall() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_WALL,
        roughness: 0.8,
        metalness: 0.3,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.BoxGeometry(CAR_WIDTH, CAR_HEIGHT, WALL_THICKNESS),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, CAR_HEIGHT / 2, CAR_LENGTH / 2]}
    />
  );
}

// ============================================
// Main export
// ============================================

export interface TrainInteriorProps {
  /** Optional position offset for the entire train group */
  position?: [number, number, number];
}

export default function TrainInterior({
  position = [0, 0, 0],
}: TrainInteriorProps) {
  return (
    <group position={position}>
      <Floor />
      <LeftWall />
      <RightWall />
      <Ceiling />
      <BackWall />
      <FrontWall />
      <WindowFrames />
      <Seats />
      <Poles />
      <CeilingLights />
    </group>
  );
}
