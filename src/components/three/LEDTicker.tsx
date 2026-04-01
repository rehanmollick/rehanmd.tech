"use client";

import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CAR_WIDTH = 4;
const TICKER_Y = 2.7;
const TICKER_X = CAR_WIDTH / 2 - 0.3;
const TICKER_LENGTH = 16;
const TICKER_HEIGHT = 0.17;
const SCROLL_SPEED = 0.03;

const C_PANEL = new THREE.Color("#111111");

function createTickerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 8192;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#090909");
  gradient.addColorStop(1, "#050505");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#BF5700";
  ctx.textBaseline = "middle";
  ctx.font = 'bold 20px "SFMono-Regular", Consolas, monospace';
  ctx.shadowColor = "rgba(191, 87, 0, 0.22)";
  ctx.shadowBlur = 3;

  const text = "    Welcome Aboard  •  This is not your usual commute  •  How did you end up here?  •  The tunnel goes deeper than you think  •  Find the Easter Eggs    ";
  const full = text.repeat(8);
  ctx.fillText(full, 12, canvas.height / 2 + 0.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.repeat.set(0.52, 1);
  return tex;
}

export interface LEDTickerProps {
  position?: [number, number, number];
}

export default function LEDTicker({ position = [0, 0, 0] }: LEDTickerProps) {
  const tickerMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
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
    tickerMat.needsUpdate = true;
    return () => tex.dispose();
  }, [tickerMat]);

  const panelGeo = useMemo(() => new THREE.BoxGeometry(0.02, TICKER_HEIGHT + 0.03, TICKER_LENGTH), []);
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
        position={[TICKER_X - 0.012, TICKER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}
