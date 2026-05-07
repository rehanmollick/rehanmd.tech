"use client";

// Station marker — node dot + station-sign plate + small dateDisplay caption.
// Marker hangs in the center column of a `.station` row, with the sign placed
// on the OPPOSITE side from the card slot. Verbatim from prototype/app.js:161–169
// and CSS lines 442–479 per .spec/13 §C.5.

interface Props {
  side: "left" | "right";
  stationName: string;
  dateDisplay: string;
}

export default function StationMarker({ side, stationName, dateDisplay }: Props) {
  // Card on the LEFT → sign on the RIGHT of the line, and vice versa.
  const signOnRight = side === "left";
  return (
    <div
      className="station-marker"
      style={{
        gridColumn: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        position: "relative",
        zIndex: 4,
        minWidth: 0,
      }}
    >
      <div className="station-node-wrap" style={{ position: "relative" }}>
        <span
          className="station-node"
          aria-hidden
          style={{
            display: "block",
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "5px solid var(--accent)",
            background: "var(--page-outer)",
            boxShadow:
              "0 0 0 3px var(--page-outer), 0 0 20px rgba(191,87,0,.5)",
            position: "relative",
          }}
        >
          <span
            aria-hidden
            style={{
              content: "''",
              position: "absolute",
              inset: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "block",
            }}
          />
        </span>

        <div
          className="station-sign"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [signOnRight ? "left" : "right"]: "calc(100% + 12px)",
            background:
              "linear-gradient(180deg, rgba(5,5,5,.92), rgba(5,5,5,.92))",
            border: "2px solid #2a2a2a",
            padding: 4,
            boxShadow:
              "0 4px 10px rgba(0,0,0,.5), inset 0 0 2px rgba(255,255,255,.08)",
            backdropFilter: "blur(2px)",
            maxWidth: 180,
          }}
        >
          <div
            className="station-sign-inner font-pixel"
            style={{
              background: "#000",
              padding: "4px 10px",
              fontSize: 11,
              color: "var(--accent-light)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 0 6px rgba(255,140,50,.5)",
              textAlign: "center",
              lineHeight: 1.25,
            }}
          >
            {stationName}
          </div>
        </div>

        <div
          className="sign-date font-mono"
          style={{
            position: "absolute",
            top: "calc(50% + 28px)",
            [signOnRight ? "left" : "right"]: "calc(100% + 12px)",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
            whiteSpace: "nowrap",
          }}
        >
          {dateDisplay}
        </div>
      </div>
    </div>
  );
}
