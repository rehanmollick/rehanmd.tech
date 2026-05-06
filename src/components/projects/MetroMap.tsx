"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects, type Project } from "@/data/projects";

/**
 * Real metro-map projects view.
 * - One main line (BURNT ORANGE LINE) — no branches.
 * - Stations are plaques (sign + roundel + dot).
 * - Subtle line "shift" via SVG path with smooth bezier curves.
 * - Arrivals board at the top.
 * - Tunnel lights along the line for ambience.
 */
export default function MetroMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.1 });

  // Vertical layout — stations evenly spaced down the page
  const STATION_GAP = 320;
  const stations = useMemo(
    () =>
      projects.map((p, i) => ({
        ...p,
        // alternate left/right of center line for visual rhythm
        side: (i % 2 === 0 ? "left" : "right") as "left" | "right",
        y: 200 + i * STATION_GAP,
      })),
    [],
  );

  const totalHeight = 200 + projects.length * STATION_GAP + 240;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-bg-primary"
      style={{ minHeight: totalHeight }}
    >
      {/* Arrivals board */}
      <ArrivalsBoard inView={inView} />

      {/* Tunnel "ground" texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 80px, rgba(191,87,0,0.03) 80px 81px)",
        }}
      />

      {/* The line itself — SVG with a subtle S-curve */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        width="200"
        height={totalHeight}
        style={{ top: 0 }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bf5700" stopOpacity="0" />
            <stop offset="8%" stopColor="#bf5700" stopOpacity="1" />
            <stop offset="92%" stopColor="#bf5700" stopOpacity="1" />
            <stop offset="100%" stopColor="#bf5700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={buildLinePath(stations.map((s) => s.y), totalHeight)}
          stroke="url(#lineGrad)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        {/* Tunnel lights — small glows along the line */}
        {stations.map((s, i) => (
          <circle
            key={`light-${i}`}
            cx="100"
            cy={s.y - STATION_GAP / 2}
            r="2"
            fill="#bf5700"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur={`${3 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Stations */}
      {stations.map((s, i) => (
        <Station key={s.id} project={s} index={i} side={s.side} y={s.y} />
      ))}

      {/* End-of-line marker */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ top: totalHeight - 180 }}
      >
        <div
          className="text-accent text-[10px] tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          END&nbsp;OF&nbsp;LINE
        </div>
        <div className="w-3 h-3 rounded-full bg-accent" />
      </div>
    </section>
  );
}

function buildLinePath(ys: number[], totalHeight: number): string {
  // Smooth path with slight horizontal drift between stations for "shift" feel
  const cx = 100; // center x of svg
  const drift = 14;
  const points = [
    [cx, 0] as const,
    ...ys.map((y, i) => [cx + (i % 2 === 0 ? -drift : drift), y] as const),
    [cx, totalHeight] as const,
  ];
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const midY = (py + y) / 2;
    d += ` C ${px} ${midY}, ${x} ${midY}, ${x} ${y}`;
  }
  return d;
}

function Station({
  project,
  index,
  side,
  y,
}: {
  project: Project;
  index: number;
  side: "left" | "right";
  y: number;
}) {
  return (
    <motion.div
      className="absolute left-1/2 flex items-center"
      style={{
        top: y - 100,
        transform: side === "left" ? "translateX(-100%)" : "translateX(0)",
        flexDirection: side === "left" ? "row" : "row-reverse",
      }}
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: side === "left" ? "-100%" : 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      {/* Station sign placard with roundel */}
      <div className="flex items-center gap-3" style={{ marginRight: side === "left" ? 24 : 0, marginLeft: side === "right" ? 24 : 0 }}>
        <ProjectCard project={project} stationNumber={index + 1} />
      </div>

      {/* The dot on the line + roundel */}
      <div className="relative shrink-0" style={{ width: 60, height: 60 }}>
        <div
          className="absolute inset-0 rounded-full border-[3px] border-accent bg-bg-primary flex items-center justify-center"
          style={{
            boxShadow: "0 0 20px rgba(191,87,0,0.4)",
          }}
        >
          <span
            className="text-accent text-[10px] font-bold tracking-wider"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ArrivalsBoard({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="absolute top-12 left-1/2 -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div
        className="border border-accent/40 px-6 py-3 bg-black/80 backdrop-blur-sm"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        <div className="text-accent text-[8px] tracking-[0.3em] uppercase mb-1">
          ▼ Arrivals Board ▼
        </div>
        <div className="text-text-primary text-xs tracking-widest uppercase">
          BURNT ORANGE LINE · NORTHBOUND · ALL STOPS
        </div>
      </div>
    </motion.div>
  );
}
