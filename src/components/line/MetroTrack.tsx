"use client";

// Metro track — alternating-column station list with a single SVG line drawn
// dynamically across the station nodes. Algorithm + per-station layout
// extracted verbatim from prototype/app.js:132–282 per .spec/13 §C.5 + §E.22.

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import StationMarker from "./StationMarker";
import StationPlaque from "./StationPlaque";
import Terminus from "./Terminus";

// Layout — every station has its own horizontal shift, alternating sides.
// The whole row (card + marker) translates together, so the line is
// VERTICAL at every station (the card aligns with the flat segment of the
// line that passes through its node) and the variation happens BETWEEN
// stations as the line jogs from one station's x to the next.
//
// Most stations sit on the baseline (shift 0). Occasional pairs jog left
// or right by a substantial amount, then the line returns to baseline.
// Each "section" of jogged stations is the line itself moving, with cards
// glued to the line on alternating sides. Big jogs randomly placed.
//   stations 0,1:    0       baseline
//   stations 2,3:  -55       medium-big jog left
//   station  4:      0       back to baseline (single)
//   station  5:    +75       BIG single-station jog right
//   stations 6,7:    0       baseline
//   stations 8,9:  -30       smaller jog left near the bottom
const STATION_SHIFTS = [0, 0, -55, -55, 0, 75, 0, 0, -30, -30];

function layoutFor(index: number): { shift: number; side: "left" | "right" } {
  const side: "left" | "right" = index % 2 === 0 ? "right" : "left";
  const shift = STATION_SHIFTS[index % STATION_SHIFTS.length];
  return { shift, side };
}

interface Props {
  projects: Project[];
}

export default function MetroTrack({ projects }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  const [bulbs, setBulbs] = useState<{ x: number; y: number; dim: boolean }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const draw = () => {
      const body = bodyRef.current;
      if (!body) return;
      const bodyRect = body.getBoundingClientRect();
      const W = bodyRect.width;
      const H = body.offsetHeight;
      setSize({ w: W, h: H });

      const points: { x: number; y: number }[] = [];
      const tnIcons = body.querySelectorAll(".terminus .tn-icon");
      if (tnIcons[0]) {
        const r = tnIcons[0].getBoundingClientRect();
        points.push({
          x: r.left - bodyRect.left + r.width / 2,
          y: r.top - bodyRect.top + r.height / 2,
        });
      }
      body.querySelectorAll(".station-node").forEach((n) => {
        const r = n.getBoundingClientRect();
        points.push({
          x: r.left - bodyRect.left + r.width / 2,
          y: r.top - bodyRect.top + r.height / 2,
        });
      });
      if (tnIcons[1]) {
        const r = tnIcons[1].getBoundingClientRect();
        points.push({
          x: r.left - bodyRect.left + r.width / 2,
          y: r.top - bodyRect.top + r.height / 2,
        });
      }
      if (points.length < 2) {
        setPath("");
        setBulbs([]);
        return;
      }

      // Collect each station's card vertical extent so the line's diagonal
      // can be pinned to the empty space BETWEEN cards instead of crossing
      // through them. cardYs[k] corresponds to the kth station node, which
      // is points[k+1] (since points[0] is the upcoming terminus icon).
      const cardYs: { top: number; bottom: number }[] = [];
      body.querySelectorAll(".station").forEach((s) => {
        const card = s.querySelector(".plaque");
        if (card) {
          const r = card.getBoundingClientRect();
          cardYs.push({
            top: r.top - bodyRect.top,
            bottom: r.bottom - bodyRect.top,
          });
        }
      });

      // Jagged metro path: vertical → 45° diagonal jog → vertical. The
      // diagonal is dynamically pinned between the previous card's bottom
      // and the next card's top so it never crosses card content.
      const MARGIN = 8;
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) < 2) {
          d += ` L ${b.x} ${b.y}`;
          continue;
        }
        const jogLen = Math.abs(dx);

        // Look up the cards anchoring this segment. Segment from points[i-1]
        // (station index i-2) to points[i] (station index i-1) — only valid
        // when both endpoints are stations (not terminus boundaries).
        const aIdx = i - 2;
        const bIdx = i - 1;
        const aCard = aIdx >= 0 && aIdx < cardYs.length ? cardYs[aIdx] : null;
        const bCard = bIdx >= 0 && bIdx < cardYs.length ? cardYs[bIdx] : null;

        let topY: number;
        let botY: number;

        if (aCard && bCard) {
          // Pin diagonal between the two cards.
          const availTop = aCard.bottom + MARGIN;
          const availBot = bCard.top - MARGIN;
          const avail = availBot - availTop;
          if (avail >= jogLen) {
            const slack = avail - jogLen;
            topY = availTop + slack / 2;
            botY = topY + jogLen;
          } else if (avail > 4) {
            // Steeper-than-45° to fit the card-free space without overlap.
            topY = availTop;
            botY = availBot;
          } else {
            topY = a.y + (dy - jogLen) / 2;
            botY = topY + jogLen;
          }
        } else if (aCard) {
          // Heading from a station into a terminus. Keep the diagonal below
          // the previous card's bottom edge.
          topY = Math.max(aCard.bottom + MARGIN, a.y + (dy - jogLen) / 2);
          botY = topY + jogLen;
          if (botY > b.y - MARGIN) {
            botY = b.y - MARGIN;
            topY = botY - jogLen;
          }
        } else if (bCard) {
          // Coming from a terminus into a station. Keep the diagonal above
          // the next card's top edge.
          botY = Math.min(bCard.top - MARGIN, a.y + (dy - jogLen) / 2 + jogLen);
          topY = botY - jogLen;
          if (topY < a.y + MARGIN) {
            topY = a.y + MARGIN;
            botY = topY + jogLen;
          }
        } else {
          topY = a.y + (dy - jogLen) / 2;
          botY = topY + jogLen;
        }

        d += ` L ${a.x} ${topY}`;
        d += ` L ${b.x} ${botY}`;
        d += ` L ${b.x} ${b.y}`;
      }
      setPath(d);

      // Distribute bulbs along the path using a temporary SVG path measurer.
      const ns = "http://www.w3.org/2000/svg";
      const tmp = document.createElementNS(ns, "path");
      tmp.setAttribute("d", d);
      const L = (tmp as SVGPathElement).getTotalLength?.() ?? 0;
      if (L > 0) {
        const count = Math.max(8, Math.floor(L / 140));
        const next: { x: number; y: number; dim: boolean }[] = [];
        for (let i = 0; i < count; i++) {
          const t = (i + 0.5) / count;
          const pt = (tmp as SVGPathElement).getPointAtLength(L * t);
          next.push({ x: pt.x, y: pt.y, dim: i % 5 === 3 });
        }
        setBulbs(next);
      } else {
        setBulbs([]);
      }
    };

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTimeout(draw, 60));
    };
    setTimeout(draw, 100);
    window.addEventListener("resize", onResize);

    // Watch the container for size changes so plaque expansions ("WHY THIS
    // STACK" toggle) trigger a line redraw — otherwise the line stops short
    // of the DEPARTURE terminus when a card grows taller.
    const body = bodyRef.current;
    let ro: ResizeObserver | null = null;
    if (body && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(body);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [projects.length]);

  const totalProjects = projects.length;

  return (
    <div
      ref={bodyRef}
      className="line-body"
      id="line-body"
      style={{
        position: "relative",
        maxWidth: 1320,
        margin: "0 auto",
        padding: "0 20px",
        minHeight: 400,
      }}
    >
      {/* SVG main line + glow */}
      <svg
        className="metro-svg"
        id="metro-svg"
        preserveAspectRatio="none"
        viewBox={size.w && size.h ? `0 0 ${size.w} ${size.h}` : undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: size.w || "100%",
          height: size.h || "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {path && (
          <>
            <path
              className="line-glow"
              d={path}
              stroke="var(--accent)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.22"
              style={{ filter: "blur(6px)" }}
            />
            <path
              className="line-main"
              d={path}
              stroke="var(--accent)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(191,87,0,.6))" }}
            />
          </>
        )}
      </svg>

      {/* Bulb-string overlay distributed along the path */}
      <div
        className="bulb-string"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {bulbs.map((b, i) => (
          <span
            key={i}
            className={`bulb${b.dim ? " dim" : ""}`}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              left: b.x,
              top: b.y,
              background:
                "radial-gradient(circle, var(--lamp), var(--accent) 60%, transparent 80%)",
              boxShadow:
                "0 0 14px var(--lamp), 0 0 28px rgba(255,180,80,.45)",
              opacity: b.dim ? 0.35 : 1,
              animation: b.dim ? "flick 4s ease-in-out infinite" : undefined,
            }}
          />
        ))}
      </div>

      {/* Top terminus (upcoming) */}
      <Terminus variant="upcoming" label="NEXT STOP · TBD" sub="The journey continues →" />

      {/* Stations container */}
      <div id="stations">
        {projects.map((project, i) => {
          const layout = layoutFor(i);
          return (
            <div
              key={project.id}
              className={`station ${layout.side}`}
              data-station-idx={i}
              style={{
                position: "relative",
                display: "grid",
                // Narrow marker column — the line is the spine; cards
                // stick to it on alternating sides with just a small gap.
                gridTemplateColumns: "1fr 60px 1fr",
                gap: 0,
                padding: "40px 0",
                minHeight: 320,
                transform: `translateX(${layout.shift}px)`,
              }}
            >
              {/* Card slot — counter-translate so the card stays at its
                  visually-correct left/right column without inheriting the
                  station's nudge. */}
              {layout.side === "left" ? (
                <>
                  <CardSlot side="left" shift={layout.shift}>
                    <StationPlaque
                      project={project}
                      stationIndex={i}
                      totalProjects={totalProjects}
                    />
                  </CardSlot>
                  <StationMarker
                    side={layout.side}
                    stationName={project.stationName || project.title}
                    dateDisplay={project.dateDisplay}
                  />
                  <span aria-hidden />
                </>
              ) : (
                <>
                  <span aria-hidden />
                  <StationMarker
                    side={layout.side}
                    stationName={project.stationName || project.title}
                    dateDisplay={project.dateDisplay}
                  />
                  <CardSlot side="right" shift={layout.shift}>
                    <StationPlaque
                      project={project}
                      stationIndex={i}
                      totalProjects={totalProjects}
                    />
                  </CardSlot>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom terminus (origin / departure) */}
      <Terminus variant="origin" label="DEPARTURE" sub="Where the line began." />
    </div>
  );
}

function CardSlot({
  side,
  children,
}: {
  side: "left" | "right";
  shift: number; // kept in API for callsite uniformity, intentionally unused
  children: React.ReactNode;
}) {
  // No counter-translate — the card rides the row's shift along with the
  // marker. Result: at every station the card sits glued to the (flat)
  // vertical segment of the line that passes through the node, and the
  // line's variation/jog happens entirely between stations.
  return (
    <div
      className="card-slot"
      style={{
        gridColumn: side === "left" ? 1 : 3,
        justifySelf: side === "left" ? "end" : "start",
        // Tiny padding from the column edge → card sits right next to the
        // line with ~42 px total gap (12 padding + 30 to marker center).
        paddingRight: side === "left" ? 12 : 0,
        paddingLeft: side === "right" ? 12 : 0,
        width: "100%",
        // Sized so even a ±75 px shift can't clip the 1280 viewport.
        maxWidth: 480,
        position: "relative",
        zIndex: 3,
      }}
    >
      {children}
    </div>
  );
}
