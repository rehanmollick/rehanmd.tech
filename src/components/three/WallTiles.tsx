"use client";

import { useMemo } from "react";
import * as THREE from "three";

// ============================================
// WallTiles - Procedural metro station tile wall
//
// Creates a flat wall of off-white ceramic tiles
// arranged in a brick-like offset pattern. Each
// tile is a small rectangle with slight gaps
// between them (dark grout lines). The wall is
// built as a single merged geometry for performance.
// ============================================

export interface WallTilesProps {
  /** Width of the wall in world units */
  width?: number;
  /** Height of the wall in world units */
  height?: number;
  /** Position of the wall center-bottom */
  position?: [number, number, number];
}

/**
 * Generates a canvas texture that tiles as a brick-offset ceramic pattern.
 * This is cheaper than instancing hundreds of individual tile meshes.
 * The texture encodes tile colour, grout lines, and subtle per-tile
 * brightness variation for realism.
 */
function createTileTexture(): THREE.CanvasTexture {
  // Each tile in the texture is ~40x20 pixels. We render a 2-row
  // repeating block (one row offset by half a tile width).
  const tileW = 40;
  const tileH = 20;
  const cols = 16;
  const rows = 16; // 8 brick-pairs = 16 rows
  const grout = 2; // grout line width in pixels

  const canvas = document.createElement("canvas");
  canvas.width = cols * tileW;
  canvas.height = rows * tileH;
  const ctx = canvas.getContext("2d")!;

  // Fill grout colour first
  ctx.fillStyle = "#3a3530";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw tiles with slight random brightness variation
  const baseColor = { r: 232, g: 228, b: 222 }; // #e8e4de

  for (let row = 0; row < rows; row++) {
    const isOffset = row % 2 === 1;
    const xShift = isOffset ? tileW / 2 : 0;

    for (let col = -1; col <= cols; col++) {
      const x = col * tileW + xShift;
      const y = row * tileH;

      // Per-tile colour variation: +/- 12 brightness
      const variation = Math.floor(Math.random() * 24 - 12);
      const r = Math.min(255, Math.max(0, baseColor.r + variation));
      const g = Math.min(255, Math.max(0, baseColor.g + variation));
      const b = Math.min(255, Math.max(0, baseColor.b + variation));

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(
        x + grout / 2,
        y + grout / 2,
        tileW - grout,
        tileH - grout,
      );
    }
  }

  // Add some subtle staining / aging marks
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 20; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    const sr = 10 + Math.random() * 40;
    ctx.fillStyle = "#6b5c4a";
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  // Repeat so the pattern covers the full wall
  tex.repeat.set(3, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Creates a normal map from the tile texture to add bevelled edges.
 * Uses a simple Sobel-like approach to generate subtle surface normals
 * from the grout line brightness differences.
 */
function createTileNormalMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base flat normal (pointing out of the surface = 128,128,255 in tangent space)
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, size, size);

  const tileW = 32;
  const tileH = 16;
  const cols = Math.ceil(size / tileW) + 1;
  const rows = Math.ceil(size / tileH);

  // Draw grout indentations as slight normal offsets
  for (let row = 0; row <= rows; row++) {
    const isOffset = row % 2 === 1;
    const xShift = isOffset ? tileW / 2 : 0;

    // Horizontal grout line
    const y = row * tileH;
    // Normals at top edge of grout point slightly downward (128, 100, 255)
    // Normals at bottom edge point slightly upward (128, 156, 255)
    ctx.fillStyle = "rgb(128,105,240)";
    ctx.fillRect(0, y - 1, size, 1);
    ctx.fillStyle = "rgb(128,150,240)";
    ctx.fillRect(0, y + 1, size, 1);
    ctx.fillStyle = "rgb(128,128,220)";
    ctx.fillRect(0, y, size, 1);

    // Vertical grout lines
    for (let col = 0; col <= cols; col++) {
      const x = col * tileW + xShift;
      ctx.fillStyle = "rgb(105,128,240)";
      ctx.fillRect(x - 1, y, 1, tileH);
      ctx.fillStyle = "rgb(150,128,240)";
      ctx.fillRect(x + 1, y, 1, tileH);
      ctx.fillStyle = "rgb(128,128,220)";
      ctx.fillRect(x, y, 1, tileH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 4);
  tex.needsUpdate = true;
  return tex;
}

export default function WallTiles({
  width = 12,
  height = 4,
  position = [0, 2, 0],
}: WallTilesProps) {
  const geometry = useMemo(() => new THREE.PlaneGeometry(width, height), [width, height]);

  const material = useMemo(() => {
    const diffuse = createTileTexture();
    const normal = createTileNormalMap();

    return new THREE.MeshStandardMaterial({
      map: diffuse,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughness: 0.9,
      metalness: 0.05,
      color: "#e8e4de",
    });
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
    />
  );
}
