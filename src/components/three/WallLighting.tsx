"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// WallLighting - Metro station atmospheric lighting
//
// Creates the dim, warm incandescent lighting of
// an underground station platform. Includes:
// - Very dim ambient fill
// - 2 warm overhead point lights (pools of light)
// - A faint "EXIT" sign (emissive plane, upper right)
// - Subtle light flicker animation
// ============================================

export interface WallLightingProps {
  /** Number of overhead station lights */
  lightCount?: number;
}

/**
 * Creates a canvas texture for the EXIT sign.
 * Red text on a dark background, very simple.
 */
function createExitSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;

  // Dark background
  ctx.fillStyle = "#1a0a0a";
  ctx.fillRect(0, 0, 256, 96);

  // Border
  ctx.strokeStyle = "#661a00";
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 248, 88);

  // EXIT text
  ctx.fillStyle = "#cc3300";
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EXIT", 128, 50);

  // Arrow
  ctx.fillStyle = "#cc3300";
  ctx.font = "36px monospace";
  ctx.fillText("\u2192", 220, 50);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * A single overhead station light fixture. Consists of a small
 * emissive box (the lamp housing) and a point light.
 * Includes subtle brightness flicker via useFrame.
 */
function StationLight({
  position,
  baseIntensity = 4.0,
  flickerSeed = 0,
}: {
  position: [number, number, number];
  baseIntensity?: number;
  flickerSeed?: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const housingGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.08, 0.15), []);
  const housingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFD4A0",
        emissive: "#FFD4A0",
        emissiveIntensity: 2.0,
        toneMapped: false,
      }),
    [],
  );

  // Flicker: subtle random intensity variation simulating
  // old incandescent/fluorescent station lights.
  // Uses layered sine waves at incommensurate frequencies
  // so the pattern never repeats obviously.
  useFrame((state) => {
    if (!lightRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime + flickerSeed;

    const flicker =
      1.0 +
      Math.sin(t * 3.7) * 0.03 +
      Math.sin(t * 7.3 + 1.2) * 0.02 +
      Math.sin(t * 17.1 + 2.8) * 0.015;

    lightRef.current.intensity = baseIntensity * flicker;

    // Match emissive brightness to light flicker
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.5 + (flicker - 1.0) * 8;
  });

  return (
    <group position={position}>
      {/* Light fixture housing */}
      <mesh
        ref={meshRef}
        geometry={housingGeo}
        material={housingMat}
        position={[0, 0, 0]}
      />
      {/* Actual light source — slightly below the housing */}
      <pointLight
        ref={lightRef}
        color="#FFD4A0"
        intensity={baseIntensity}
        distance={8}
        decay={2}
        position={[0, -0.1, 0]}
      />
    </group>
  );
}

export default function WallLighting({ lightCount = 2 }: WallLightingProps) {
  const exitSignMat = useMemo(() => {
    const tex = createExitSignTexture();
    return new THREE.MeshStandardMaterial({
      map: tex,
      emissive: "#cc3300",
      emissiveMap: tex,
      emissiveIntensity: 0.6,
      roughness: 0.9,
      metalness: 0.1,
      toneMapped: false,
    });
  }, []);

  const exitSignGeo = useMemo(() => new THREE.PlaneGeometry(0.6, 0.22), []);

  // Spread lights evenly across the wall width
  const lightPositions: [number, number, number][] = useMemo(() => {
    const positions: [number, number, number][] = [];
    const spread = 6;
    const step = spread / (lightCount + 1);
    for (let i = 1; i <= lightCount; i++) {
      positions.push([
        -spread / 2 + step * i,
        3.8,
        0.5,
      ]);
    }
    return positions;
  }, [lightCount]);

  return (
    <>
      {/* Very dim ambient fill — just enough to see outlines in shadow */}
      <ambientLight intensity={0.15} color="#FFD4A0" />

      {/* Overhead station lights */}
      {lightPositions.map((pos, i) => (
        <StationLight
          key={i}
          position={pos}
          baseIntensity={4.5}
          flickerSeed={i * 47.3}
        />
      ))}

      {/* EXIT sign — upper right corner, very dim red glow */}
      <mesh
        geometry={exitSignGeo}
        material={exitSignMat}
        position={[5.2, 3.5, 0.02]}
      />
      {/* Faint red point light from the exit sign */}
      <pointLight
        color="#cc3300"
        intensity={0.3}
        distance={3}
        decay={2}
        position={[5.2, 3.5, 0.2]}
      />
    </>
  );
}
