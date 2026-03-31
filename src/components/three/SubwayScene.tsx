"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TrainInterior from "./TrainInterior";
import TunnelEnvironment from "./TunnelEnvironment";
import TunnelLights from "./TunnelLights";
import PostProcessingEffects from "./PostProcessingEffects";
import CameraEffects from "./CameraEffects";
import LEDTicker from "./LEDTicker";
import PosterFrame from "./PosterFrame";
import DustParticles from "./DustParticles";

/**
 * Animated point light that simulates tunnel light spill
 * through the windows onto the interior. Oscillates along Z.
 */
function TunnelLightSpill() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    // Oscillate along Z to simulate passing tunnel lights
    lightRef.current.position.z = Math.sin(t * 1.2) * 6;
    // Pulse intensity to simulate individual lights passing
    lightRef.current.intensity =
      1.5 + 1.5 * Math.max(0, Math.sin(t * 3.5));
  });

  return (
    <pointLight
      ref={lightRef}
      position={[1.8, 1.5, 0]}
      color="#FFB366"
      intensity={1.5}
      distance={8}
      decay={2}
    />
  );
}

/** Imperatively set camera position + lookAt so nothing can override it */
function SetupCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(-1.2, 1.2, 0);
    // Look at the right-side windows, slightly down the car
    camera.lookAt(2.5, 1.0, -2);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Scene() {
  return (
    <>
      {/* Camera: seated on LEFT side, looking out the right-side windows */}
      <SetupCamera />

      {/* Lighting — warm interior glow */}
      <ambientLight intensity={0.3} color="#ffffff" />
      {/* Main overhead lights along the car */}
      <pointLight
        position={[0, 2.7, 0]}
        intensity={4}
        color="#FFD4A8"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 2.7, -5]}
        intensity={3}
        color="#FFD4A8"
        distance={18}
        decay={2}
      />
      <pointLight
        position={[0, 2.7, 5]}
        intensity={3}
        color="#FFD4A8"
        distance={18}
        decay={2}
      />

      {/* Animated tunnel light spill through windows */}
      <TunnelLightSpill />

      {/* Fog — denser for humid night atmosphere */}
      <fog attach="fog" args={["#0d0d0d", 6, 45]} />

      {/* Train interior geometry */}
      <TrainInterior />

      {/* In-scene info elements — re-enabling one by one */}
      <LEDTicker />
      {/* <PosterFrame /> */}

      {/* Atmospheric dust particles */}
      <DustParticles />

      {/* Tunnel outside windows */}
      <TunnelEnvironment />
      <TunnelLights />

      {/* Post-processing */}
      <PostProcessingEffects />

      {/* Camera shake disabled — was overriding camera orientation */}
      {/* <CameraEffects /> */}
    </>
  );
}

export default function SubwayScene() {
  return (
    <div className="canvas-container">
      <Canvas
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
