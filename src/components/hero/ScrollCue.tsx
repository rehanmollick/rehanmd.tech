// Bottom-center SCROLL cue. Copy + style verbatim from prototype/index.html:1108–1112
// + the 'blink' keyframe at line 113. See .spec/13 §C.1 + §D.19.

export default function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 -translate-x-1/2 font-pixel pointer-events-none z-[2]"
      style={{
        bottom: "40px",
        fontSize: "18px",
        color: "var(--text-muted)",
        letterSpacing: "0.3em",
        animation: "blink 2s infinite",
      }}
    >
      SCROLL
    </div>
  );
}
