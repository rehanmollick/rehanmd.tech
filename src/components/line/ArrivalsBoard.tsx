"use client";

// Black arrivals board with 4 hardcoded rows + ticking clock.
// Verbatim copy from prototype/index.html lines 1300–1311 + clock from app.js:14–16.
// .spec/13 §C.5 + §E.19.

import { useEffect, useState } from "react";

const ROWS = [
  { time: "NOW", title: "KARMEN PLAYGROUND", platform: "PLAT 7", status: "BOARDING", flicker: true },
  { time: "-02M", title: "GRIDPULSE", platform: "PLAT 6", status: "DEPARTED", flicker: false },
  { time: "-05M", title: "FLIGHTSENSE", platform: "PLAT 5", status: "DEPARTED", flicker: false },
  { time: "+∞", title: "NEXT STOP: TBD", platform: "—", status: "INCOMING", flicker: false },
];

export default function ArrivalsBoard() {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="arrivals-board"
      style={{
        maxWidth: 820,
        margin: "0 auto 50px",
        background: "linear-gradient(180deg,#0a0705,#000)",
        border: "3px solid #1a1005",
        boxShadow:
          "0 0 0 1px #000, 0 10px 30px rgba(0,0,0,.8), inset 0 0 40px rgba(0,0,0,.9), inset 0 2px 6px rgba(255,150,50,.1)",
        padding: 4,
      }}
    >
      <div
        className="arrivals-inner"
        style={{ background: "#000", padding: "14px 20px 12px", position: "relative" }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,120,40,.04) 2px 3px)",
          }}
        />
        <div
          className="arrivals-top font-pixel"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--accent-light)",
            fontSize: 16,
            letterSpacing: "0.25em",
            paddingBottom: 8,
            borderBottom: "1px solid #2a1805",
            marginBottom: 10,
            textShadow: "0 0 6px rgba(255,140,50,.6)",
          }}
        >
          <span>▸ NEXT ARRIVALS</span>
          <span className="clock">{clock}</span>
        </div>

        {ROWS.map((row, i) => (
          <Row key={i} {...row} />
        ))}

        <div
          className="arrivals-headline font-mono"
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          NOW BOARDING · ALL TRACKS ACTIVE
        </div>
      </div>
    </div>
  );
}

function Row({
  time,
  title,
  platform,
  status,
  flicker,
}: {
  time: string;
  title: string;
  platform: string;
  status: string;
  flicker: boolean;
}) {
  return (
    <div
      className="arrivals-row font-pixel"
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 100px 80px",
        gap: 12,
        alignItems: "center",
        padding: "6px 0",
        fontSize: 22,
        color: "#ff9f4a",
        textShadow: "0 0 6px rgba(255,140,50,.65)",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      <span className="time" style={{ color: "var(--accent-light)" }}>
        {time}
      </span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      <span
        className="platform"
        style={{
          textAlign: "center",
          color: "#fff",
          background: "#1a0f05",
          padding: "2px 6px",
          whiteSpace: "nowrap",
        }}
      >
        {platform}
      </span>
      <span
        className="status"
        style={{
          color: flicker ? "#ff5a2a" : "#ffb43a",
          fontSize: 18,
          textAlign: "right",
          letterSpacing: "0.15em",
          animation: flicker ? "flicker 1.5s infinite" : undefined,
        }}
      >
        {status}
      </span>
    </div>
  );
}
