"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// LEDTicker - Scrolling LED marquee strip
// Positioned above windows on the right wall
// interior of the subway car. Text scrolls
// right-to-left, faces -X toward the camera.
// ============================================

// Train dimensions (must match TrainInterior.tsx)
const CAR_WIDTH = 4;
const CAR_LENGTH = 20;

// Ticker geometry
const TICKER_HEIGHT = 0.15;
const TICKER_LENGTH = 18; // slightly shorter than car
const TICKER_Y = 2.65; // just below ceiling, above windows
// Flush with right wall interior face
const TICKER_X = CAR_WIDTH / 2 - 0.05;

// Text config
const FONT_SIZE = 0.08;
const SCROLL_SPEED = 1.5; // units per second
const TEXT_CONTENT =
  "Md Rehan Mollick \u2014 Software Engineer \u2014 rehanmd.tech \u2014 ";

// Repeat the string enough times so the total text width exceeds
// 2x the panel length, guaranteeing seamless looping. We use two
// text meshes offset by half the total width and reset each when
// it scrolls fully off-screen.
const REPEATED_TEXT = TEXT_CONTENT.repeat(6);

// Colors
const C_ACCENT = new THREE.Color("#BF5700");
const C_PANEL = new THREE.Color("#111111");

export interface LEDTickerProps {
  position?: [number, number, number];
}

export default function LEDTicker({ position = [0, 0, 0] }: LEDTickerProps) {
  const textRefA = useRef<THREE.Mesh>(null);
  const textRefB = useRef<THREE.Mesh>(null);

  // We track the measured text width after troika syncs.
  // Until measured, use a generous estimate.
  const textWidth = useRef<number>(TICKER_LENGTH * 2);

  const panelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_PANEL,
        emissive: C_PANEL,
        emissiveIntensity: 0.1,
        roughness: 0.9,
        metalness: 0.1,
      }),
    [],
  );

  const panelGeo = useMemo(
    () => new THREE.BoxGeometry(0.02, TICKER_HEIGHT, TICKER_LENGTH),
    [],
  );

  // clipRect bounds the text to the panel area.
  // In troika-text local space, the text is laid out along X (width)
  // and Y (height). Since our text faces -X, local Z of the group
  // maps to troika X. We use a generous clip in the scroll axis
  // and a tight clip vertically.
  const halfLen = TICKER_LENGTH / 2;
  const halfH = TICKER_HEIGHT / 2;
  const clipRect: [number, number, number, number] = [
    -halfLen,
    -halfH,
    halfLen,
    halfH,
  ];

  // Callback when troika finishes laying out the text.
  // We read the actual bounding width for precise looping.
  const handleSync = (troika: { textRenderInfo?: { blockBounds?: number[] } }) => {
    if (troika?.textRenderInfo?.blockBounds) {
      const bounds = troika.textRenderInfo.blockBounds;
      // blockBounds = [minX, minY, maxX, maxY]
      const w = bounds[2] - bounds[0];
      if (w > 0) textWidth.current = w;
    }
  };

  // Pre-allocate offset so we never create objects in the hot loop
  const offsetA = useRef(0);
  const offsetB = useRef(0);

  // Initialize B offset to half the text width on first frame
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!textRefA.current || !textRefB.current) return;

    const w = textWidth.current;

    // On first valid frame, stagger B by half the text width
    if (!initialized.current) {
      offsetA.current = 0;
      offsetB.current = w / 2;
      initialized.current = true;
    }

    // Scroll both texts to the left (negative Z in group-local space,
    // which is the troika X axis since the text faces -X)
    const step = SCROLL_SPEED * delta;
    offsetA.current -= step;
    offsetB.current -= step;

    // When a text block scrolls fully past the left edge, wrap it
    // back to the right side of the other block
    if (offsetA.current < -w) {
      offsetA.current += w;
    }
    if (offsetB.current < -w) {
      offsetB.current += w;
    }

    // Apply position along the Z axis of the text mesh
    // (troika text X axis, because the text is rotated to face -X)
    textRefA.current.position.z = offsetA.current;
    textRefB.current.position.z = offsetB.current;
  });

  // Shared text props
  const textProps = {
    fontSize: FONT_SIZE,
    color: "#BF5700",
    anchorX: "center" as const,
    anchorY: "middle" as const,
    clipRect,
    whiteSpace: "nowrap" as const,
    // Monospace font from Google Fonts CDN
    font: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FPpRFhYMNbKjkCIQ.woff",
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:/\u2014 ",
  };

  return (
    <group position={position}>
      {/* Dark backing panel */}
      <mesh
        geometry={panelGeo}
        material={panelMat}
        position={[TICKER_X, TICKER_Y, 0]}
      />

      {/* Text group: rotated so text faces -X (toward camera on left side) */}
      <group
        position={[TICKER_X - 0.015, TICKER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        {/* Text instance A */}
        <Text
          ref={textRefA}
          {...textProps}
          onSync={handleSync}
        >
          <meshStandardMaterial
            color={C_ACCENT}
            emissive={C_ACCENT}
            emissiveIntensity={2}
            toneMapped={false}
          />
          {REPEATED_TEXT}
        </Text>

        {/* Text instance B (offset for seamless loop) */}
        <Text
          ref={textRefB}
          {...textProps}
        >
          <meshStandardMaterial
            color={C_ACCENT}
            emissive={C_ACCENT}
            emissiveIntensity={2}
            toneMapped={false}
          />
          {REPEATED_TEXT}
        </Text>
      </group>
    </group>
  );
}
