"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import WallTiles from "./WallTiles";
import WallPoster from "./WallPoster";
import WallLighting from "./WallLighting";

// ============================================
// MetroWallScene - Blog section 3D background
//
// A separate R3F Canvas (distinct from the hero
// subway train scene) that renders a dimly lit
// metro station wall with blog post posters.
//
// The camera is static, looking straight at the
// tiled wall with a very subtle idle sway to
// keep the scene feeling alive.
// ============================================

export interface BlogPosterData {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export interface MetroWallSceneProps {
  posts: BlogPosterData[];
}

// ---- Internal scene components ----

/**
 * Idle camera sway. Very subtle lateral and vertical
 * oscillation to prevent the static scene from feeling
 * like a still image. Uses pre-allocated vectors to
 * avoid GC pressure inside the render loop.
 */
function IdleCamera() {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 2.2, 3.4));
  const baseLookAt = useRef(new THREE.Vector3(0, 2.0, 0));

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Gentle sway: two layered sine waves at different frequencies
    // produce a smooth, non-repeating drift pattern.
    const swayX = Math.sin(t * 0.15) * 0.04 + Math.sin(t * 0.37) * 0.02;
    const swayY = Math.sin(t * 0.21 + 0.5) * 0.02 + Math.sin(t * 0.43 + 1.2) * 0.01;

    camera.position.set(
      basePos.current.x + swayX,
      basePos.current.y + swayY,
      basePos.current.z,
    );
    camera.lookAt(
      baseLookAt.current.x + swayX * 0.3,
      baseLookAt.current.y + swayY * 0.2,
      baseLookAt.current.z,
    );
  });

  return null;
}

/**
 * Dark concrete floor plane, barely visible at the
 * bottom of the scene for grounding.
 */
function FloorPlane() {
  const geo = useMemo(() => new THREE.PlaneGeometry(14, 6), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.95,
        metalness: 0.05,
      }),
    [],
  );

  return (
    <mesh
      geometry={geo}
      material={mat}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 1.5]}
    />
  );
}

/**
 * Floating dust motes in the light beams.
 * Re-uses drei Sparkles for consistent look with
 * the subway hero scene.
 */
function StationDust() {
  return (
    <Sparkles
      position={[0, 2.5, 1.5]}
      count={60}
      scale={[10, 4, 4]}
      size={0.4}
      speed={0.08}
      opacity={0.15}
      color="#c9b99a"
      noise={0.5}
    />
  );
}

/**
 * Post-processing effects stack for the metro wall scene.
 * Lighter than the subway scene — no DOF or chromatic aberration
 * since the wall is a flat static subject.
 */
function MetroPostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom — glow on light fixtures and EXIT sign */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.8}
      />

      {/* Film grain — subtle grit */}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.12}
      />

      {/* Vignette — heavy dark edges for cinematic underground feel */}
      <Vignette
        offset={0.2}
        darkness={0.85}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

/**
 * Arranges blog post posters on the wall like hand-pinned notes.
 * Shifted to the left, smaller, with messy angles and varying heights
 * to look like someone taped them up haphazardly. Supports up to 8.
 */
function PosterRow({ posts }: { posts: BlogPosterData[] }) {
  // Pre-computed "messy" layout: each poster gets a unique position, rotation, height offset
  const layouts = useMemo(() => {
    // Seed-based pseudo-random for consistent layout per slot
    const seeds = [0.3, 0.7, 0.1, 0.9, 0.5, 0.2, 0.8, 0.4];
    const maxPosters = Math.min(posts.length, 8);
    const spacing = 1.1;
    // Shift everything left so there's room to grow rightward
    const startX = -3.5;

    return posts.slice(0, maxPosters).map((_, i) => {
      const seed = seeds[i % seeds.length];
      const x = startX + i * spacing;
      // Vary height: some higher, some lower, like someone pinned them at different spots
      const y = 2.0 + (seed - 0.5) * 0.5;
      // Random Z rotation for "messy" tilt (-8 to +8 degrees)
      const rotZ = (seed - 0.5) * 0.28;
      // Slight Y rotation to angle some toward/away from viewer
      const rotY = (seed - 0.5) * 0.06;
      return {
        position: [x, y, 0.025] as [number, number, number],
        rotation: [0, rotY, rotZ] as [number, number, number],
      };
    });
  }, [posts]);

  return (
    <>
      {posts.slice(0, 8).map((post, i) => (
        <WallPoster
          key={post.slug}
          title={post.title}
          date={post.date}
          excerpt={post.excerpt}
          slug={post.slug}
          position={layouts[i].position}
          rotation={layouts[i].rotation}
        />
      ))}
    </>
  );
}

/**
 * The assembled metro wall scene. All children live inside
 * the Canvas context.
 */
function MetroScene({ posts }: { posts: BlogPosterData[] }) {
  return (
    <>
      <IdleCamera />

      {/* Exponential fog — very dark, pushes edges into blackness */}
      <fogExp2 attach="fog" args={["#0a0a0a", 0.08]} />

      {/* Tile wall */}
      <WallTiles width={12} height={4} position={[0, 2, 0]} />

      {/* Station lighting with EXIT sign */}
      <WallLighting lightCount={2} />

      {/* Blog post posters */}
      <PosterRow posts={posts} />

      {/* Dark concrete floor */}
      <FloorPlane />

      {/* Atmospheric dust particles */}
      <StationDust />

      {/* Post-processing effects */}
      <MetroPostProcessing />
    </>
  );
}

// ---- Exported component ----

export default function MetroWallScene({ posts }: MetroWallSceneProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        camera={{
          fov: 50,
          near: 0.1,
          far: 50,
          position: [0, 2.2, 3.4],
        }}
        style={{ background: "#0a0a0a" }}
      >
        <MetroScene posts={posts} />
      </Canvas>
    </div>
  );
}
