// Top-of-stage HTML marquee. Strings + animation duration are extracted from
// .spec/13-prototype-literal-extracts.md §C.1 + §D.1 — verbatim from
// prototype/app.js:10 and prototype/index.html:88.

const MARQUEE_TEXT = [
  "WELCOME ABOARD",
  "THIS IS NOT YOUR USUAL COMMUTE",
  "HOW DID YOU END UP HERE?",
  "THE TUNNEL GOES DEEPER",
  "MIND THE GAP",
  "NOW BOARDING: MARCH 2026",
  "THIS TRAIN RUNS ON CAFFEINE",
];

// Joined with two-spaces + bullet + two-spaces, with a trailing separator,
// then doubled so translateX(-50%) creates a seamless loop.
const TRACK = MARQUEE_TEXT.join("  •  ") + "  •  ";
const DOUBLED = TRACK + TRACK;

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 top-[15%] h-10 overflow-hidden flex items-center pointer-events-none border-y"
      style={{
        background: "#0a0705",
        borderColor: "#3a2010",
      }}
    >
      <div
        className="flex gap-20 whitespace-nowrap font-pixel"
        style={{
          color: "var(--accent-light)",
          fontSize: "22px",
          letterSpacing: "0.1em",
          textShadow: "0 0 8px rgba(255,140,50,.6)",
          animation: "marquee 45s linear infinite",
        }}
      >
        {DOUBLED}
      </div>
    </div>
  );
}
