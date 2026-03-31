"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// LEDTicker - Scrolling LED marquee strip
// above windows on the right wall interior.
// Uses CanvasTexture with UV offset animation
// for smooth, stable scrolling.
// ============================================

const CAR_WIDTH = 4;
const TICKER_Y = 2.6;
const TICKER_X = CAR_WIDTH / 2 - 0.02;
const TICKER_LENGTH = 16;
const SCROLL_SPEED = 0.06; // UV units per second

const C_PANEL = new THREE.Color("#111111");

function createTickerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 2048, 64);

  ctx.fillStyle = "#BF5700";
  ctx.font = "bold 36px monospace";

  const text =
    "  Md Rehan Mollick  —  Software Engineer  —  rehanmd.tech  —  ";
  // Repeat to fill the canvas width
  const full = text.repeat(4);
  ctx.fillText(full, 10, 44);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface LEDTickerProps {
  position?: [number, number, number];
}

export default function LEDTicker({ position = [0, 0, 0] }: LEDTickerProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const panelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_PANEL,
        roughness: 0.9,
        metalness: 0.1,
      }),
    [],
  );

  const tickerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 1.5,
        toneMapped: false,
        roughness: 0.9,
        metalness: 0.0,
      }),
    [],
  );

  // Assign texture on client
  useEffect(() => {
    const tex = createTickerTexture();
    tickerMat.map = tex;
    tickerMat.emissiveMap = tex;
    tickerMat.needsUpdate = true;
    matRef.current = tickerMat;
  }, [tickerMat]);

  const panelGeo = useMemo(
    () => new THREE.BoxGeometry(0.02, 0.12, TICKER_LENGTH),
    [],
  );

  const tickerGeo = useMemo(
    () => new THREE.PlaneGeometry(TICKER_LENGTH, 0.1),
    [],
  );

  // Scroll UV offset each frame
  useFrame((_, delta) => {
    if (!matRef.current?.map) return;
    matRef.current.map.offset.x += SCROLL_SPEED * delta;
  });

  return (
    <group position={position}>
      {/* Dark backing */}
      <mesh
        geometry={panelGeo}
        material={panelMat}
        position={[TICKER_X, TICKER_Y, 0]}
      />
      {/* Scrolling text strip — faces -X toward camera */}
      <mesh
        geometry={tickerGeo}
        material={tickerMat}
        position={[TICKER_X - 0.012, TICKER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}
