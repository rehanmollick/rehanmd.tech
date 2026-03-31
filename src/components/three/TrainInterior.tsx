"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// TrainInterior - Procedural subway car geometry
// Seated passenger POV looking toward windows on
// the right wall. Features: continuous bench seats,
// overhead grab bars with strap loops, recessed
// doors, ceiling details, window glass, and
// flickering fluorescent lights.
// ============================================

// --- Dimensions ---
const CAR_LENGTH = 20;
const CAR_WIDTH = 4;
const CAR_HEIGHT = 3;
const WALL = 0.15; // wall thickness

// Windows (right wall)
const WIN_COUNT = 4;
const WIN_W = 2.2;
const WIN_H = 1.6;
const WIN_Y = 1.6;
const WIN_SPACE = CAR_LENGTH / (WIN_COUNT + 1);

// Bench seats
const BENCH_D = 0.5;
const BENCH_H = 0.45;
const BACK_H = 0.65;
const BACK_T = 0.08;

// Poles & bars
const POLE_R = 0.03;
const BAR_R = 0.02;
const BAR_Y = 2.3;
const BAR_X = 0.6;

// Lights
const LIGHT_LEN = 5;
const LIGHT_W = 0.25;

// Doors
const DOOR_W = 1.2;
const DOOR_H = 2.4;
const DOOR_GAP = 0.02;
const DOOR_ZS = [-CAR_LENGTH / 4, CAR_LENGTH / 4];

// --- Colors (allocated once) ---
const C_WALL = new THREE.Color("#222222");
const C_FLOOR = new THREE.Color("#181818");
const C_SEAT = new THREE.Color("#252525");
const C_POLE = new THREE.Color("#4a4a4a");
const C_LIGHT = new THREE.Color("#F0E8DD");
const C_FRAME = new THREE.Color("#222222");
const C_DOOR = new THREE.Color("#1a1a1a");
const C_GASKET = new THREE.Color("#0a0a0a");
const C_PANEL = new THREE.Color("#1c1c1c");
const C_CONDUIT = new THREE.Color("#1e1e1e");
const C_VENT = new THREE.Color("#151515");
const C_EMERG = new THREE.Color("#CC0000");
const C_GLASS = new THREE.Color("#1a2a3a");

// --- Material factory helpers ---
const stdMat = (c: THREE.Color, r: number, m: number, opts?: Partial<THREE.MeshStandardMaterialParameters>) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...opts });

// --- Right wall shape with window cutouts ---
function createRightWallShape(): THREE.Shape {
  const h = CAR_LENGTH / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-h, 0);
  shape.lineTo(h, 0);
  shape.lineTo(h, CAR_HEIGHT);
  shape.lineTo(-h, CAR_HEIGHT);
  shape.lineTo(-h, 0);

  for (let i = 0; i < WIN_COUNT; i++) {
    const cz = -h + WIN_SPACE * (i + 1);
    const hw = WIN_W / 2, hh = WIN_H / 2;
    const hole = new THREE.Path();
    hole.moveTo(cz - hw, WIN_Y - hh);
    hole.lineTo(cz + hw, WIN_Y - hh);
    hole.lineTo(cz + hw, WIN_Y + hh);
    hole.lineTo(cz - hw, WIN_Y + hh);
    hole.lineTo(cz - hw, WIN_Y - hh);
    shape.holes.push(hole);
  }
  return shape;
}

// --- Sub-components ---

function Floor() {
  const mat = useMemo(() => stdMat(C_FLOOR, 0.7, 0.1), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(CAR_WIDTH, CAR_LENGTH), []);
  return <mesh geometry={geo} material={mat} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />;
}

function LeftWall() {
  const mat = useMemo(() => stdMat(C_WALL, 0.8, 0.3, { side: THREE.DoubleSide }), []);
  const geo = useMemo(() => new THREE.BoxGeometry(WALL, CAR_HEIGHT, CAR_LENGTH), []);
  return <mesh geometry={geo} material={mat} position={[-CAR_WIDTH / 2, CAR_HEIGHT / 2, 0]} />;
}

function RightWall() {
  const geo = useMemo(() => {
    const shape = createRightWallShape();
    return new THREE.ExtrudeGeometry(shape, { depth: WALL, bevelEnabled: false });
  }, []);
  const mat = useMemo(() => stdMat(C_WALL, 0.8, 0.3, { side: THREE.DoubleSide }), []);
  return (
    <mesh
      geometry={geo}
      material={mat}
      position={[CAR_WIDTH / 2 + WALL, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

/** Tinted glass panes in each window opening */
function WindowGlass() {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: C_GLASS, transmission: 0.85, roughness: 0.1,
      metalness: 0.1, thickness: 0.05, transparent: true, side: THREE.DoubleSide,
    }),
    [],
  );
  const geo = useMemo(() => new THREE.PlaneGeometry(WIN_H, WIN_W), []);
  const h = CAR_LENGTH / 2;
  const x = CAR_WIDTH / 2 + WALL / 2;
  const panes = [];
  for (let i = 0; i < WIN_COUNT; i++) {
    panes.push(
      <mesh key={i} geometry={geo} material={mat}
        position={[x, WIN_Y, -h + WIN_SPACE * (i + 1)]}
        rotation={[0, Math.PI / 2, 0]} />,
    );
  }
  return <group>{panes}</group>;
}

function WindowFrames() {
  const mat = useMemo(() => stdMat(C_FRAME, 0.7, 0.4), []);
  const ft = 0.06, fd = WALL + 0.04;
  const hGeo = useMemo(() => new THREE.BoxGeometry(fd, ft, WIN_W + ft * 2), []);
  const vGeo = useMemo(() => new THREE.BoxGeometry(fd, WIN_H + ft * 2, ft), []);

  const frames: React.JSX.Element[] = [];
  const h = CAR_LENGTH / 2;
  for (let i = 0; i < WIN_COUNT; i++) {
    const cz = -h + WIN_SPACE * (i + 1);
    const x = CAR_WIDTH / 2 + WALL / 2;
    const hh = WIN_H / 2;
    frames.push(
      <mesh key={`t${i}`} geometry={hGeo} material={mat} position={[x, WIN_Y + hh, cz]} />,
      <mesh key={`b${i}`} geometry={hGeo} material={mat} position={[x, WIN_Y - hh, cz]} />,
      <mesh key={`l${i}`} geometry={vGeo} material={mat} position={[x, WIN_Y, cz - WIN_W / 2]} />,
      <mesh key={`r${i}`} geometry={vGeo} material={mat} position={[x, WIN_Y, cz + WIN_W / 2]} />,
    );
  }
  return <group>{frames}</group>;
}

function Ceiling() {
  const mat = useMemo(() => stdMat(C_WALL, 0.85, 0.25, { side: THREE.DoubleSide }), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(CAR_WIDTH, CAR_LENGTH), []);
  return <mesh geometry={geo} material={mat} rotation={[Math.PI / 2, 0, 0]} position={[0, CAR_HEIGHT, 0]} />;
}

/** Recessed panels, cable conduit, ventilation grate */
function CeilingDetails() {
  const pMat = useMemo(() => stdMat(C_PANEL, 0.9, 0.1), []);
  const cMat = useMemo(() => stdMat(C_CONDUIT, 0.8, 0.2), []);
  const vMat = useMemo(() => stdMat(C_VENT, 0.95, 0.05), []);
  const pGeo = useMemo(() => new THREE.BoxGeometry(1.8, 0.03, 4.5), []);
  const cGeo = useMemo(() => new THREE.BoxGeometry(0.12, 0.08, CAR_LENGTH - 0.5), []);
  const vGeo = useMemo(() => new THREE.BoxGeometry(0.8, 0.02, 0.4), []);
  const y = CAR_HEIGHT - 0.02;

  return (
    <group>
      {[-CAR_LENGTH / 3, 0, CAR_LENGTH / 3].map((z, i) => (
        <mesh key={i} geometry={pGeo} material={pMat} position={[0, y, z]} />
      ))}
      <mesh geometry={cGeo} material={cMat} position={[CAR_WIDTH / 2 - 0.2, CAR_HEIGHT - 0.04, 0]} />
      <mesh geometry={vGeo} material={vMat} position={[-0.6, CAR_HEIGHT - 0.015, 2]} />
    </group>
  );
}

/**
 * Continuous bench seats on both walls with backrests, chamfered top
 * edges, and seat divider bars. Benches break around door openings.
 */
function Seats() {
  const sMat = useMemo(() => stdMat(C_SEAT, 0.95, 0.0), []);
  const dMat = useMemo(() => stdMat(C_POLE, 0.3, 0.8), []);

  // Bench segments between doors: [zStart, zEnd]
  const dHalf = DOOR_W / 2 + 0.2;
  const segs: [number, number][] = [
    [-CAR_LENGTH / 2 + 0.3, DOOR_ZS[0] - dHalf],
    [DOOR_ZS[0] + dHalf, DOOR_ZS[1] - dHalf],
    [DOOR_ZS[1] + dHalf, CAR_LENGTH / 2 - 0.3],
  ];

  const sides = [
    { sign: -1, backOff: -BENCH_D / 2 + BACK_T / 2, lbl: "l" },
    { sign: 1, backOff: BENCH_D / 2 - BACK_T / 2, lbl: "r" },
  ];

  const els: React.JSX.Element[] = [];
  const divGeo = new THREE.BoxGeometry(BENCH_D * 0.6, 0.12, 0.02);
  const chamR = BACK_T / 2;

  for (const sd of sides) {
    const bx = sd.sign * (CAR_WIDTH / 2 - BENCH_D / 2 - 0.05);
    for (let s = 0; s < segs.length; s++) {
      const [z0, z1] = segs[s];
      const len = z1 - z0;
      if (len <= 0.2) continue;
      const zc = (z0 + z1) / 2;

      // Bench cushion
      els.push(<mesh key={`bn-${sd.lbl}${s}`} geometry={new THREE.BoxGeometry(BENCH_D, BENCH_H, len)} material={sMat} position={[bx, BENCH_H / 2, zc]} />);

      // Backrest
      els.push(<mesh key={`bk-${sd.lbl}${s}`} geometry={new THREE.BoxGeometry(BACK_T, BACK_H, len)} material={sMat} position={[bx + sd.backOff, BENCH_H + BACK_H / 2, zc]} />);

      // Chamfered top edge (half-cylinder cap)
      const chGeo = new THREE.CylinderGeometry(chamR, chamR, len, 8, 1, false, 0, Math.PI);
      els.push(
        <mesh key={`ch-${sd.lbl}${s}`} geometry={chGeo} material={sMat}
          position={[bx + sd.backOff, BENCH_H + BACK_H, zc]}
          rotation={[Math.PI / 2, 0, sd.sign > 0 ? Math.PI : 0]} />,
      );

      // Seat dividers
      const dc = Math.max(0, Math.floor(len / 0.7) - 1);
      const ds = len / (dc + 1);
      for (let d = 1; d <= dc; d++) {
        els.push(
          <mesh key={`dv-${sd.lbl}${s}-${d}`} geometry={divGeo} material={dMat}
            position={[bx, BENCH_H + 0.06, z0 + ds * d]} />,
        );
      }
    }
  }
  return <group>{els}</group>;
}

/** Vertical poles, horizontal grab bars, ceiling connectors, strap loops */
function PolesAndBars() {
  const mat = useMemo(() => stdMat(C_POLE, 0.15, 0.9), []);
  const pGeo = useMemo(() => new THREE.CylinderGeometry(POLE_R, POLE_R, CAR_HEIGHT, 12), []);
  const bGeo = useMemo(() => new THREE.CylinderGeometry(BAR_R, BAR_R, CAR_LENGTH - 2, 10), []);
  const sGeo = useMemo(() => new THREE.TorusGeometry(0.06, 0.012, 8, 16), []);
  const cGeo = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, CAR_HEIGHT - BAR_Y, 6), []);

  const els: React.JSX.Element[] = [];
  const h = CAR_LENGTH / 2;
  const ps = CAR_LENGTH / 4; // pole spacing

  // 3 vertical center poles
  for (let i = 0; i < 3; i++) {
    els.push(<mesh key={`p${i}`} geometry={pGeo} material={mat} position={[0, CAR_HEIGHT / 2, -h + ps * (i + 1)]} />);
  }

  // 2 overhead grab bars with connectors and strap loops
  for (const bx of [-BAR_X, BAR_X]) {
    const bi = bx > 0 ? 1 : 0;
    els.push(<mesh key={`gb${bi}`} geometry={bGeo} material={mat} position={[bx, BAR_Y, 0]} rotation={[Math.PI / 2, 0, 0]} />);

    // Vertical connectors ceiling-to-bar (5 per bar)
    const cSpace = (CAR_LENGTH - 2) / 6;
    const cy = (CAR_HEIGHT + BAR_Y) / 2;
    for (let c = 0; c < 5; c++) {
      els.push(<mesh key={`cn${bi}-${c}`} geometry={cGeo} material={mat} position={[bx, cy, -h + 1 + cSpace * (c + 1)]} />);
    }

    // Hanging strap loops (5 per bar)
    const sSpace = (CAR_LENGTH - 4) / 6;
    for (let s = 0; s < 5; s++) {
      els.push(<mesh key={`st${bi}-${s}`} geometry={sGeo} material={mat} position={[bx, BAR_Y - 0.12, -h + 2 + sSpace * (s + 1)]} />);
    }
  }
  return <group>{els}</group>;
}

/** Recessed double sliding doors on both sides, positioned between windows */
function Doors() {
  const dMat = useMemo(() => stdMat(C_DOOR, 0.75, 0.35), []);
  const gMat = useMemo(() => stdMat(C_GASKET, 0.95, 0.0), []);
  const pw = (DOOR_W - DOOR_GAP) / 2;
  const pGeo = useMemo(() => new THREE.BoxGeometry(WALL - 0.02, DOOR_H, pw), []);
  const gGeo = useMemo(() => new THREE.BoxGeometry(WALL + 0.01, DOOR_H, DOOR_GAP + 0.01), []);

  const els: React.JSX.Element[] = [];
  const sideXs = [
    { x: -CAR_WIDTH / 2, l: "l" },
    { x: CAR_WIDTH / 2 + WALL / 2, l: "r" },
  ];

  for (const side of sideXs) {
    for (let d = 0; d < DOOR_ZS.length; d++) {
      const dz = DOOR_ZS[d], dy = DOOR_H / 2;
      const off = pw / 2 + DOOR_GAP / 2;
      els.push(
        <mesh key={`d${side.l}${d}l`} geometry={pGeo} material={dMat} position={[side.x, dy, dz - off]} />,
        <mesh key={`d${side.l}${d}r`} geometry={pGeo} material={dMat} position={[side.x, dy, dz + off]} />,
        <mesh key={`d${side.l}${d}g`} geometry={gGeo} material={gMat} position={[side.x, dy, dz]} />,
      );
    }
  }
  return <group>{els}</group>;
}

/** Flickering fluorescent ceiling light strips */
function CeilingLights() {
  const m1 = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: C_LIGHT, emissive: C_LIGHT, emissiveIntensity: 2.5,
      roughness: 0.2, metalness: 0.0, toneMapped: false,
    }),
    [],
  );
  const m2 = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: C_LIGHT, emissive: C_LIGHT, emissiveIntensity: 2.5,
      roughness: 0.2, metalness: 0.0, toneMapped: false,
    }),
    [],
  );
  const geo = useMemo(() => new THREE.PlaneGeometry(LIGHT_W, LIGHT_LEN), []);

  // Flicker between intensity 2.0-3.0 using overlapping sine waves
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    m1.emissiveIntensity = 2.5 + 0.5 * Math.sin(t * 2.3) * Math.sin(t * 7.1 + 0.5);
    m2.emissiveIntensity = 2.5 + 0.5 * Math.sin(t * 1.9 + 1.0) * Math.sin(t * 8.3 + 2.0);
  });

  const y = CAR_HEIGHT - 0.01;
  const rx: [number, number, number] = [-Math.PI / 2, 0, 0];
  return (
    <group>
      <mesh geometry={geo} material={m1} position={[0, y, -CAR_LENGTH / 6]} rotation={rx} />
      <mesh geometry={geo} material={m2} position={[0, y, CAR_LENGTH / 6]} rotation={rx} />
    </group>
  );
}

/** Small red emergency signage rectangles near doors */
function EmergencySignage() {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: C_EMERG, emissive: C_EMERG, emissiveIntensity: 0.3,
      roughness: 0.8, metalness: 0.1,
    }),
    [],
  );
  const geo = useMemo(() => new THREE.BoxGeometry(0.01, 0.1, 0.3), []);
  const signs: React.JSX.Element[] = [];
  for (let d = 0; d < DOOR_ZS.length; d++) {
    const zOff = DOOR_ZS[d] + DOOR_W / 2 + 0.3;
    signs.push(
      <mesh key={`el${d}`} geometry={geo} material={mat} position={[-CAR_WIDTH / 2 + 0.01, 2.5, zOff]} />,
      <mesh key={`er${d}`} geometry={geo} material={mat} position={[CAR_WIDTH / 2 - 0.01, 2.5, zOff]} />,
    );
  }
  return <group>{signs}</group>;
}

function EndWall({ z }: { z: number }) {
  const mat = useMemo(() => stdMat(C_WALL, 0.8, 0.3), []);
  const geo = useMemo(() => new THREE.BoxGeometry(CAR_WIDTH, CAR_HEIGHT, WALL), []);
  return <mesh geometry={geo} material={mat} position={[0, CAR_HEIGHT / 2, z]} />;
}

// ============================================
// Main export
// ============================================

export interface TrainInteriorProps {
  position?: [number, number, number];
}

export default function TrainInterior({ position = [0, 0, 0] }: TrainInteriorProps) {
  return (
    <group position={position}>
      <Floor />
      <LeftWall />
      <RightWall />
      <WindowGlass />
      <WindowFrames />
      <Ceiling />
      <CeilingDetails />
      <EndWall z={-CAR_LENGTH / 2} />
      <EndWall z={CAR_LENGTH / 2} />
      <Seats />
      <PolesAndBars />
      <Doors />
      <CeilingLights />
      <EmergencySignage />
    </group>
  );
}
