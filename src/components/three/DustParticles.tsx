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
      count={60}
      scale={[3, 2.5, 16]}
      size={0.3}
      speed={0.1}
      opacity={0.15}
      color="#FFE8D0"
      noise={0.3}
    />
  );
}
