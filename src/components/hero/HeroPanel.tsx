// Centered hero panel. Copy is verbatim from prototype/index.html:1209–1214 per
// .spec/13-prototype-literal-extracts.md §C.1.

export default function HeroPanel() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
      <div
        className="text-center"
        style={{
          maxWidth: "min(90vw, 720px)",
          padding: "28px 40px",
          background: "rgba(10,8,5,.7)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          border: "2px solid var(--accent)",
          boxShadow:
            "0 0 40px rgba(191,87,0,.2), inset 0 0 20px rgba(191,87,0,.08)",
        }}
      >
        <h1
          className="font-pixel m-0"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(28px,5.5vw,54px)",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          Md Rehan Mollick
        </h1>
        <div
          className="font-mono mt-2.5"
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            letterSpacing: "0.2em",
          }}
        >
          SOFTWARE ENGINEER · UT AUSTIN · BUILDER
        </div>
      </div>
    </div>
  );
}
