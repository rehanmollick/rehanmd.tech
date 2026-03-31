"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import TrainInterior from "./TrainInterior";
import TunnelEnvironment from "./TunnelEnvironment";
import TunnelLights from "./TunnelLights";
import PostProcessingEffects from "./PostProcessingEffects";
import CameraEffects from "./CameraEffects";

function Scene() {
  return (
    <>
      {/* Camera: seated passenger POV, looking toward windows (right side / +X) */}
      <PerspectiveCamera
        makeDefault
        position={[-0.8, 0.6, 0]}
        rotation={[0, Math.PI * 0.15, 0]}
        fov={65}
        near={0.1}
        far={200}
      />

      {/* Lighting */}
      <ambientLight intensity={0.05} color="#ffffff" />
      <pointLight
        position={[0, 2.2, 0]}
        intensity={0.4}
        color="#FFD4A8"
        distance={10}
        decay={2}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#0d0d0d", 5, 60]} />

      {/* Scene elements */}
      <TrainInterior />
      <TunnelEnvironment />
      <TunnelLights />

      {/* Post-processing */}
      <PostProcessingEffects />

      {/* Camera shake for train rumble */}
      <CameraEffects />
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
          toneMappingExposure: 0.8,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#0a0a0a" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
