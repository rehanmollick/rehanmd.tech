"use client";

import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export interface WallPosterProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

const POSTER_W = 0.7;
const POSTER_H = 0.9;
const FRAME_DEPTH = 0.01;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function createPosterTexture(
  title: string,
  date: string,
  excerpt: string,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 520;
  const ctx = canvas.getContext("2d")!;

  // Aged white paper background with slight yellowing
  const grad = ctx.createLinearGradient(0, 0, 400, 520);
  grad.addColorStop(0, "#f0ebe3");
  grad.addColorStop(0.3, "#e8e2d8");
  grad.addColorStop(0.7, "#ede7dd");
  grad.addColorStop(1, "#e5dfd5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 520);

  // Coffee stain / aging mark
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#8B7355";
  ctx.beginPath();
  ctx.arc(320, 420, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 60, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Subtle fold crease line
  ctx.strokeStyle = "rgba(0,0,0,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(400, 260);
  ctx.stroke();

  // Title — handwritten-ish feel, dark ink
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 28px Georgia, serif";
  const titleLines = wrapText(ctx, title, 340);
  let yPos = 50;
  for (const line of titleLines) {
    ctx.fillText(line, 30, yPos);
    yPos += 36;
  }

  // Date — pencil grey
  yPos += 8;
  ctx.fillStyle = "#666666";
  ctx.font = "italic 16px Georgia, serif";
  ctx.fillText(date, 30, yPos);

  // Thin line separator
  yPos += 16;
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(30, yPos);
  ctx.lineTo(370, yPos);
  ctx.stroke();

  // Excerpt body — smaller, like handwritten notes
  yPos += 24;
  ctx.fillStyle = "#333333";
  ctx.font = "15px Georgia, serif";
  const excerptLines = wrapText(ctx, excerpt, 340);
  const maxLines = Math.min(excerptLines.length, 10);
  for (let i = 0; i < maxLines; i++) {
    ctx.fillText(excerptLines[i], 30, yPos);
    yPos += 22;
  }
  if (excerptLines.length > maxLines) {
    ctx.fillText("...", 30, yPos);
  }

  // Small tape marks at top (as if taped to wall)
  ctx.fillStyle = "rgba(200, 180, 140, 0.5)";
  ctx.fillRect(170, -2, 60, 16);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function WallPoster({
  title,
  date,
  excerpt,
  slug,
  position,
  rotation = [0, 0, 0],
}: WallPosterProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const posterTexture = useMemo(
    () => createPosterTexture(title, date, excerpt),
    [title, date, excerpt],
  );

  const posterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: posterTexture,
        roughness: 0.92,
        metalness: 0.0,
        emissive: "#ffffff",
        emissiveMap: posterTexture,
        emissiveIntensity: 0.05,
      }),
    [posterTexture],
  );

  const posterGeo = useMemo(() => new THREE.PlaneGeometry(POSTER_W, POSTER_H), []);
  const backingGeo = useMemo(
    () => new THREE.BoxGeometry(POSTER_W + 0.02, POSTER_H + 0.02, FRAME_DEPTH),
    [],
  );
  const backingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d4cfc5", roughness: 0.95, metalness: 0 }),
    [],
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);

  const handleClick = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("poster-click-blog", { detail: { slug, title, date, excerpt } }),
    );
  }, [slug, title, date, excerpt]);

  // Animate emissive on hover
  useFrame(() => {
    const target = hovered ? 0.2 : 0.05;
    posterMat.emissiveIntensity += (target - posterMat.emissiveIntensity) * 0.1;
  });

  useEffect(() => {
    return () => {
      posterTexture.dispose();
      posterMat.dispose();
      posterGeo.dispose();
      backingGeo.dispose();
      backingMat.dispose();
    };
  }, [posterTexture, posterMat, posterGeo, backingGeo, backingMat]);

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      <mesh geometry={backingGeo} material={backingMat} position={[0, 0, -FRAME_DEPTH / 2]} />
      <mesh
        geometry={posterGeo}
        material={posterMat}
        position={[0, 0, 0.001]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {/* Hover tooltip — shows title */}
      {hovered && (
        <Html
          position={[0, POSTER_H / 2 + 0.12, 0.05]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-bg-primary/90 border border-accent/40 px-3 py-1.5 rounded font-mono text-xs text-accent whitespace-nowrap">
            {title}
          </div>
        </Html>
      )}
    </group>
  );
}
