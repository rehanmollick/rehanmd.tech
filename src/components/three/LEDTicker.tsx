"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// LEDTicker - Scrolling LED marquee strip
// above windows on the right wall interior.
// ============================================

const CAR_WIDTH = 4;
const TICKER_Y = 2.65;
const TICKER_X = CAR_WIDTH / 2 - 0.05;
const TICKER_LENGTH = 18;
const FONT_SIZE = 0.08;
const SCROLL_SPEED = 1.5;

const TEXT = "Md Rehan Mollick — Software Engineer — rehanmd.tech — ";
const LONG_TEXT = TEXT.repeat(4);

const C_PANEL = new THREE.Color("#111111");

export interface LEDTickerProps {
  position?: [number, number, number];
}

export default function LEDTicker({ position = [0, 0, 0] }: LEDTickerProps) {
  const groupRefA = useRef<THREE.Group>(null);
  const groupRefB = useRef<THREE.Group>(null);
  const halfSpan = useRef(20); // estimated, updated on sync

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
    () => new THREE.BoxGeometry(0.02, 0.15, TICKER_LENGTH),
    [],
  );

  useFrame((_, delta) => {
    if (!groupRefA.current || !groupRefB.current) return;
    const step = SCROLL_SPEED * Math.min(delta, 0.1);
    const span = halfSpan.current;

    groupRefA.current.position.z -= step;
    groupRefB.current.position.z -= step;

    // Wrap when fully scrolled past
    if (groupRefA.current.position.z < -span) {
      groupRefA.current.position.z += span * 2;
    }
    if (groupRefB.current.position.z < -span) {
      groupRefB.current.position.z += span * 2;
    }
  });

  return (
    <group position={position}>
      {/* Dark backing panel */}
      <mesh
        geometry={panelGeo}
        material={panelMat}
        position={[TICKER_X, TICKER_Y, 0]}
      />

      {/* Scrolling text — two copies for seamless loop */}
      <group position={[TICKER_X - 0.015, TICKER_Y, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <group ref={groupRefA} position={[0, 0, 0]}>
          <Text fontSize={FONT_SIZE} color="#FF8030" anchorX="center" anchorY="middle">
            {LONG_TEXT}
          </Text>
        </group>
        <group ref={groupRefB} position={[0, 0, 20]}>
          <Text fontSize={FONT_SIZE} color="#FF8030" anchorX="center" anchorY="middle">
            {LONG_TEXT}
          </Text>
        </group>
      </group>
    </group>
  );
}
