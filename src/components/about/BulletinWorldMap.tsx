"use client";

// REHAN ATLAS — hand-drawn SVG world map with 8 pins + red rope route.
// Land paths are fetched from /data/world-land-paths.html on modal open
// (~70KB gzipped reference data extracted from prototype/index.html line 1518).
// SVG viewBox: 1000 × 500. Pin coords + rope segments are spec-canonical.
// See .spec/13 §A.4 + §C.3 for the literal source.

import { useEffect, useState } from "react";
import type { AboutAtlas } from "@/lib/about";

export default function BulletinWorldMap({ atlas }: { atlas: AboutAtlas }) {
  const [landHtml, setLandHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch("/data/world-land-paths.html")
      .then((r) => (r.ok ? r.text() : ""))
      .then((html) => {
        if (!cancelled) setLandHtml(html);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="origin-line-section"
      style={{
        gridColumn: "1 / -1",
        paddingTop: 36,
        borderTop: "2px solid rgba(80,50,20,.25)",
      }}
    >
      <div
        className="ap-eyebrow font-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "#7a5520",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {atlas.eyebrow}
      </div>
      <h3
        className="ap-map-title font-pixel"
        style={{
          fontSize: 32,
          color: "#1a0f05",
          margin: "0 0 22px",
          letterSpacing: "0.02em",
          lineHeight: 1.1,
        }}
      >
        {atlas.title}
      </h3>

      <div
        className="wm-frame"
        style={{
          background: "#0a0604",
          border: "2px solid #bf5700",
          boxShadow:
            "inset 0 0 0 1px rgba(255,180,58,.18), inset 0 0 60px rgba(191,87,0,.1), 0 12px 32px rgba(0,0,0,.5)",
        }}
      >
        <header
          className="wm-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "linear-gradient(180deg,#bf5700,#7a3c00)",
            borderBottom: "2px solid #1a0f05",
            color: "#fff5e0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#15090a",
                color: "#ffb43a",
                fontSize: 12,
                fontWeight: "bold",
                letterSpacing: "1px",
                border: "2px solid #ffb43a",
              }}
            >
              {atlas.headerBullet}
            </span>
            <span
              className="font-pixel"
              style={{ fontSize: 20, letterSpacing: "0.15em" }}
            >
              {atlas.headerTitle}
            </span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#fff5e0",
              opacity: 0.85,
            }}
          >
            {atlas.headerRight}
          </div>
        </header>

        <div
          className="wm-map"
          style={{
            position: "relative",
            background: "#0a0604",
            padding: 24,
          }}
        >
          <svg
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="wm-svg"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <pattern
                id="wm-grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="rgba(191,87,0,.05)"
                  strokeWidth="1"
                />
              </pattern>
              <filter id="wm-pinglow">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            <rect x="0" y="0" width="1000" height="500" fill="#0a0604" />
            <rect x="0" y="0" width="1000" height="500" fill="url(#wm-grid)" />

            {/* Equator + tropics */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,180,58,.1)" strokeWidth="1" strokeDasharray="4 6" />
            <line x1="0" y1="184" x2="1000" y2="184" stroke="rgba(255,180,58,.05)" strokeWidth="1" strokeDasharray="2 8" />
            <line x1="0" y1="316" x2="1000" y2="316" stroke="rgba(255,180,58,.05)" strokeWidth="1" strokeDasharray="2 8" />

            {/* Ocean labels */}
            <g
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fill="rgba(255,180,58,.16)"
              fontStyle="italic"
              letterSpacing="6"
              textAnchor="middle"
            >
              <text x="100" y="260">P A C I F I C</text>
              <text x="400" y="240">A T L A N T I C</text>
              <text x="720" y="380">I N D I A N</text>
              <text x="940" y="260">P A C I F I C</text>
            </g>

            {/* Land paths injected from /data/world-land-paths.html */}
            <g
              className="wm-land"
              fill="#1a0f08"
              stroke="#bf5700"
              strokeWidth="0.5"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: landHtml }}
            />

            {/* Rope route */}
            <g className="wm-rope">
              {atlas.rope.flatMap((hop) =>
                hop.segments
                  ? hop.segments.map((seg, i) => (
                      <path
                        key={`r${hop.from}-${hop.to}-${i}`}
                        d={seg.d}
                        fill="none"
                        stroke="#9a1a1a"
                        strokeWidth="2.8"
                        strokeDasharray="8 4"
                        strokeLinecap="round"
                        opacity="0.95"
                      />
                    ))
                  : (
                    <path
                      key={`r${hop.from}-${hop.to}`}
                      d={hop.d}
                      fill="none"
                      stroke="#9a1a1a"
                      strokeWidth="2.8"
                      strokeDasharray="8 4"
                      strokeLinecap="round"
                      opacity="0.95"
                    />
                  ),
              )}
            </g>

            {/* Pin markers */}
            <g className="wm-pins">
              {atlas.pins.map((p) =>
                p.final ? (
                  <g key={p.step}>
                    <circle
                      cx={p.svgX}
                      cy={p.svgY}
                      r="22"
                      fill="none"
                      stroke="#ffb43a"
                      strokeWidth="2"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values={atlas.terminusPulse.rValues}
                        dur={atlas.terminusPulse.dur}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values={atlas.terminusPulse.opacityValues}
                        dur={atlas.terminusPulse.dur}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={p.svgX}
                      cy={p.svgY}
                      r="9"
                      fill="#ffb43a"
                      stroke="#1a0f05"
                      strokeWidth="2"
                    />
                    <text
                      x={p.svgX}
                      y={p.svgY + 4}
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#1a0f05"
                    >
                      ★
                    </text>
                  </g>
                ) : (
                  <g key={p.step}>
                    <circle
                      cx={p.svgX}
                      cy={p.svgY}
                      r={p.radius * 2}
                      fill="rgba(154,26,26,.25)"
                      filter="url(#wm-pinglow)"
                    />
                    <circle
                      cx={p.svgX}
                      cy={p.svgY}
                      r={p.radius}
                      fill="#e23b3b"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </g>
                ),
              )}
            </g>
          </svg>

          {/* HTML pin labels — positioned by % so text stays crisp on resize */}
          {atlas.pins.map((p) => (
            <div
              key={p.step}
              className={`wm-label font-mono${p.final ? " final" : ""}`}
              data-anchor={p.anchor}
              style={{
                position: "absolute",
                left: `${p.leftPct}%`,
                top: `${p.topPct}%`,
                transform: anchorTransform(p.anchor),
                background: p.final ? "#2a1505" : "#15090a",
                border: p.final
                  ? "2px solid #ffb43a"
                  : "1.5px solid #9a1a1a",
                padding: "5px 9px",
                color: "#fff5e0",
                textAlign: "center",
                lineHeight: 1.25,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                boxShadow: p.final
                  ? "0 0 0 1px #1a0f05, 0 4px 14px rgba(255,180,58,.4)"
                  : "0 0 0 1px #1a0f05, 0 4px 10px rgba(0,0,0,.6)",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 8,
                  letterSpacing: "0.25em",
                  color: p.final ? "#ffe04a" : "#e23b3b",
                  marginBottom: 2,
                }}
              >
                {p.label ?? String(p.step).padStart(2, "0")}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: p.final ? 13 : 11,
                  letterSpacing: "0.12em",
                  fontWeight: "bold",
                  color: p.final ? "#fff" : undefined,
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 7.5,
                  letterSpacing: "0.2em",
                  color: p.final ? "#ffb43a" : "#9a7a50",
                  marginTop: 2,
                  textTransform: "uppercase",
                }}
              >
                {p.sub}
              </span>
            </div>
          ))}

          <div
            className="wm-stamp tl font-mono"
            style={{
              position: "absolute",
              top: 38,
              left: 38,
              padding: "8px 12px",
              background: "rgba(255,180,58,.06)",
              border: "1px dashed rgba(255,180,58,.35)",
              fontSize: 9,
              letterSpacing: "0.25em",
              color: "#ffb43a",
              textTransform: "uppercase",
              lineHeight: 1.5,
              zIndex: 3,
            }}
          >
            {atlas.stampTL.map((line) => (
              <div key={line} style={{ whiteSpace: "nowrap" }}>
                {line}
              </div>
            ))}
          </div>

          <div
            className="wm-stamp br font-mono"
            style={{
              position: "absolute",
              bottom: 38,
              right: 38,
              padding: "8px 12px",
              background: "rgba(255,180,58,.06)",
              border: "1px dashed rgba(255,180,58,.35)",
              fontSize: 9,
              letterSpacing: "0.25em",
              color: "#ffb43a",
              textTransform: "uppercase",
              lineHeight: 1.5,
              zIndex: 3,
              textAlign: "right",
            }}
          >
            {atlas.stampBR.map((line) => (
              <div key={line} style={{ whiteSpace: "nowrap" }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div
          className="wm-legend font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "14px 20px",
            background: "#15090a",
            borderTop: "2px solid #bf5700",
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "#ffb43a",
            textTransform: "uppercase",
          }}
        >
          {atlas.legend.map((entry) => (
            <div
              key={entry.label}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              {entry.kind === "rope" && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 42,
                    height: 3,
                    borderRadius: 2,
                    background:
                      "repeating-linear-gradient(to right,#9a1a1a 0 8px,transparent 8px 12px)",
                  }}
                />
              )}
              {entry.kind === "pin" && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#e23b3b",
                    border: "2px solid #fff",
                    boxShadow: "0 0 8px rgba(226,59,59,.6)",
                  }}
                />
              )}
              {entry.kind === "terminus" && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#ffb43a",
                    border: "2px solid #1a0f05",
                    boxShadow: "0 0 12px rgba(255,180,58,.7)",
                  }}
                />
              )}
              <span>{entry.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function anchorTransform(anchor: "t" | "b" | "l" | "r"): string {
  switch (anchor) {
    case "t":
      return "translate(-50%,-115%)";
    case "b":
      return "translate(-50%,15%)";
    case "l":
      return "translate(-115%,-50%)";
    case "r":
      return "translate(15%,-50%)";
    default:
      return "translate(-50%,-50%)";
  }
}
