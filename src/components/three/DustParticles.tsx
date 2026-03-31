"use client";

import { Sparkles } from "@react-three/drei";

// ============================================
// DustParticles - Floating dust motes inside
// the train car for atmosphere. Uses drei's
// Sparkles component with very slow movement
// and dim warm color.
// ============================================

export interface DustParticlesProps {
  position?: [number, number, number];
}

export default function DustParticles({
  position = [0, 1.5, 0],
}: DustParticlesProps) {
  return (
    <Sparkles
      position={position}
      count={128}
      scale={[3.8, 2.9, 17.5]}
      size={0.38}
      speed={0.13}
      opacity={0.2}
      color="#a7a19a"
      noise={0.44}
    />
  );
}
