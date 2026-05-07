"use client";

// Footer — bouncing LET'S DO IT. + sub + 4 contact links + credit row.
// Verbatim copy and stagger from prototype/index.html lines 1349–1365
// + CSS lines 1124–1163 per .spec/13 §C.9 + §D.7.

const TITLE_CHARS: { char: string; isSpace: boolean }[] = [
  { char: "L", isSpace: false },
  { char: "E", isSpace: false },
  { char: "T", isSpace: false },
  { char: "'", isSpace: false },
  { char: "S", isSpace: false },
  { char: " ", isSpace: true },
  { char: "D", isSpace: false },
  { char: "O", isSpace: false },
  { char: " ", isSpace: true },
  { char: "I", isSpace: false },
  { char: "T", isSpace: false },
  { char: ".", isSpace: false },
];

// :nth-child stagger from prototype CSS lines 1134–1143
// (skipping :nth-child(6) and :nth-child(9) which are spaces)
const STAGGER_S: Record<number, number> = {
  1: 0,
  2: 0.08,
  3: 0.16,
  4: 0.24,
  5: 0.32,
  7: 0.48,
  8: 0.56,
  10: 0.72,
  11: 0.8,
  12: 0.88,
};

const SUB_CHARS = ["WHAT", "ARE", "YOU", "WAITING", "ON?"];

const LINKS: { label: string; href: string }[] = [
  { label: "◉ GITHUB", href: "https://github.com/rehanmollick" },
  { label: "▣ LINKEDIN", href: "https://www.linkedin.com/in/rehanmollick" },
  { label: "✉ UT EMAIL", href: "mailto:rehanmollick07@utexas.edu" },
  { label: "✉ GMAIL", href: "mailto:rehanmollick07@gmail.com" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="footer"
      style={{
        background: "var(--page-outer)",
        padding: "80px 20px 50px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <h3
        className="footer-title"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          fontSize: "clamp(28px, 4.5vw, 56px)",
          color: "var(--accent-light)",
          margin: 0,
          letterSpacing: "0.06em",
          lineHeight: 1,
          textShadow: "0 0 18px rgba(255,140,50,.4), 0 3px 0 #6a2a00",
          display: "inline-flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {TITLE_CHARS.map((c, i) => {
          const idx = i + 1;
          const delay = STAGGER_S[idx];
          return (
            <span
              key={i}
              className={c.isSpace ? "sp" : undefined}
              style={{
                display: "inline-block",
                fontFamily: "var(--font-pixel), monospace",
                animation: c.isSpace ? "none" : "bob 1.4s ease-in-out infinite",
                animationDelay: delay !== undefined ? `${delay}s` : undefined,
                transformOrigin: "50% 80%",
                width: c.isSpace ? "0.4em" : undefined,
              }}
            >
              {c.char}
            </span>
          );
        })}
      </h3>

      <div
        className="sub"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          fontSize: "clamp(10px, 1.2vw, 13px)",
          color: "var(--text-secondary)",
          marginTop: 18,
          letterSpacing: "0.1em",
          lineHeight: 1.4,
          display: "inline-flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SUB_CHARS.map((word, i) => (
          <span
            key={word}
            className="q-q"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-pixel), monospace",
              animation: "qbob 2.6s ease-in-out infinite",
              animationDelay: `${i * 0.13}s`,
              color: i === SUB_CHARS.length - 1 ? "var(--accent)" : undefined,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div
        className="links font-mono"
        style={{
          display: "flex",
          gap: 22,
          justifyContent: "center",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div
        className="credit font-mono"
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 30,
          letterSpacing: "0.15em",
        }}
      >
        © 2026 MD REHAN MOLLICK · BUILT WITH NEXT.JS, REACT THREE FIBER,
        TYPESCRIPT, FRAMER MOTION
      </div>
    </footer>
  );
}
