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
const C_WALL = new THREE.Color("#2a2a2a");
const C_FLOOR = new THREE.Color("#1e1e1e");
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
const C_RUBBER = new THREE.Color("#0e0e0e");
const C_KICK = new THREE.Color("#2a2a2a");
const C_HEATER = new THREE.Color("#1a1a1a");
const C_MAP_BG = new THREE.Color("#e8e4d8");
const C_MAP_FRAME = new THREE.Color("#3a3a3a");
const C_DOOR_GLASS = new THREE.Color("#1e2e3e");
const C_HANDRAIL = new THREE.Color("#555555");
const C_FLOOR_STRIPE = new THREE.Color("#BF5700");

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
  // Worn rubber floor — matte dark surface
  const mat = useMemo(() => stdMat(C_FLOOR, 0.85, 0.05), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(CAR_WIDTH, CAR_LENGTH), []);
  // Center aisle stripe (subtle worn path)
  const stripeMat = useMemo(() => stdMat(new THREE.Color("#1a1a1a"), 0.5, 0.2), []);
  const stripeGeo = useMemo(() => new THREE.PlaneGeometry(1.2, CAR_LENGTH), []);
  return (
    <group>
      <mesh geometry={geo} material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow />
      <mesh geometry={stripeGeo} material={stripeMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} />
    </group>
  );
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
    () => new THREE.MeshStandardMaterial({
      color: C_GLASS, transparent: true, opacity: 0.15,
      roughness: 0.1, metalness: 0.3, side: THREE.DoubleSide,
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
 * Continuous bench seats on both walls — molded plastic style like real
 * subway seats. Seat base with slight angle, contoured backrest, and
 * metal seat divider armrests between positions.
 */
function Seats() {
  // Seat body: dark blue-gray like real transit seats
  const seatColor = new THREE.Color("#1e2025");
  const sMat = useMemo(() => stdMat(seatColor, 0.92, 0.02), []);
  // Seat underside/support: darker
  const supportMat = useMemo(() => stdMat(new THREE.Color("#1a1a1a"), 0.9, 0.1), []);
  const dMat = useMemo(() => stdMat(C_POLE, 0.25, 0.85), []);

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
  const divGeo = useMemo(() => new THREE.BoxGeometry(0.02, 0.2, 0.35), []);

  for (const sd of sides) {
    const bx = sd.sign * (CAR_WIDTH / 2 - BENCH_D / 2 - 0.05);
    for (let s = 0; s < segs.length; s++) {
      const [z0, z1] = segs[s];
      const len = z1 - z0;
      if (len <= 0.2) continue;
      const zc = (z0 + z1) / 2;

      // Seat cushion — slightly angled back
      const cushGeo = new THREE.BoxGeometry(BENCH_D, BENCH_H, len);
      els.push(<mesh key={`bn-${sd.lbl}${s}`} geometry={cushGeo} material={sMat} position={[bx, BENCH_H / 2, zc]} />);

      // Support bracket under seat
      const supGeo = new THREE.BoxGeometry(BENCH_D - 0.1, 0.04, len - 0.1);
      els.push(<mesh key={`sp-${sd.lbl}${s}`} geometry={supGeo} material={supportMat} position={[bx, 0.02, zc]} />);

      // Backrest — thicker, taller
      const backGeo = new THREE.BoxGeometry(BACK_T + 0.02, BACK_H, len);
      els.push(<mesh key={`bk-${sd.lbl}${s}`} geometry={backGeo} material={sMat} position={[bx + sd.backOff, BENCH_H + BACK_H / 2, zc]} />);

      // Rounded top cap on backrest
      const capGeo = new THREE.CylinderGeometry(BACK_T / 2 + 0.01, BACK_T / 2 + 0.01, len, 8, 1, false, 0, Math.PI);
      els.push(
        <mesh key={`ch-${sd.lbl}${s}`} geometry={capGeo} material={sMat}
          position={[bx + sd.backOff, BENCH_H + BACK_H, zc]}
          rotation={[Math.PI / 2, 0, sd.sign > 0 ? Math.PI : 0]} />,
      );

      // Metal armrest dividers between seat positions
      const seatWidth = 0.55;
      const seatCount = Math.floor(len / seatWidth);
      if (seatCount > 1) {
        const actualSpacing = len / seatCount;
        for (let d = 1; d < seatCount; d++) {
          els.push(
            <mesh key={`dv-${sd.lbl}${s}-${d}`} geometry={divGeo} material={dMat}
              position={[bx, BENCH_H + 0.1, z0 + actualSpacing * d]} />,
          );
        }
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

  // Vertical poles next to each door (not center aisle — avoids blocking POV)
  const doorPoleZs = [DOOR_ZS[0] - 0.8, DOOR_ZS[0] + 0.8, DOOR_ZS[1] - 0.8, DOOR_ZS[1] + 0.8];
  for (let i = 0; i < doorPoleZs.length; i++) {
    els.push(<mesh key={`p${i}`} geometry={pGeo} material={mat} position={[0.4, CAR_HEIGHT / 2, doorPoleZs[i]]} />);
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

/** Rubber safety strips along floor edges where walls meet floor */
function FloorEdgeStrips() {
  const mat = useMemo(() => stdMat(C_RUBBER, 0.95, 0.0), []);
  const geo = useMemo(() => new THREE.BoxGeometry(0.08, 0.02, CAR_LENGTH), []);
  return (
    <group>
      <mesh geometry={geo} material={mat} position={[-CAR_WIDTH / 2 + 0.04, 0.01, 0]} />
      <mesh geometry={geo} material={mat} position={[CAR_WIDTH / 2 - 0.04, 0.01, 0]} />
    </group>
  );
}

/** Subtle wall panel seam lines — vertical grooves every ~2m along both walls */
function WallPanelSeams() {
  const mat = useMemo(() => stdMat(new THREE.Color("#1a1a1a"), 0.9, 0.2), []);
  const geo = useMemo(() => new THREE.BoxGeometry(0.005, CAR_HEIGHT - 0.2, 0.005), []);
  const seams: React.JSX.Element[] = [];
  const spacing = 2.0;
  const count = Math.floor(CAR_LENGTH / spacing);

  for (let i = 1; i < count; i++) {
    const z = -CAR_LENGTH / 2 + spacing * i;
    // Left wall seams
    seams.push(
      <mesh key={`sl${i}`} geometry={geo} material={mat}
        position={[-CAR_WIDTH / 2 + 0.01, CAR_HEIGHT / 2, z]} />,
    );
    // Right wall seams (skip where windows are)
    const h = CAR_LENGTH / 2;
    let blocked = false;
    for (let w = 0; w < WIN_COUNT; w++) {
      const wz = -h + WIN_SPACE * (w + 1);
      if (Math.abs(z - wz) < WIN_W / 2 + 0.1) { blocked = true; break; }
    }
    if (!blocked) {
      seams.push(
        <mesh key={`sr${i}`} geometry={geo} material={mat}
          position={[CAR_WIDTH / 2 - 0.01, CAR_HEIGHT / 2, z]} />,
      );
    }
  }
  return <group>{seams}</group>;
}

/** Stainless steel kick plates under seats — protects wall from shoe scuffs */
function KickPlates() {
  const mat = useMemo(() => stdMat(C_KICK, 0.4, 0.6), []);
  const dHalf = DOOR_W / 2 + 0.2;
  const segs: [number, number][] = [
    [-CAR_LENGTH / 2 + 0.3, DOOR_ZS[0] - dHalf],
    [DOOR_ZS[0] + dHalf, DOOR_ZS[1] - dHalf],
    [DOOR_ZS[1] + dHalf, CAR_LENGTH / 2 - 0.3],
  ];
  const els: React.JSX.Element[] = [];
  for (const side of [-1, 1]) {
    for (let s = 0; s < segs.length; s++) {
      const [z0, z1] = segs[s];
      const len = z1 - z0;
      if (len <= 0.2) continue;
      const geo = new THREE.BoxGeometry(0.005, 0.2, len);
      els.push(
        <mesh key={`kp${side}${s}`} geometry={geo} material={mat}
          position={[side * (CAR_WIDTH / 2 - 0.003), 0.1, (z0 + z1) / 2]} />,
      );
    }
  }
  return <group>{els}</group>;
}

/** Under-seat heater/vent covers — perforated metal grilles */
function UnderSeatHeaters() {
  const mat = useMemo(() => stdMat(C_HEATER, 0.7, 0.4), []);
  const dHalf = DOOR_W / 2 + 0.2;
  const segs: [number, number][] = [
    [-CAR_LENGTH / 2 + 0.3, DOOR_ZS[0] - dHalf],
    [DOOR_ZS[0] + dHalf, DOOR_ZS[1] - dHalf],
    [DOOR_ZS[1] + dHalf, CAR_LENGTH / 2 - 0.3],
  ];
  const els: React.JSX.Element[] = [];
  for (const side of [-1, 1]) {
    for (let s = 0; s < segs.length; s++) {
      const [z0, z1] = segs[s];
      const len = z1 - z0;
      if (len <= 0.5) continue;
      const geo = new THREE.BoxGeometry(BENCH_D - 0.15, 0.12, len - 0.2);
      const bx = side * (CAR_WIDTH / 2 - BENCH_D / 2 - 0.05);
      els.push(
        <mesh key={`ht${side}${s}`} geometry={geo} material={mat}
          position={[bx, 0.06, (z0 + z1) / 2]} />,
      );
    }
  }
  return <group>{els}</group>;
}

/** Small glass panels in the upper portion of each door */
function DoorWindows() {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: C_DOOR_GLASS, transparent: true, opacity: 0.2,
      roughness: 0.05, metalness: 0.2, side: THREE.DoubleSide,
    }),
    [],
  );
  const geo = useMemo(() => new THREE.PlaneGeometry(0.4, 0.6), []);
  const els: React.JSX.Element[] = [];
  const sideXs = [-CAR_WIDTH / 2, CAR_WIDTH / 2 + WALL / 2];
  for (let sx = 0; sx < sideXs.length; sx++) {
    for (let d = 0; d < DOOR_ZS.length; d++) {
      const pw = (DOOR_W - DOOR_GAP) / 2;
      const off = pw / 2 + DOOR_GAP / 2;
      const wy = DOOR_H - 0.5;
      els.push(
        <mesh key={`dw${sx}${d}l`} geometry={geo} material={mat}
          position={[sideXs[sx], wy, DOOR_ZS[d] - off]}
          rotation={[0, Math.PI / 2, 0]} />,
        <mesh key={`dw${sx}${d}r`} geometry={geo} material={mat}
          position={[sideXs[sx], wy, DOOR_ZS[d] + off]}
          rotation={[0, Math.PI / 2, 0]} />,
      );
    }
  }
  return <group>{els}</group>;
}

/** Route map / system map frame on the left wall above seats — like real NYC subway */
function RouteMapFrame() {
  const frameMat = useMemo(() => stdMat(C_MAP_FRAME, 0.3, 0.7), []);
  const mapMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: C_MAP_BG, roughness: 0.9, metalness: 0.0,
      emissive: C_MAP_BG, emissiveIntensity: 0.03,
    }),
    [],
  );

  const mapW = 1.6;
  const mapH = 0.5;
  const ft = 0.02;
  const x = -CAR_WIDTH / 2 + 0.005;
  const y = 2.0;

  const mapGeo = useMemo(() => new THREE.PlaneGeometry(mapH, mapW), []);
  const hGeo = useMemo(() => new THREE.BoxGeometry(0.008, ft, mapW + ft * 2), []);
  const vGeo = useMemo(() => new THREE.BoxGeometry(0.008, mapH + ft * 2, ft), []);

  return (
    <group position={[x, y, 1.5]}>
      <mesh geometry={mapGeo} material={mapMat} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={hGeo} material={frameMat} position={[0, mapH / 2 + ft / 2, 0]} />
      <mesh geometry={hGeo} material={frameMat} position={[0, -mapH / 2 - ft / 2, 0]} />
      <mesh geometry={vGeo} material={frameMat} position={[0, 0, -mapW / 2 - ft / 2]} />
      <mesh geometry={vGeo} material={frameMat} position={[0, 0, mapW / 2 + ft / 2]} />
    </group>
  );
}

/** Horizontal grab bars near doors — short bars passengers hold when standing near exits */
function DoorGrabBars() {
  const mat = useMemo(() => stdMat(C_HANDRAIL, 0.15, 0.9), []);
  const barGeo = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), []);
  const mountGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8), []);

  const els: React.JSX.Element[] = [];
  for (let d = 0; d < DOOR_ZS.length; d++) {
    for (const side of [-1, 1]) {
      const z = DOOR_ZS[d] + side * (DOOR_W / 2 + 0.15);
      const x = -CAR_WIDTH / 2 + 0.01;
      // Vertical bar next to door on left wall
      els.push(
        <mesh key={`dgb${d}${side}`} geometry={barGeo} material={mat}
          position={[x, DOOR_H - 0.4, z]} />,
      );
      // Mount points
      els.push(
        <mesh key={`dgm${d}${side}t`} geometry={mountGeo} material={mat}
          position={[x, DOOR_H - 0.15, z]} rotation={[0, 0, Math.PI / 2]} />,
        <mesh key={`dgm${d}${side}b`} geometry={mountGeo} material={mat}
          position={[x, DOOR_H - 0.65, z]} rotation={[0, 0, Math.PI / 2]} />,
      );
    }
  }
  return <group>{els}</group>;
}

/** Yellow safety stripe along floor edge near doors */
function DoorSafetyStripes() {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c4a800"), roughness: 0.9, metalness: 0.0,
      emissive: new THREE.Color("#c4a800"), emissiveIntensity: 0.05,
    }),
    [],
  );
  const geo = useMemo(() => new THREE.BoxGeometry(CAR_WIDTH - 0.4, 0.003, 0.08), []);
  const els: React.JSX.Element[] = [];
  for (let d = 0; d < DOOR_ZS.length; d++) {
    for (const off of [-DOOR_W / 2 - 0.06, DOOR_W / 2 + 0.06]) {
      els.push(
        <mesh key={`ds${d}${off}`} geometry={geo} material={mat}
          position={[0, 0.002, DOOR_ZS[d] + off]} />,
      );
    }
  }
  return <group>{els}</group>;
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
      <DoorWindows />
      <DoorGrabBars />
      <DoorSafetyStripes />
      <CeilingLights />
      <EmergencySignage />
      <FloorEdgeStrips />
      <WallPanelSeams />
      <RouteMapFrame />
    </group>
  );
}
