"use client";

// Bulletin footer — POSTED text, VERIFIED stamp circle, station signature.
// Verbatim from prototype/index.html lines 1632–1638 per .spec/13 §C.3.

import type { AboutFooter } from "@/lib/about";

export default function BulletinFooter({ footer }: { footer: AboutFooter }) {
  return (
    <footer
      className="ap-footer font-mono"
      style={{
        gridColumn: "1 / -1",
        background: "#1a0f05",
        color: "#7a5a30",
        padding: "14px 28px",
        fontSize: 9,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        borderTop: "4px double #6a4020",
        alignItems: "center",
      }}
    >
      <span>{footer.left}</span>
      <div
        className="stamp-circle font-pixel"
        style={{
          width: 60,
          height: 60,
          border: "2px solid #bf5700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          color: "#bf5700",
          textAlign: "center",
          lineHeight: 1.1,
          transform: "rotate(-12deg)",
          letterSpacing: "0.05em",
          flexShrink: 0,
          whiteSpace: "pre-line",
        }}
      >
        {footer.stamp}
      </div>
      <span>{footer.right}</span>
    </footer>
  );
}
