"use client";

// Dispatches section — paginated brick-wall corkboard with up to 9 cards per wall.
// Layout, organic-jitter algorithm, and pagination wiring extracted verbatim from
// prototype/app.js lines 36–130 + index.html lines 1248–1288 per .spec/13 §C.4.

import { useMemo, useState } from "react";
import type { BlogPostMeta } from "@/lib/mdx";
import DispatchCard from "./DispatchCard";

const PER_WALL = 9;
const NEW_DISPATCH_TILE = "__add__";

interface Props {
  posts: BlogPostMeta[];
}

export default function DispatchesSection({ posts }: Props) {
  // Append the "+ PIN A DISPATCH" placeholder tile after the real posts (admin affordance).
  type WallItem = BlogPostMeta | typeof NEW_DISPATCH_TILE;
  const items: WallItem[] = [...posts, NEW_DISPATCH_TILE];

  const walls: WallItem[][] = [];
  for (let i = 0; i < items.length; i += PER_WALL) {
    walls.push(items.slice(i, i + PER_WALL));
  }
  if (walls.length === 0) walls.push([]);

  const [currentWall, setCurrentWall] = useState(0);
  const total = walls.length;

  const layouts = useMemo(
    () => walls.map((w) => organicLayout(w.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts.length],
  );

  return (
    <section
      id="dispatches"
      className="dispatches"
      style={{
        position: "relative",
        padding: "100px 0 60px",
        background: "var(--page-outer)",
        overflow: "hidden",
      }}
    >
      <header
        className="dispatches-header"
        style={{
          maxWidth: 1280,
          margin: "0 auto 20px",
          padding: "0 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            className="font-pixel"
            style={{
              fontSize: 44,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Dispatches
          </h2>
          <p
            className="font-mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              margin: "6px 0 0",
              letterSpacing: "0.15em",
            }}
          >
            Field notes from the platform.
          </p>
        </div>

        <div
          className="dispatches-controls font-mono"
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <WallNavBtn
            label="Previous wall"
            disabled={currentWall === 0}
            onClick={() => setCurrentWall((c) => Math.max(0, c - 1))}
          >
            ◀
          </WallNavBtn>
          <span
            className="wall-indicator"
            style={{
              padding: "0 12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            WALL {currentWall + 1} / {total}
          </span>
          <WallNavBtn
            label="Next wall"
            disabled={currentWall >= total - 1}
            onClick={() => setCurrentWall((c) => Math.min(total - 1, c + 1))}
          >
            ▶
          </WallNavBtn>
        </div>
      </header>

      <div
        className="wall-viewport"
        style={{
          position: "relative",
          height: 760,
          overflow: "hidden",
          background:
            "linear-gradient(to right, transparent 0 48%, var(--brick-mortar) 48% 52%, transparent 52% 100%), repeating-linear-gradient(to bottom, var(--brick-a) 0, var(--brick-a) 44px, var(--brick-mortar) 44px, var(--brick-mortar) 48px, var(--brick-b) 48px, var(--brick-b) 92px, var(--brick-mortar) 92px, var(--brick-mortar) 96px)",
          backgroundSize: "160px 96px, auto",
        }}
      >
        {/* Spotlights from above + bottom darkening */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            background:
              "radial-gradient(ellipse 420px 300px at 18% -5%, rgba(255,180,90,.28), transparent 70%), radial-gradient(ellipse 420px 300px at 50% -5%, rgba(255,180,90,.22), transparent 70%), radial-gradient(ellipse 420px 300px at 82% -5%, rgba(255,180,90,.28), transparent 70%), linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.6) 100%)",
          }}
        />

        {/* Ceiling lights row (8 lamps) */}
        <div
          className="wall-lights"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            zIndex: 3,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: 40,
                background: "linear-gradient(to bottom, #2a2520, #111)",
                position: "relative",
                borderBottom: "2px solid #000",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: 2,
                  height: 20,
                  background: "#111",
                  transform: "translateX(-50%)",
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: -6,
                  right: -6,
                  height: 8,
                  background:
                    "radial-gradient(ellipse, var(--lamp), transparent 70%)",
                  filter: "blur(2px)",
                  opacity: 0.9,
                }}
              />
            </span>
          ))}
        </div>

        {/* Wall track — animated horizontally to slide between walls */}
        <div
          className="wall-track"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            transform: `translateX(-${currentWall * 100}%)`,
            transition: "transform .6s cubic-bezier(.76,0,.24,1)",
          }}
        >
          {walls.map((wallItems, wi) => (
            <div
              key={wi}
              className="wall-panel"
              style={{
                flex: "0 0 100%",
                position: "relative",
                height: "100%",
                padding: "56px 80px 40px",
              }}
            >
              <div
                className="pinboard"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                {wallItems.map((item, i) => {
                  const layout = layouts[wi][i];
                  if (item === NEW_DISPATCH_TILE) {
                    return <ComingSoonTile key="more" layout={layout} />;
                  }
                  return (
                    <DispatchCard
                      key={item.slug}
                      post={item}
                      index={i}
                      layout={layout}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative transit-map prop, bottom-right */}
        <WallMapDecoration />
      </div>
    </section>
  );
}

function WallNavBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        border: "1px solid #333",
        background: "#111",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

// Public-facing "end of stream" placeholder — same striped paper as the
// prototype's admin tile but with no link and no plus glyph.
function ComingSoonTile({
  layout,
}: {
  layout: { x: number; y: number; w: number; h: number; tilt: number; z: number };
}) {
  return (
    <div
      aria-hidden
      className="dispatch coming-soon-tile font-pixel"
      style={{
        position: "absolute",
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: layout.w,
        height: layout.h,
        transform: `rotate(${layout.tilt}deg)`,
        zIndex: layout.z,
        background:
          "repeating-linear-gradient(45deg, #1a1208 0 8px, #2a1c0f 8px 16px)",
        color: "var(--text-muted)",
        border: "2px dashed var(--accent-dim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 18,
      }}
    >
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 28, lineHeight: 1, color: "var(--accent-dim)" }}>
          ◉
        </div>
        <div style={{ fontSize: 13, letterSpacing: "0.2em", marginTop: 10 }}>
          MORE COMING SOON
        </div>
      </div>
    </div>
  );
}

function WallMapDecoration() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        right: 40,
        bottom: 40,
        width: 200,
        height: 140,
        background: "linear-gradient(180deg,#2a2520,#1a1510)",
        border: "4px solid #0a0806",
        boxShadow: "0 6px 12px rgba(0,0,0,.6)",
        opacity: 0.8,
        zIndex: 4,
        padding: 8,
      }}
    >
      <div
        className="font-pixel"
        style={{
          fontSize: 10,
          color: "var(--accent-light)",
          letterSpacing: "0.2em",
          marginBottom: 4,
        }}
      >
        &gt; TRANSIT MAP
      </div>
      <svg viewBox="0 0 184 100" width="100%" height="100">
        <line x1="10" y1="50" x2="60" y2="50" stroke="var(--accent)" strokeWidth="3" fill="none" />
        <line x1="60" y1="50" x2="90" y2="20" stroke="var(--accent)" strokeWidth="3" fill="none" />
        <line x1="90" y1="20" x2="140" y2="20" stroke="var(--accent)" strokeWidth="3" fill="none" />
        <line x1="140" y1="20" x2="170" y2="50" stroke="var(--accent)" strokeWidth="3" fill="none" />
        <line x1="90" y1="20" x2="90" y2="80" stroke="var(--accent)" strokeWidth="3" fill="none" />
        {[
          [10, 50],
          [60, 50],
          [90, 20],
          [140, 20],
          [170, 50],
          [90, 80],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="#0a0806"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}

// organicLayout — verbatim from prototype/app.js:89-107.
// Deterministic seed via Math.sin(i * 73.13) gives reproducible jitter per index.
function organicLayout(n: number) {
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) cells.push({ r, c });
  }
  const positions: {
    x: number;
    y: number;
    w: number;
    h: number;
    tilt: number;
    z: number;
  }[] = [];
  const seed = (i: number) => (Math.sin(i * 73.13) + 1) / 2;
  for (let i = 0; i < n; i++) {
    const cell = cells[i % 9];
    const baseX = 6 + cell.c * 30;
    const baseY = 4 + cell.r * 32;
    const jx = (seed(i * 2) - 0.5) * 6;
    const jy = (seed(i * 2 + 1) - 0.5) * 5;
    const w = 220 + Math.round(seed(i * 3) * 60);
    const h = 180 + Math.round(seed(i * 4) * 50);
    const tilt = (seed(i * 5) - 0.5) * 14;
    positions.push({ x: baseX + jx, y: baseY + jy, w, h, tilt, z: i + 1 });
  }
  return positions;
}
