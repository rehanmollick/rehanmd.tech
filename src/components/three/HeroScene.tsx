"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SceneLoader from "./SceneLoader";
import PosterLinksOverlay from "./PosterLinksOverlay";

const SubwayScene = dynamic(() => import("./SubwayScene"), { ssr: false });

export default function HeroScene() {
  const [linksOpen, setLinksOpen] = useState(false);

  // Listen for custom event from PosterFrame inside the Canvas
  useEffect(() => {
    const handler = () => setLinksOpen(true);
    window.addEventListener("poster-click", handler);
    return () => window.removeEventListener("poster-click", handler);
  }, []);

  return (
    <>
      <SceneLoader>
        <SubwayScene />
      </SceneLoader>
      <PosterLinksOverlay open={linksOpen} onClose={() => setLinksOpen(false)} />
    </>
  );
}
