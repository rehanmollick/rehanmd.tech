"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// PosterFrame - Large transit-ad poster on the
// right wall between windows. Sized like a real
// NYC/MTA overhead ad (~70x28 inches).
// ============================================

const CAR_WIDTH = 4;
const WALL = 0.15;

// Between windows, centered vertically between seat-top and ticker
const POSTER_X = CAR_WIDTH / 2 - 0.19;
const POSTER_Y = 1.75;
const POSTER_Z = -1.55;

// Real transit ad proportions (~2.5:1 wide)
const POSTER_W = 2.45; // along car (z-axis)
const POSTER_H = 1.1; // tall (y-axis)
const POSTER_RIGHT_TRIM = 0.175;

function createPosterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 560;
  const ctx = canvas.getContext("2d")!;

  // Background — dark with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 560);
  grad.addColorStop(0, "#0c0c0c");
  grad.addColorStop(1, "#080808");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1400, 560);

  // Burnt orange accent bar at top
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(0, 0, 1400, 8);

  // Thin orange side accent
  ctx.fillRect(0, 0, 6, 560);

  // Name — large, prominent
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 82px monospace";
  ctx.fillText("Md Rehan Mollick", 54, 96);

  // Title
  ctx.fillStyle = "#BF5700";
  ctx.font = "40px monospace";
  ctx.fillText("Software Developer", 54, 154);

  // Subtle divider
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(54, 182, 820, 2);

  // Contact / profile lines
  ctx.fillStyle = "#cccccc";
  ctx.font = "24px monospace";
  const links = [
    "GitHub   https://github.com/rehanmollick",
    "LinkedIn https://www.linkedin.com/in/rehanmollick/",
    "UT Email rehanmollick07[at]utexas[dot]edu",
    "Gmail    rehanmollick07[at]gmail[dot]com",
  ];
  links.forEach((link, i) => {
    // Orange bullet
    ctx.fillStyle = "#BF5700";
    ctx.fillRect(54, 238 + i * 62, 10, 10);
    // Link text
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "24px monospace";
    ctx.fillText(link, 78, 248 + i * 62);
  });

  // QR-code-like decorative square in bottom right
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.strokeRect(1190, 398, 132, 132);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(1192, 400, 128, 128);
  // Inner pattern
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(1216, 424, 26, 26);
  ctx.fillRect(1268, 424, 26, 26);
  ctx.fillRect(1216, 476, 26, 26);
  ctx.fillRect(1268, 476, 26, 26);
  ctx.fillRect(1242, 450, 26, 26);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGraffitiTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const sprayDots = (x: number, y: number, radius: number, count: number, color: string) => {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = radius * Math.sqrt(Math.random());
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      const s = 0.8 + Math.random() * 2.4;
      ctx.globalAlpha = 0.03 + Math.random() * 0.08;
      ctx.beginPath();
      ctx.arc(px, py, s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const drawGraffitiWord = (
    word: string,
    x: number,
    y: number,
    size: number,
    tilt: number,
    jitter: Array<{ dx: number; dy: number; rot: number; scale: number }>,
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.transform(1, 0, -0.12, 1, 0, 0);

    let cursor = -word.length * size * 0.22;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const j = jitter[i];
      const charSize = size * j.scale;

      ctx.save();
      ctx.translate(cursor + j.dx, j.dy);
      ctx.rotate(j.rot);
      ctx.font = `900 ${charSize}px "Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif`;

      ctx.strokeStyle = "rgba(15,10,8,0.98)";
      ctx.lineWidth = 18;
      ctx.strokeText(ch, 0, 0);

      ctx.fillStyle = "#d66f1e";
      ctx.fillText(ch, 0, 0);

      ctx.strokeStyle = "rgba(255,210,150,0.2)";
      ctx.lineWidth = 5;
      ctx.strokeText(ch, -2, -3);

      ctx.fillStyle = "rgba(255,190,120,0.12)";
      ctx.fillText(ch, -4, -4);
      ctx.restore();

      cursor += charSize * 0.56;
    }

    ctx.restore();
    sprayDots(x, y, size * 0.82, 110, "#d66f1e");
  };

  drawGraffitiWord("Click", 262, 132, 108, -0.04, [
    { dx: -8, dy: 4, rot: -0.08, scale: 1.02 },
    { dx: -3, dy: -6, rot: 0.05, scale: 0.92 },
    { dx: 2, dy: 3, rot: -0.03, scale: 1.08 },
    { dx: 6, dy: -4, rot: 0.08, scale: 0.95 },
    { dx: 3, dy: 5, rot: -0.05, scale: 1.04 },
  ]);
  drawGraffitiWord("Here", 254, 262, 124, -0.02, [
    { dx: -6, dy: 6, rot: -0.06, scale: 1.03 },
    { dx: -2, dy: -5, rot: 0.04, scale: 0.96 },
    { dx: 4, dy: 3, rot: -0.04, scale: 1.06 },
    { dx: 8, dy: -6, rot: 0.07, scale: 0.92 },
  ]);

  ctx.save();
  ctx.translate(248, 386);
  ctx.rotate(-0.08);
  ctx.strokeStyle = "rgba(15,10,8,0.92)";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(118, 0);
  ctx.lineTo(-6, 0);
  ctx.lineTo(28, -28);
  ctx.moveTo(-6, 0);
  ctx.lineTo(28, 28);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,220,170,0.24)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(118, -4);
  ctx.lineTo(0, -4);
  ctx.lineTo(30, -30);
  ctx.moveTo(0, -4);
  ctx.lineTo(30, 22);
  ctx.stroke();

  ctx.strokeStyle = "#d66f1e";
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(118, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(30, -30);
  ctx.moveTo(0, 0);
  ctx.lineTo(30, 30);
  ctx.stroke();
  ctx.restore();

  sprayDots(248, 386, 74, 70, "#d66f1e");

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export interface PosterFrameProps {
  position?: [number, number, number];
  onPosterClick?: () => void;
}

export default function PosterFrame({ position = [0, 0, 0], onPosterClick }: PosterFrameProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (onPosterClick) {
      onPosterClick();
    } else {
      // Fallback: dispatch custom DOM event
      window.dispatchEvent(new CustomEvent("poster-click"));
    }
  }, [onPosterClick]);

  // Change cursor on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);
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

  const backingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#232323",
        roughness: 0.88,
        metalness: 0.12,
      }),
    [],
  );

  const graffitiMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        alphaTest: 0.1,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    const tex = createPosterTexture();
    posterMat.map = tex;
    posterMat.emissiveMap = tex;
    posterMat.needsUpdate = true;
  }, [posterMat]);

  useEffect(() => {
    const tex = createGraffitiTexture();
    graffitiMat.map = tex;
    graffitiMat.needsUpdate = true;
  }, [graffitiMat]);

  // Subtle glow boost on hover
  useFrame(() => {
    const target = hovered ? 0.25 : 0.12;
    posterMat.emissiveIntensity += (target - posterMat.emissiveIntensity) * 0.1;
  });

  // Poster plane — wider than tall, faces -X
  const posterGeo = useMemo(() => new THREE.PlaneGeometry(POSTER_W, POSTER_H), []);
  const backingGeo = useMemo(() => new THREE.PlaneGeometry(POSTER_W + 0.18, POSTER_H + 0.22), []);
  const graffitiGeo = useMemo(() => new THREE.PlaneGeometry(0.42, 0.72), []);

  // Frame — thin aluminum border
  const ft = 0.02;
  const hGeo = useMemo(() => new THREE.BoxGeometry(0.008, ft, POSTER_W + ft * 2), []);
  const vGeo = useMemo(() => new THREE.BoxGeometry(0.008, POSTER_H + ft * 2, ft), []);

  const hh = POSTER_H / 2;
  const hw = POSTER_W / 2;

  return (
    <group position={position}>
      <group position={[POSTER_X, POSTER_Y, POSTER_Z]}>
        <mesh
          geometry={backingGeo}
          material={backingMat}
          position={[0.03, 0, -POSTER_RIGHT_TRIM]}
          rotation={[0, -Math.PI / 2, 0]}
        />

        {/* Poster face — clickable */}
        <mesh
          geometry={posterGeo}
          material={posterMat}
          position={[0, 0, -POSTER_RIGHT_TRIM]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />

        {/* Aluminum frame */}
        <mesh geometry={hGeo} material={frameMat} position={[0, hh + ft / 2, -POSTER_RIGHT_TRIM]} />
        <mesh geometry={hGeo} material={frameMat} position={[0, -hh - ft / 2, -POSTER_RIGHT_TRIM]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, -hw - ft / 2 - POSTER_RIGHT_TRIM]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, hw + ft / 2 - POSTER_RIGHT_TRIM]} />

        <mesh
          geometry={graffitiGeo}
          material={graffitiMat}
          position={[0.004, 0.01, hw + 0.34 - POSTER_RIGHT_TRIM]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>
    </group>
  );
}
