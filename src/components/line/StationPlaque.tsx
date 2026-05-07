"use client";

// Phase B4 will fully implement the bolted plaque per .spec/13 §C.6.
// For now this is a minimal placeholder that renders the plaque frame +
// title + station/date row so the metro track can settle into its
// final layout while we build the carousel + lightbox in B4.

import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  stationIndex: number;
  totalProjects: number;
}

export default function StationPlaque({
  project,
  stationIndex,
  totalProjects,
}: Props) {
  const stationNum = String(totalProjects - stationIndex).padStart(2, "0");
  return (
    <div
      className="plaque"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #1a1205 0%, #0f0803 100%)",
        border: "3px solid var(--accent)",
        padding: 4,
        boxShadow:
          "0 0 0 2px #000, 0 10px 30px rgba(0,0,0,.7), inset 0 0 30px rgba(191,87,0,.06)",
      }}
    >
      <div
        className="plaque-inner"
        style={{
          position: "relative",
          background: "linear-gradient(180deg,#0a0503,#050201)",
          border: "1px solid #3a2010",
          padding: "20px 22px",
          overflow: "hidden",
        }}
      >
        <div
          className="plaque-top font-mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            paddingBottom: 10,
            borderBottom: "1px dashed var(--accent-dim)",
            marginBottom: 14,
          }}
        >
          <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>
            STATION {stationNum}
          </span>
          <span>ORANGE LINE</span>
          <span style={{ color: "var(--text-secondary)" }}>
            {project.dateDisplay}
          </span>
        </div>
        <h3
          className="plaque-title font-pixel"
          style={{
            fontSize: 28,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          {project.title}
        </h3>
        {project.context && (
          <div
            className="plaque-ctx font-mono"
            style={{
              fontSize: 11,
              color: "var(--accent-light)",
              marginTop: 10,
              letterSpacing: "0.1em",
            }}
          >
            ▸ {project.context}
          </div>
        )}
        <p
          className="plaque-desc font-mono"
          style={{
            margin: "14px 0 0",
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {project.description}
        </p>
        <div
          className="font-mono"
          style={{
            marginTop: 14,
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {/* Phase B4: carousel + tech chips + WHY THIS STACK + links land here */}
          ▸ FULL PLAQUE COMING IN B4
        </div>
      </div>
    </div>
  );
}
