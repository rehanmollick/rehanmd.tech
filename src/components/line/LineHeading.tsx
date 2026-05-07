"use client";

// Line section heading: h2 + subtitle + LIVE badge.
// Verbatim from prototype/index.html lines 1294–1298 per .spec/13 §C.5.

interface Props {
  stationCount: number;
}

export default function LineHeading({ stationCount }: Props) {
  return (
    <div
      className="line-heading"
      style={{
        maxWidth: 820,
        margin: "0 auto 40px",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      <h2
        className="font-pixel"
        style={{
          fontSize: 56,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        The Line
      </h2>
      <div
        className="subtitle font-mono"
        style={{
          color: "var(--text-muted)",
          fontSize: 13,
          marginTop: 8,
          letterSpacing: "0.15em",
        }}
      >
        EVERY PROJECT IS A STOP.
      </div>
      <div
        className="badge font-pixel"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginTop: 18,
          padding: "8px 18px",
          border: "1px solid var(--accent-dim)",
          background: "rgba(191,87,0,.05)",
          fontSize: 16,
          color: "var(--accent-light)",
          letterSpacing: "0.2em",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            background: "#ff5a2a",
            borderRadius: "50%",
            animation: "flicker 1.5s infinite",
            boxShadow: "0 0 8px #ff5a2a",
          }}
        />
        LIVE · ORANGE LINE · {stationCount} STATIONS
      </div>
    </div>
  );
}
