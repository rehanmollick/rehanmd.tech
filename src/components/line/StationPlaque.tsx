"use client";

// Bolted plaque card hung off each station marker.
// Verbatim layout + content template from prototype/app.js:287–383
// + CSS lines 497–637 per .spec/13 §C.6.

import { useState } from "react";
import type { Project, ProjectSlide } from "@/lib/projects";
import GithubIcon from "@/components/icons/GithubIcon";
import PlaqueMedia from "./PlaqueMedia";
import Lightbox from "./Lightbox";

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
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [stackOpen, setStackOpen] = useState(false);

  const slides: ProjectSlide[] =
    project.slides.length > 0
      ? project.slides
      : [{ type: "placeholder", label: "media coming soon" }];

  return (
    <>
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
        <Bolt pos="tl" />
        <Bolt pos="tr" />
        <Bolt pos="bl" />
        <Bolt pos="br" />

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
          {/* Enamel sheen */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(135deg, rgba(255,200,120,.04) 0%, transparent 40%)",
            }}
          />

          {/* Top bar */}
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

          {/* Title */}
          <h3
            className="plaque-title font-pixel"
            style={{
              fontSize: 34,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h3>

          {/* Context badge (optional) — static callout, no chevron glyph
              since it isn't an expandable element. */}
          {project.context && (
            <div
              className="plaque-ctx font-mono"
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent-light)",
                background: "rgba(191,87,0,.12)",
                border: "1px solid var(--accent-dim)",
                borderLeft: "3px solid var(--accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(255,140,50,.4)",
              }}
            >
              {project.context}
            </div>
          )}

          {/* Media carousel */}
          <PlaqueMedia
            slides={slides}
            onOpenLightbox={(i) => {
              setLbIdx(i);
              setLbOpen(true);
            }}
          />

          {/* Description */}
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

          {/* Links */}
          <div
            className="plaque-links"
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {project.liveUrl && (
              <a
                className="plaque-link primary font-mono"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  background: "var(--accent)",
                  color: "#050505",
                  border: "1px solid var(--accent)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                ▸ LIVE DEMO
              </a>
            )}
            {project.repoUrl && (
              <a
                className="plaque-link secondary font-mono"
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  border: "1px solid #333",
                  color: "var(--text-secondary)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                <GithubIcon size={12} /> REPO
              </a>
            )}
          </div>

          {/* Tech ticker (chips) */}
          <div
            className="plaque-tech"
            style={{
              marginTop: 14,
              border: "1px solid #3a2010",
              background: "#050201",
              padding: 4,
            }}
          >
            <div
              className="plaque-tech-label font-mono"
              style={{
                fontSize: 9,
                color: "var(--text-muted)",
                letterSpacing: "0.2em",
                padding: "0 6px",
                textTransform: "uppercase",
              }}
            >
              BUILT WITH
            </div>
            <div
              className="plaque-tech-chips"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                padding: 6,
              }}
            >
              {project.techStack.map((t) => (
                <span
                  key={t.name}
                  className="tech-chip font-pixel"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: "var(--accent-light)",
                    background: "#0a0503",
                    border: "1px solid #3a2010",
                    padding: "3px 10px",
                    letterSpacing: "0.1em",
                    textShadow: "0 0 4px rgba(255,140,50,.4)",
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      boxShadow: "0 0 6px var(--accent)",
                    }}
                  />
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stack toggle — just bright colored text with a chevron. */}
          <button
            type="button"
            className={`stack-toggle font-mono${stackOpen ? " open" : ""}`}
            onClick={() => setStackOpen((v) => !v)}
            style={{
              marginTop: 14,
              padding: 0,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              background: "transparent",
              border: 0,
              cursor: "pointer",
              textShadow: "0 0 10px rgba(255,255,255,.25)",
              borderBottom: "1px solid rgba(255,255,255,.4)",
              paddingBottom: 2,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "#fff";
              e.currentTarget.style.textShadow = "0 0 14px rgba(255,255,255,.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "rgba(255,255,255,.4)";
              e.currentTarget.style.textShadow = "0 0 10px rgba(255,255,255,.25)";
            }}
          >
            <span
              className="chev"
              aria-hidden
              style={{
                display: "inline-block",
                transition: "transform .2s",
                transform: stackOpen ? "rotate(90deg)" : undefined,
                fontSize: 16,
              }}
            >
              ▸
            </span>
            {stackOpen ? "HIDE THE STACK" : "WHY THIS STACK"}
          </button>

          {stackOpen && (
            <div
              className="stack-expanded font-mono"
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderLeft: "2px solid var(--accent-dim)",
                background: "rgba(191,87,0,.04)",
                fontSize: 12,
              }}
            >
              {project.techStack.map((t) => (
                <div
                  key={t.name}
                  className="stack-item"
                  style={{ marginBottom: 10 }}
                >
                  <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                    {t.name}:
                  </strong>{" "}
                  <span
                    className="r"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
                  >
                    {t.reason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={lbOpen}
        title={project.title}
        slides={slides}
        index={lbIdx}
        onChangeIndex={setLbIdx}
        onClose={() => setLbOpen(false)}
      />
    </>
  );
}

function Bolt({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const variants: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 8, left: 8 },
    tr: { top: 8, right: 8 },
    bl: { bottom: 8, left: 8 },
    br: { bottom: 8, right: 8 },
  };
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 30%, #d4a05a, #6a4420 60%, #2a1808)",
        boxShadow: "0 0 0 1px #000, inset 0 -1px 2px rgba(0,0,0,.6)",
        zIndex: 3,
        ...variants[pos],
      }}
    />
  );
}
