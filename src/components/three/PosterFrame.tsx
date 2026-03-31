"use client";

import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

// ============================================
// PosterFrame - Transit-ad poster on the RIGHT
// wall (between windows), visible from the
// left-side seated camera. Uses CanvasTexture
// instead of drei Text to avoid crashes.
// ============================================

const CAR_WIDTH = 4;
const WALL = 0.15;

// Position on right wall, between the two middle windows
const POSTER_X = CAR_WIDTH / 2 - 0.01;
const POSTER_Y = 1.7;
const POSTER_Z = 0; // center of car

const POSTER_W = 1.0; // z-axis
const POSTER_H = 0.7; // y-axis
const FRAME_T = 0.025;

const C_FRAME = new THREE.Color("#333333");

function createPosterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, 512, 360);

  // Burnt orange accent line at top
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(16, 16, 480, 6);

  // Name
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 32px monospace";
  ctx.fillText("Md Rehan Mollick", 24, 64);

  // Title
  ctx.fillStyle = "#a1a1a1";
  ctx.font = "20px monospace";
  ctx.fillText("Software Engineer", 24, 100);

  // Divider line
  ctx.fillStyle = "#333333";
  ctx.fillRect(24, 120, 200, 1);

  // Links
  ctx.fillStyle = "#999999";
  ctx.font = "16px monospace";
  ctx.fillText("github.com/rehanmollick", 24, 160);
  ctx.fillText("linkedin.com/in/", 24, 190);
  ctx.fillText("  md-rehan-mollick-674b042b4", 24, 214);
  ctx.fillText("rehanmollick07[at]utexas.edu", 24, 254);

  // Subtle border
  ctx.strokeStyle = "#BF5700";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 488, 336);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface PosterFrameProps {
  position?: [number, number, number];
}

export default function PosterFrame({
  position = [0, 0, 0],
}: PosterFrameProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_FRAME,
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  );

  const posterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.85,
        metalness: 0.0,
        emissive: "#ffffff",
        emissiveIntensity: 0.08,
      }),
    [],
  );

  // Create and assign texture on client only
  useEffect(() => {
    const tex = createPosterTexture();
    posterMat.map = tex;
    posterMat.emissiveMap = tex;
    posterMat.needsUpdate = true;
  }, [posterMat]);

  const posterGeo = useMemo(
    () => new THREE.PlaneGeometry(POSTER_H, POSTER_W),
    [],
  );

  // Frame border geos
  const hGeo = useMemo(
    () => new THREE.BoxGeometry(0.01, FRAME_T, POSTER_W + FRAME_T * 2),
    [],
  );
  const vGeo = useMemo(
    () => new THREE.BoxGeometry(0.01, POSTER_H + FRAME_T * 2, FRAME_T),
    [],
  );

  const hh = POSTER_H / 2;
  const hw = POSTER_W / 2;

  return (
    <group position={position}>
      <group position={[POSTER_X, POSTER_Y, POSTER_Z]}>
        {/* Poster face — faces -X toward camera */}
        <mesh
          ref={meshRef}
          geometry={posterGeo}
          material={posterMat}
          rotation={[0, -Math.PI / 2, 0]}
        />

        {/* Frame borders */}
        <mesh geometry={hGeo} material={frameMat} position={[0, hh, 0]} />
        <mesh geometry={hGeo} material={frameMat} position={[0, -hh, 0]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, -hw]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, hw]} />
      </group>
    </group>
  );
}
