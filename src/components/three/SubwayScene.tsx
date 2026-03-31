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
      {/* Camera: seated on LEFT side, looking diagonally across to right windows */}
      <PerspectiveCamera
        makeDefault
        position={[-1.4, 1.1, 1]}
        rotation={[-0.08, Math.PI * 0.18, 0]}
        fov={68}
        near={0.1}
        far={200}
      />

      {/* Lighting — warm interior glow */}
      <ambientLight intensity={0.35} color="#ffffff" />
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
      {/* Subtle accent fill from right (window side) to catch tunnel light spill */}
      <pointLight
        position={[3, 1.5, -3]}
        intensity={0.8}
        color="#FFB366"
        distance={10}
        decay={2}
      />

      {/* Fog — start further so near geometry is clear */}
      <fog attach="fog" args={["#0d0d0d", 10, 70]} />

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
