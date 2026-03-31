"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";

// ============================================
// PosterFrame - Large transit-ad poster on the
// right wall between windows. Sized like a real
// NYC/MTA overhead ad (~70x28 inches).
// ============================================

const CAR_WIDTH = 4;
const WALL = 0.15;

// Between windows, centered vertically between seat-top and ticker
const POSTER_X = CAR_WIDTH / 2 - 0.005;
const POSTER_Y = 1.75;
const POSTER_Z = -2;

// Real transit ad proportions (~2.5:1 wide)
const POSTER_W = 2.8; // along car (z-axis)
const POSTER_H = 1.1; // tall (y-axis)

function createPosterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 410;
  const ctx = canvas.getContext("2d")!;

  // Background — dark with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 410);
  grad.addColorStop(0, "#0c0c0c");
  grad.addColorStop(1, "#080808");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 410);

  // Burnt orange accent bar at top
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(0, 0, 1024, 6);

  // Thin orange side accent
  ctx.fillRect(0, 0, 4, 410);

  // Name — large, prominent
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 52px monospace";
  ctx.fillText("Md Rehan Mollick", 40, 72);

  // Title
  ctx.fillStyle = "#BF5700";
  ctx.font = "28px monospace";
  ctx.fillText("Software Engineer", 40, 115);

  // Subtle divider
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(40, 140, 400, 1);

  // Bio line
  ctx.fillStyle = "#888888";
  ctx.font = "18px monospace";
  ctx.fillText("Building things my own way.", 40, 175);

  // Links section — with icons represented as text
  ctx.fillStyle = "#BF5700";
  ctx.font = "bold 14px monospace";
  ctx.fillText("CONNECT", 40, 220);

  ctx.fillStyle = "#cccccc";
  ctx.font = "20px monospace";
  const links = [
    "github.com/rehanmollick",
    "linkedin.com/in/md-rehan-mollick-674b042b4",
    "rehanmollick07@utexas.edu",
  ];
  links.forEach((link, i) => {
    // Orange bullet
    ctx.fillStyle = "#BF5700";
    ctx.fillRect(40, 243 + i * 36, 6, 6);
    // Link text
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "19px monospace";
    ctx.fillText(link, 58, 250 + i * 36);
  });

  // Website prominently at bottom
  ctx.fillStyle = "#BF5700";
  ctx.font = "bold 36px monospace";
  ctx.fillText("rehanmd.tech", 40, 380);

  // QR-code-like decorative square in bottom right
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.strokeRect(880, 300, 100, 100);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(882, 302, 96, 96);
  // Inner pattern
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(900, 320, 20, 20);
  ctx.fillRect(940, 320, 20, 20);
  ctx.fillRect(900, 360, 20, 20);
  ctx.fillRect(940, 360, 20, 20);
  ctx.fillRect(920, 340, 20, 20);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface PosterFrameProps {
  position?: [number, number, number];
}

export default function PosterFrame({ position = [0, 0, 0] }: PosterFrameProps) {
  const posterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.8,
        metalness: 0.0,
        emissive: "#ffffff",
        emissiveIntensity: 0.12,
      }),
    [],
  );

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#444444",
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );

  useEffect(() => {
    const tex = createPosterTexture();
    posterMat.map = tex;
    posterMat.emissiveMap = tex;
    posterMat.needsUpdate = true;
  }, [posterMat]);

  // Poster plane — wider than tall, faces -X
  const posterGeo = useMemo(() => new THREE.PlaneGeometry(POSTER_W, POSTER_H), []);

  // Frame — thin aluminum border
  const ft = 0.02;
  const hGeo = useMemo(() => new THREE.BoxGeometry(0.008, ft, POSTER_W + ft * 2), []);
  const vGeo = useMemo(() => new THREE.BoxGeometry(0.008, POSTER_H + ft * 2, ft), []);

  const hh = POSTER_H / 2;
  const hw = POSTER_W / 2;

  return (
    <group position={position}>
      <group position={[POSTER_X, POSTER_Y, POSTER_Z]}>
        {/* Poster face */}
        <mesh geometry={posterGeo} material={posterMat} rotation={[0, -Math.PI / 2, 0]} />

        {/* Aluminum frame */}
        <mesh geometry={hGeo} material={frameMat} position={[0, hh + ft / 2, 0]} />
        <mesh geometry={hGeo} material={frameMat} position={[0, -hh - ft / 2, 0]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, -hw - ft / 2]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, hw + ft / 2]} />
      </group>
    </group>
  );
}
