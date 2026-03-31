"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TrainInterior from "./TrainInterior";
import TunnelEnvironment from "./TunnelEnvironment";
import TunnelLights from "./TunnelLights";
import PostProcessingEffects from "./PostProcessingEffects";
import LEDTicker from "./LEDTicker";
import PosterFrame from "./PosterFrame";
import DustParticles from "./DustParticles";

/**
 * Animated point light that simulates tunnel light spill
 * through the windows onto the interior. Oscillates along Z.
 */
/**
 * Simulates tunnel light spill through windows. A bright orange light
 * sweeps along the car interior matching the tunnel light spacing/speed.
 * Tunnel lights are spaced 20 units apart scrolling at 36 units/sec,
 * so one passes every ~0.55 seconds.
 */
function TunnelLightSpill() {
  const rightLightRef = useRef<THREE.SpotLight>(null);
  const rightTargetRef = useRef<THREE.Object3D>(null);
  const leftLightRef = useRef<THREE.SpotLight>(null);
  const leftTargetRef = useRef<THREE.Object3D>(null);

  useFrame((state) => {
    if (!rightLightRef.current || !rightTargetRef.current || !leftLightRef.current || !leftTargetRef.current) return;

    const cycleDuration = 22 / 18;
    const phase = (state.clock.elapsedTime % cycleDuration) / cycleDuration;
    const z = -10 + phase * 18;
    const pulse = THREE.MathUtils.smoothstep(phase, 0.16, 0.48) * (1 - THREE.MathUtils.smoothstep(phase, 0.48, 0.82));

    rightLightRef.current.position.z = z;
    rightTargetRef.current.position.z = z;
    rightLightRef.current.intensity = 9 * pulse;
    rightLightRef.current.target.updateMatrixWorld();

    // Dedicated pass for the visible left-side opening near the left door/window cluster.
    const leftZ = -8.6 + phase * 3.2;
    leftLightRef.current.position.z = leftZ;
    leftTargetRef.current.position.z = leftZ;
    leftLightRef.current.intensity = 9 * pulse;
    leftLightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <object3D ref={rightTargetRef} position={[1.25, 1.35, -10]} />
      <spotLight
        ref={rightLightRef}
        position={[3.15, 1.55, -10]}
        color="#FFB366"
        angle={0.48}
        penumbra={0.9}
        distance={8.5}
        decay={2.4}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0008}
        target={rightTargetRef.current ?? undefined}
      />

      <object3D ref={leftTargetRef} position={[-1.7, 1.35, -7.2]} />
      <spotLight
        ref={leftLightRef}
        position={[-2.75, 1.52, -7.2]}
        color="#FFB366"
        angle={0.5}
        penumbra={0.88}
        distance={4.6}
        decay={2.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0008}
        target={leftTargetRef.current ?? undefined}
      />
    </>
  );
}

/** Imperatively set camera position + lookAt so nothing can override it */
function SetupCamera() {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(-1.0, 1.55, 0.5));
  const baseLook = useRef(new THREE.Vector3(2.5, 1.7, -1.5));
  const bumpRef = useRef({
    nextTime: 0.8,
    strength: 0,
    decay: 0.82,
    seed: Math.random() * 1000,
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const bump = bumpRef.current;
    if (t >= bump.nextTime) {
      bump.strength = 0.006 + Math.random() * 0.015;
      bump.decay = 0.78 + Math.random() * 0.12;
      bump.seed = Math.random() * 1000;
      bump.nextTime = t + 0.35 + Math.random() * 1.2;
    }

    bump.strength *= bump.decay;

    const jitterX =
      Math.sin(t * 8.1 + bump.seed) * 0.003 +
      Math.sin(t * 17.3 + bump.seed * 0.37) * 0.0018 +
      Math.sin(t * 31.7 + bump.seed * 0.12) * 0.0009;
    const jitterY =
      Math.sin(t * 10.4 + bump.seed * 0.51) * 0.0025 +
      Math.sin(t * 23.8 + bump.seed * 0.19) * 0.0014;
    const jitterZ =
      Math.sin(t * 7.6 + bump.seed * 0.23) * 0.004 +
      Math.sin(t * 15.1 + bump.seed * 0.63) * 0.0022;

    const impulse = bump.strength;
    const x = basePos.current.x + jitterX + impulse * 0.25;
    const y = basePos.current.y + jitterY + impulse;
    const z = basePos.current.z + jitterZ - impulse * 0.45;

    camera.position.set(x, y, z);
    camera.lookAt(
      baseLook.current.x + jitterX * 0.8,
      baseLook.current.y + jitterY * 0.7 + impulse * 0.18,
      baseLook.current.z + jitterZ * 0.5 - impulse * 0.2,
    );
    camera.updateProjectionMatrix();
  });
  return null;
}

function Scene() {
  return (
    <>
      {/* Camera: seated on LEFT side, looking out the right-side windows */}
      <SetupCamera />

      {/* Lighting — warm interior glow */}
      <ambientLight intensity={0.42} color="#ffffff" />
      {/* Main overhead lights along the car */}
      <pointLight
        position={[0, 2.7, 0]}
        intensity={5.4}
        color="#FFD4A8"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 2.7, -5]}
        intensity={3.8}
        color="#FFD4A8"
        distance={18}
        decay={2}
      />
      <pointLight
        position={[0, 2.7, 5]}
        intensity={3.8}
        color="#FFD4A8"
        distance={18}
        decay={2}
      />
      <pointLight
        position={[-1.2, 1.2, 2.5]}
        intensity={1.1}
        color="#cfd6df"
        distance={11}
        decay={2.4}
      />

      {/* Animated tunnel light spill through windows */}
      <TunnelLightSpill />

      {/* Fog — denser for humid in-car atmosphere */}
      <fog attach="fog" args={["#292624", 1.85, 12.8]} />

      {/* Train interior geometry */}
      <TrainInterior />

      {/* In-scene info elements */}
      <LEDTicker />
      <PosterFrame />

      {/* Atmospheric dust particles */}
      <DustParticles />

      {/* Tunnel outside windows */}
      <TunnelEnvironment />
      <TunnelLights side="right" />
      <TunnelLights side="left" count={2} zOffset={-7.2} intensityMultiplier={2.4} />

      {/* Post-processing */}
      <PostProcessingEffects />

    </>
  );
}

export default function SubwayScene() {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#0a0a0a" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
