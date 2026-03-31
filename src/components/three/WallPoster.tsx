"use client";

import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// WallPoster - Blog post poster for metro wall
//
// Renders a dark poster with burnt-orange accents
// containing the blog post title, date, and excerpt.
// Uses a canvas texture for crisp text rendering.
// Hover triggers a subtle emissive glow; click
// dispatches a custom event with the post slug.
// ============================================

export interface WallPosterProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  position: [number, number, number];
}

/** Poster dimensions in world units */
const POSTER_W = 1.5;
const POSTER_H = 2.0;
const FRAME_DEPTH = 0.04;

/**
 * Word-wraps text to fit within a given pixel width,
 * used for the excerpt body text on the poster canvas.
 */
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

/**
 * Creates the poster canvas texture. Layout:
 * - Dark background (#111111) with burnt orange left border
 * - Title in bold white at top
 * - Date in muted text below title
 * - Divider line
 * - Excerpt body text
 * - Bottom orange accent stripe
 */
function createPosterTexture(
  title: string,
  date: string,
  excerpt: string,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  // 3:4 aspect ratio matching POSTER_W:POSTER_H
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext("2d")!;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, "#131313");
  grad.addColorStop(1, "#0e0e0e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);

  // Burnt orange left accent bar
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(0, 0, 8, 800);

  // Top orange accent stripe
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(0, 0, 600, 6);

  // Bottom orange accent stripe
  ctx.fillRect(0, 794, 600, 6);

  // Right edge thin orange line
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(592, 0, 8, 800);

  // Title — bold, white, Space Mono style
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 38px monospace";
  const titleLines = wrapText(ctx, title, 520);
  let yPos = 70;
  for (const line of titleLines) {
    ctx.fillText(line, 36, yPos);
    yPos += 48;
  }

  // Date — muted colour, smaller
  yPos += 10;
  ctx.fillStyle = "#BF5700";
  ctx.font = "24px monospace";
  ctx.fillText(date, 36, yPos);

  // Divider
  yPos += 28;
  ctx.fillStyle = "#333333";
  ctx.fillRect(36, yPos, 528, 2);

  // Excerpt body text
  yPos += 36;
  ctx.fillStyle = "#a1a1a1";
  ctx.font = "22px monospace";
  const excerptLines = wrapText(ctx, excerpt, 520);
  // Limit to prevent overflow
  const maxExcerptLines = Math.min(excerptLines.length, 12);
  for (let i = 0; i < maxExcerptLines; i++) {
    ctx.fillText(excerptLines[i], 36, yPos);
    yPos += 32;
  }
  if (excerptLines.length > maxExcerptLines) {
    ctx.fillText("...", 36, yPos);
  }

  // Decorative corner element — small orange square in bottom-right
  ctx.fillStyle = "#BF5700";
  ctx.fillRect(540, 740, 24, 24);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(546, 746, 12, 12);

  // "READ" label near bottom
  ctx.fillStyle = "#666666";
  ctx.font = "18px monospace";
  ctx.fillText("READ \u2192", 36, 760);

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
}: WallPosterProps) {
  const [hovered, setHovered] = useState(false);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Create poster texture once (memoised on content)
  const posterTexture = useMemo(
    () => createPosterTexture(title, date, excerpt),
    [title, date, excerpt],
  );

  // Poster face material
  const posterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: posterTexture,
        roughness: 0.85,
        metalness: 0.0,
        emissive: "#ffffff",
        emissiveMap: posterTexture,
        emissiveIntensity: 0.08,
      }),
    [posterTexture],
  );

  // Frame/backing material — dark metal
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a2a2a",
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  );

  // Pre-allocate geometries
  const posterGeo = useMemo(() => new THREE.PlaneGeometry(POSTER_W, POSTER_H), []);
  const backingGeo = useMemo(
    () => new THREE.BoxGeometry(POSTER_W + 0.06, POSTER_H + 0.06, FRAME_DEPTH),
    [],
  );

  // Cursor change on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  // Click handler dispatches custom event with slug
  const handleClick = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("poster-click-blog", { detail: { slug } }),
    );
  }, [slug]);

  // Animate emissive intensity on hover
  useFrame(() => {
    const target = hovered ? 0.22 : 0.08;
    posterMat.emissiveIntensity +=
      (target - posterMat.emissiveIntensity) * 0.1;
  });

  // Cleanup textures and geometries
  useEffect(() => {
    return () => {
      posterTexture.dispose();
      posterMat.dispose();
      frameMat.dispose();
      posterGeo.dispose();
      backingGeo.dispose();
    };
  }, [posterTexture, posterMat, frameMat, posterGeo, backingGeo]);

  return (
    <group position={position}>
      {/* Dark frame backing — sits behind the poster face */}
      <mesh geometry={backingGeo} material={frameMat} position={[0, 0, -FRAME_DEPTH / 2]} />

      {/* Poster face — interactive */}
      <mesh
        geometry={posterGeo}
        material={posterMat}
        position={[0, 0, 0.001]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </group>
  );
}
