"use client";

// Origin / Upcoming terminus markers. Verbatim from prototype/index.html
// lines 1325–1344 + CSS lines 482–495 per .spec/13 §C.5.

interface Props {
  variant: "origin" | "upcoming";
  label: string;
  sub: string;
}

export default function Terminus({ variant, label, sub }: Props) {
  return (
    <div
      className={`terminus ${variant}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: "center",
        padding: "20px 0",
        position: "relative",
        zIndex: 3,
      }}
    >
      <span
        className="tn-icon"
        aria-hidden
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "5px solid var(--accent)",
          background:
            variant === "origin" ? "var(--accent)" : "var(--page-outer)",
          position: "relative",
          boxShadow: "0 0 20px rgba(191,87,0,.4)",
        }}
      >
        {variant === "origin" && (
          <>
            <span
              aria-hidden
              style={{
                content: "''",
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                background: "var(--page-outer)",
                display: "block",
              }}
            />
            <span
              aria-hidden
              style={{
                content: "''",
                position: "absolute",
                inset: 14,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "block",
              }}
            />
          </>
        )}
        {variant === "upcoming" && (
          <span
            aria-hidden
            style={{
              content: "''",
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "pulse 2s infinite",
              display: "block",
            }}
          />
        )}
      </span>
      <div>
        <div
          className="tn-label font-pixel"
          style={{
            color: "var(--accent-light)",
            fontSize: 22,
            letterSpacing: "0.15em",
          }}
        >
          {label}
        </div>
        <div
          className="tn-sub font-mono"
          style={{
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.15em",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
