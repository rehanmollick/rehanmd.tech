"use client";

// The Line — outer section frame with steam-vent atmosphere + tunnel washes.
// Composes heading, arrivals board, legend, and metro track.
// Layout extracted from prototype/index.html lines 1290–1346 + CSS lines 309–332
// per .spec/13 §C.5.

import type { Project } from "@/lib/projects";
import LineHeading from "./LineHeading";
import LineLegend from "./LineLegend";
import ArrivalsBoard from "./ArrivalsBoard";
import MetroTrack from "./MetroTrack";

export default function LineSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="projects"
      className="line-section"
      style={{
        position: "relative",
        background: "var(--page-outer)",
        padding: "80px 0 120px",
        overflow: "hidden",
      }}
    >
      {/* Tunnel atmosphere wash */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 900px 400px at 50% 0%, rgba(191,87,0,.06), transparent 60%), radial-gradient(ellipse 600px 300px at 15% 50%, rgba(60,30,10,.4), transparent 70%), radial-gradient(ellipse 600px 300px at 85% 80%, rgba(60,30,10,.3), transparent 70%)",
        }}
      />
      <Steam top="20%" left="10%" delay="0s" />
      <Steam top="60%" right="15%" delay="3s" />
      <Steam top="40%" left="45%" delay="5s" />

      <LineHeading stationCount={projects.length} />
      <ArrivalsBoard />
      <LineLegend />
      <MetroTrack projects={projects} />
    </section>
  );
}

function Steam({
  top,
  left,
  right,
  delay = "0s",
}: {
  top: string;
  left?: string;
  right?: string;
  delay?: string;
}) {
  return (
    <span
      aria-hidden
      className="steam"
      style={{
        position: "absolute",
        width: 60,
        height: 120,
        opacity: 0.08,
        pointerEvents: "none",
        zIndex: 1,
        background: "radial-gradient(ellipse at bottom, #fff, transparent 70%)",
        filter: "blur(12px)",
        animation: "steam 8s ease-in-out infinite",
        animationDelay: delay,
        top,
        left,
        right,
      }}
    />
  );
}
