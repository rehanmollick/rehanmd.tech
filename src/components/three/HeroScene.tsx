"use client";

import dynamic from "next/dynamic";
import SceneLoader from "./SceneLoader";

const SubwayScene = dynamic(() => import("./SubwayScene"), { ssr: false });

export default function HeroScene() {
  return (
    <SceneLoader>
      <SubwayScene />
    </SceneLoader>
  );
}
