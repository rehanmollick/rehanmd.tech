"use client";

// Facts strip — label + 4 inline list items, dark band.
// Verbatim from prototype/index.html lines 1622–1631 per .spec/13 §C.3.

export default function BulletinFacts({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div
      className="ap-facts font-mono"
      style={{
        gridColumn: "1 / -1",
        background: "#1a0f05",
        color: "#f0d8a0",
        padding: "20px 28px",
        display: "flex",
        flexWrap: "wrap",
        gap: "14px 32px",
        alignItems: "center",
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        border: "1px solid #6a4020",
      }}
    >
      <span
        className="label font-pixel"
        style={{
          fontSize: 14,
          color: "#bf5700",
          letterSpacing: "0.2em",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <ul
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "14px 28px",
          listStyle: "none",
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span aria-hidden style={{ color: "#bf5700" }}>
              ◆
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
