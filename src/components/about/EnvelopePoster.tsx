"use client";

// Wheatpaste poster trigger that opens the bulletin modal.
// Visual + copy verbatim from prototype/index.html lines 1219–1245
// per .spec/13-prototype-literal-extracts.md §C.2.
//
// NOTE: the prototype does NOT have a sealed-envelope-with-flap variant
// (per user confirmation). This is a single flat poster.

interface Props {
  onOpen: () => void;
}

export default function EnvelopePoster({ onOpen }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the bulletin"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="about-trigger pointer-events-auto"
      style={{
        position: "relative",
        width: "min(420px, 92vw)",
        aspectRatio: "3 / 4",
        cursor: "pointer",
        background:
          "linear-gradient(160deg, #f4e8c8 0%, #e9d9a8 50%, #d8c186 100%)",
        color: "#1a0f05",
        transform: "rotate(-2.2deg)",
        boxShadow:
          "0 30px 50px -10px rgba(0,0,0,.7), 0 8px 20px rgba(0,0,0,.5), inset 0 0 60px rgba(120,70,20,.18), inset 0 0 0 1px rgba(120,70,20,.3)",
        padding: "30px 26px",
        transition: "transform .25s ease, box-shadow .25s ease",
        overflow: "hidden",
      }}
    >
      {/* Corner brackets */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* Tape strips */}
      <Tape pos="t1" />
      <Tape pos="t2" />

      <div
        className="font-mono"
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "#7a3a05",
          textTransform: "uppercase",
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        ▸ PULL HERE
      </div>

      <div
        className="font-pixel"
        style={{
          fontSize: "clamp(20px, 4.2vw, 30px)",
          lineHeight: 1.15,
          color: "#1a0f05",
          textAlign: "center",
          margin: "18px 0 14px",
          letterSpacing: "0.02em",
          textShadow: "2px 2px 0 rgba(191,87,0,.35)",
        }}
      >
        WHO IS THIS GUY?
      </div>

      <div
        className="font-mono"
        style={{
          fontSize: "12px",
          letterSpacing: "0.1em",
          color: "#3a2510",
          textAlign: "center",
          lineHeight: 1.5,
          marginTop: "6px",
        }}
      >
        Tap to read the full bulletin.
      </div>

      <div
        style={{
          width: "60%",
          margin: "18px auto",
          height: 0,
          borderTop: "1px dashed rgba(80,50,20,.45)",
        }}
      />

      <div
        className="font-mono"
        style={{
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "#5a3010",
          textAlign: "center",
          textTransform: "uppercase",
          lineHeight: 1.8,
        }}
      >
        FILE NO. <strong style={{ color: "#1a0f05" }}>RM·26·001</strong>
        <br />
        ISSUED — <strong style={{ color: "#1a0f05" }}>AUSTIN, TX</strong>
        <br />
        SUBJECT — <strong style={{ color: "#1a0f05" }}>MD REHAN MOLLICK</strong>
        <br />
        STATUS — <strong style={{ color: "#1a0f05" }}>BUILDING</strong>
      </div>

      <div
        className="font-mono"
        style={{
          position: "absolute",
          bottom: "90px",
          right: "24px",
          width: "96px",
          height: "96px",
          border: "2px solid rgba(154,26,26,.55)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "rgba(154,26,26,.7)",
          fontSize: "8px",
          letterSpacing: "0.2em",
          textAlign: "center",
          lineHeight: 1.3,
          transform: "rotate(-12deg)",
          textTransform: "uppercase",
          background: "rgba(255,250,230,.15)",
        }}
      >
        CLASSIFIED · OPEN ME
      </div>

      <div
        className="font-pixel"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          fontSize: "48px",
          color: "#bf5700",
          animation: "pull 1.6s ease-in-out infinite",
          transform: "translateX(-50%)",
        }}
      >
        ↘
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 20,
    height: 20,
    border: "2px solid #1a0f05",
    opacity: 0.5,
  };
  const variants: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 8, left: 8, borderRight: 0, borderBottom: 0 },
    tr: { top: 8, right: 8, borderLeft: 0, borderBottom: 0 },
    bl: { bottom: 8, left: 8, borderRight: 0, borderTop: 0 },
    br: { bottom: 8, right: 8, borderLeft: 0, borderTop: 0 },
  };
  return <span aria-hidden style={{ ...base, ...variants[pos] }} />;
}

function Tape({ pos }: { pos: "t1" | "t2" }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 90,
    height: 24,
    background: "rgba(220,200,140,.55)",
    border: "1px dashed rgba(80,60,30,.3)",
    boxShadow: "0 2px 4px rgba(0,0,0,.15)",
  };
  const variants: Record<typeof pos, React.CSSProperties> = {
    t1: {
      top: -10,
      left: "50%",
      transform: "translateX(-65%) rotate(-6deg)",
    },
    t2: {
      bottom: -10,
      right: 18,
      transform: "rotate(8deg)",
      width: 70,
    },
  };
  return <span aria-hidden style={{ ...base, ...variants[pos] }} />;
}
