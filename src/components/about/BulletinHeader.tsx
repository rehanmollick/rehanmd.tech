"use client";

// Bulletin header bar — chip + transit-authority text + close button.
// Verbatim copy from prototype/index.html lines 1407–1413 per .spec/13 §C.3.

import type { AboutConfig } from "@/lib/about";

interface Props {
  data: AboutConfig;
  onClose: () => void;
}

export default function BulletinHeader({ data, onClose }: Props) {
  return (
    <header
      className="ap-header"
      style={{
        background: "#1a0f05",
        color: "#f0d8a0",
        padding: "18px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        borderBottom: "4px double #6a4020",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "#f0d8a0",
            border: "1px solid #f0d8a0",
            padding: "4px 10px",
            textTransform: "uppercase",
          }}
        >
          {data.header.bulletinChip}
        </span>
        <span
          className="font-pixel"
          style={{
            fontSize: 14,
            letterSpacing: "0.2em",
            color: "#bf5700",
            textTransform: "uppercase",
          }}
        >
          {data.header.authority}
        </span>
      </div>

      <button
        className="ap-close font-mono"
        onClick={onClose}
        aria-label="Close"
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#f0d8a0",
          background: "transparent",
          border: "1px solid #f0d8a0",
          padding: "6px 12px",
          cursor: "pointer",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.style.background as string) = "#f0d8a0";
          e.currentTarget.style.color = "#1a0f05";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#f0d8a0";
        }}
      >
        {data.header.closeLabel}
      </button>
    </header>
  );
}
