"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CAR_WIDTH = 4;
const TICKER_Y = 2.6;
const TICKER_X = CAR_WIDTH / 2 - 0.02;
const TICKER_LENGTH = 16;
const TICKER_HEIGHT = 0.08;
const SCROLL_SPEED = 0.03;

const C_PANEL = new THREE.Color("#111111");

function createTickerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  // Wide but proportional - 4096 wide so text isn't stretched
  canvas.width = 4096;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, 4096, 32);

  ctx.fillStyle = "#BF5700";
  ctx.font = "bold 22px monospace";

  const text = "    Md Rehan Mollick  ·  Software Engineer  ·  rehanmd.tech    ";
  const full = text.repeat(6);
  ctx.fillText(full, 8, 23);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(0.25, 1); // Show 1/4 of texture at a time
  return tex;
}

export interface LEDTickerProps {
  position?: [number, number, number];
}

export default function LEDTicker({ position = [0, 0, 0] }: LEDTickerProps) {
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

  const panelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: C_PANEL, roughness: 0.9, metalness: 0.1 }),
    [],
  );

  useEffect(() => {
    const tex = createTickerTexture();
    tickerMat.map = tex;
    tickerMat.emissiveMap = tex;
    tickerMat.needsUpdate = true;
  }, [tickerMat]);

  const panelGeo = useMemo(() => new THREE.BoxGeometry(0.015, TICKER_HEIGHT + 0.02, TICKER_LENGTH), []);
  const tickerGeo = useMemo(() => new THREE.PlaneGeometry(TICKER_LENGTH, TICKER_HEIGHT), []);

  useFrame((_, delta) => {
    if (!tickerMat.map) return;
    tickerMat.map.offset.x += SCROLL_SPEED * delta;
  });

  return (
    <group position={position}>
      <mesh geometry={panelGeo} material={panelMat} position={[TICKER_X, TICKER_Y, 0]} />
      <mesh
        geometry={tickerGeo}
        material={tickerMat}
        position={[TICKER_X - 0.01, TICKER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}
