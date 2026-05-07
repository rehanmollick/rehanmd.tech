"use client";

// 4-item legend below the arrivals board.
// Verbatim from prototype/index.html lines 1314–1319 per .spec/13 §C.5.

export default function LineLegend() {
  return (
    <div
      className="line-legend font-mono"
      style={{
        maxWidth: 820,
        margin: "0 auto 30px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        fontSize: 11,
        color: "var(--text-muted)",
        letterSpacing: "0.1em",
        padding: "10px 16px",
        border: "1px solid #1d1d1d",
        background: "rgba(15,12,8,.6)",
        flexWrap: "wrap",
      }}
    >
      <Item>
        <span
          aria-hidden
          style={{
            width: 18,
            height: 6,
            background: "var(--accent)",
            borderRadius: 3,
          }}
        />
        <span>ORANGE LINE · MAIN</span>
      </Item>
      <Item>
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            border: "2px solid var(--accent)",
            borderRadius: "50%",
            background: "var(--page-outer)",
          }}
        />
        <span>STATION · SHIPPED</span>
      </Item>
      <Item>
        <span
          aria-hidden
          style={{
            width: 16,
            height: 2,
            background:
              "repeating-linear-gradient(to right,var(--accent-dim) 0 4px, transparent 4px 8px)",
          }}
        />
        <span>BRANCH · ABANDONED</span>
      </Item>
      <span style={{ marginLeft: "auto", color: "var(--accent-light)" }}>
        ◉ NOW BOARDING: MARCH 2026
      </span>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="key" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </div>
  );
}
