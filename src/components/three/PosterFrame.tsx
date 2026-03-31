"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// PosterFrame - Transit-ad-style poster on the
// left wall with name, title, and contact links.
// Faces +X toward the camera.
// ============================================

const CAR_WIDTH = 4;

// Poster dimensions
const POSTER_W = 1.2; // z-axis (along car length)
const POSTER_H = 0.8; // y-axis
const FRAME_T = 0.02; // frame border thickness
const ACCENT_H = 0.02; // burnt orange accent line height

// Position: left wall, above seat backrest
const POSTER_X = -CAR_WIDTH / 2 + 0.02;
const POSTER_Y = 1.8;
const POSTER_Z = -2;

const C_FRAME = new THREE.Color("#333333");
const C_BG = new THREE.Color("#0e0e0e");
const C_ACCENT = new THREE.Color("#BF5700");

const FONT_URL =
  "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FPpRFhYMNbKjkCIQ.woff";

export interface PosterFrameProps {
  position?: [number, number, number];
}

export default function PosterFrame({
  position = [0, 0, 0],
}: PosterFrameProps) {
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_FRAME,
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  );

  const bgMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_BG,
        emissive: C_BG,
        emissiveIntensity: 0.05,
        roughness: 0.9,
        metalness: 0.0,
      }),
    [],
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C_ACCENT,
        emissive: C_ACCENT,
        emissiveIntensity: 0.5,
        roughness: 0.6,
        metalness: 0.2,
      }),
    [],
  );

  // Frame border segments
  const hGeo = useMemo(
    () => new THREE.BoxGeometry(0.01, FRAME_T, POSTER_W + FRAME_T * 2),
    [],
  );
  const vGeo = useMemo(
    () => new THREE.BoxGeometry(0.01, POSTER_H + FRAME_T * 2, FRAME_T),
    [],
  );
  // Background plane
  const bgGeo = useMemo(
    () => new THREE.PlaneGeometry(POSTER_W, POSTER_H),
    [],
  );
  // Accent line
  const accentGeo = useMemo(
    () => new THREE.BoxGeometry(0.005, ACCENT_H, POSTER_W - 0.04),
    [],
  );

  const hh = POSTER_H / 2;
  const hw = POSTER_W / 2;

  // Text shared props
  const textBase = {
    font: FONT_URL,
    anchorX: "left" as const,
    anchorY: "top" as const,
    maxWidth: POSTER_W - 0.1,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  };

  return (
    <group position={position}>
      <group position={[POSTER_X, POSTER_Y, POSTER_Z]}>
        {/* Background */}
        <mesh
          geometry={bgGeo}
          material={bgMat}
          rotation={[0, Math.PI / 2, 0]}
        />

        {/* Frame borders */}
        <mesh geometry={hGeo} material={frameMat} position={[0, hh, 0]} />
        <mesh geometry={hGeo} material={frameMat} position={[0, -hh, 0]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, -hw]} />
        <mesh geometry={vGeo} material={frameMat} position={[0, 0, hw]} />

        {/* Accent line at top */}
        <mesh
          geometry={accentGeo}
          material={accentMat}
          position={[0.005, hh - FRAME_T - ACCENT_H / 2, 0]}
        />

        {/* Text content — offset slightly from poster surface */}
        <group position={[0.012, 0, 0]}>
          {/* Name */}
          <Text
            {...textBase}
            fontSize={0.055}
            color="#f5f5f5"
            position={[0, hh - 0.08, hw - 0.05]}
            characters="MdRehanMolick "
          >
            Md Rehan Mollick
          </Text>

          {/* Title */}
          <Text
            {...textBase}
            fontSize={0.035}
            color="#a1a1a1"
            position={[0, hh - 0.17, hw - 0.05]}
            characters="SoftwareEnginr "
          >
            Software Engineer
          </Text>

          {/* Links */}
          <Text
            {...textBase}
            fontSize={0.03}
            color="#a1a1a1"
            position={[0, hh - 0.32, hw - 0.05]}
            characters="github.com/rehanmolick"
          >
            github.com/rehanmollick
          </Text>

          <Text
            {...textBase}
            fontSize={0.025}
            color="#a1a1a1"
            position={[0, hh - 0.40, hw - 0.05]}
            characters="linkedin.com/md-reha674b042"
          >
            linkedin.com/in/md-rehan-mollick-674b042b4
          </Text>

          <Text
            {...textBase}
            fontSize={0.03}
            color="#a1a1a1"
            position={[0, hh - 0.48, hw - 0.05]}
            characters="rehanmolick07[t]utexs.ed"
          >
            rehanmollick07[at]utexas[dot]edu
          </Text>
        </group>
      </group>
    </group>
  );
}
