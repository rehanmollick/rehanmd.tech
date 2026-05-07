"use client";

// Metro track — alternating-column station list with a single SVG line drawn
// dynamically across the station nodes. Algorithm + per-station layout
// extracted verbatim from prototype/app.js:132–282 per .spec/13 §C.5 + §E.22.

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import StationMarker from "./StationMarker";
import StationPlaque from "./StationPlaque";
import Terminus from "./Terminus";

// Per-station horizontal nudge (px) + which side the card sits on.
// Order matches the data.js project array (newest first → oldest last).
const STATION_LAYOUT: { shift: number; side: "left" | "right" }[] = [
  { shift: 0, side: "right" }, // Karmen Playground
  { shift: 0, side: "left" }, // GridPulse
  { shift: -60, side: "right" }, // FlightSense
  { shift: -60, side: "left" }, // SplitPay
  { shift: 40, side: "right" }, // Orbit
  { shift: 40, side: "left" }, // Aegis
  { shift: -30, side: "right" }, // Mp3
];

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

      // Build a 45° jog metro path: vertical → diagonal → vertical.
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) < 2) {
          d += ` L ${b.x} ${b.y}`;
        } else {
          const jogLen = Math.abs(dx);
          const topY = a.y + (dy - jogLen) / 2;
          const botY = topY + jogLen;
          d += ` L ${a.x} ${topY}`;
          d += ` L ${b.x} ${botY}`;
          d += ` L ${b.x} ${b.y}`;
        }
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
          const layout = STATION_LAYOUT[i] ?? {
            shift: 0,
            side: i % 2 === 0 ? "right" : "left",
          };
          return (
            <div
              key={project.id}
              className={`station ${layout.side}`}
              data-station-idx={i}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr 90px 1fr",
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
  shift,
  children,
}: {
  side: "left" | "right";
  shift: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="card-slot"
      style={{
        gridColumn: side === "left" ? 1 : 3,
        justifySelf: side === "left" ? "end" : "start",
        paddingRight: side === "left" ? 30 : 0,
        paddingLeft: side === "right" ? 30 : 0,
        width: "100%",
        maxWidth: 560,
        position: "relative",
        zIndex: 3,
        transform: `translateX(${-shift}px)`,
      }}
    >
      {children}
    </div>
  );
}
