"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

/*
 * Metro line map inspired by LA Metro / London Underground.
 * - Thick burnt orange line that snakes with 45° turns
 * - Hollow circle station nodes
 * - Cards stagger left/right
 * - Non-uniform vertical spacing
 * - Decorative branch lines fork off at angles
 */

// Each station's layout config
interface StationConfig {
  xOffset: number;       // horizontal offset from center (px) — the line shifts to this position
  spacing: number;       // vertical gap ABOVE this station (px)
  cardSide: "left" | "right";
}

// Non-uniform layout per station — the line shifts left/right
const stationConfigs: StationConfig[] = [
  { xOffset: 0,   spacing: 120, cardSide: "right" },   // Karmen Playground
  { xOffset: 0,   spacing: 200, cardSide: "left" },     // GridPulse
  { xOffset: -40, spacing: 240, cardSide: "right" },    // FlightSense (line shifts left)
  { xOffset: -40, spacing: 180, cardSide: "left" },     // SplitPay Escrow
  { xOffset: 20,  spacing: 260, cardSide: "right" },    // Orbit (line shifts right)
  { xOffset: 20,  spacing: 200, cardSide: "left" },     // Aegis Dashboard
  { xOffset: -20, spacing: 240, cardSide: "right" },    // Mp3 Player (shifts left)
];

// Decorative branches
const branches: {
  afterStation: number;
  direction: "left" | "right";
  stations: string[];
}[] = [
  { afterStation: 0, direction: "left", stations: ["Signal Lost"] },
  { afterStation: 2, direction: "right", stations: ["Echo Chamber", "Dead Freq"] },
  { afterStation: 4, direction: "left", stations: ["Phantom Route"] },
  { afterStation: 5, direction: "right", stations: ["Undervolt", "Rust Belt"] },
];

const LINE_THICKNESS = 6;
const STATION_R = 11;

function StationDot({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="relative flex-shrink-0"
      style={{ width: STATION_R * 2 + 8, height: STATION_R * 2 + 8 }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(191,87,0,0.2)",
        }}
      />
      {/* Thick hollow circle */}
      <div
        className="absolute rounded-full"
        style={{
          top: 4,
          left: 4,
          width: STATION_R * 2,
          height: STATION_R * 2,
          border: `4px solid #BF5700`,
          backgroundColor: "#0a0a0a",
        }}
      />
      {/* Center dot */}
      <div
        className="absolute rounded-full bg-accent"
        style={{
          top: STATION_R + 4 - 3,
          left: STATION_R + 4 - 3,
          width: 6,
          height: 6,
        }}
      />
    </motion.div>
  );
}

function BranchDecoration({
  direction,
  stations,
}: {
  direction: "left" | "right";
  stations: string[];
}) {
  const dir = direction === "right" ? 1 : -1;
  return (
    <div className={`flex items-center gap-1 my-2 ${direction === "right" ? "" : "flex-row-reverse"}`}>
      {/* 45° stub */}
      <svg width="40" height="28" className="flex-shrink-0" style={{ transform: direction === "left" ? "scaleX(-1)" : undefined }}>
        <line x1="0" y1="0" x2="35" y2="25" stroke="#BF5700" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />
      </svg>
      {/* Horizontal line + station dots */}
      <div className={`flex items-center gap-2 ${direction === "left" ? "flex-row-reverse" : ""}`}>
        {stations.map((name, i) => (
          <div key={name} className={`flex items-center gap-1.5 ${direction === "left" ? "flex-row-reverse" : ""}`}>
            {i > 0 && <div className="w-6 h-[2.5px] bg-accent/20 rounded-full" />}
            <div className="w-[9px] h-[9px] rounded-full border-2 border-accent/30 bg-bg-primary flex-shrink-0" />
            <span className="font-mono text-[9px] text-text-muted/40 whitespace-nowrap italic">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalNode({ label, sublabel, type }: { label: string; sublabel: string; type: "future" | "origin" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0" style={{ width: 30, height: 30 }}>
        {type === "origin" ? (
          <>
            <div className="absolute inset-0 rounded-full bg-accent" />
            <div className="absolute inset-[6px] rounded-full bg-bg-primary" />
            <div className="absolute inset-[10px] rounded-full bg-accent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-accent bg-bg-primary" />
            <div className="absolute inset-[9px] rounded-full bg-accent animate-pulse" />
          </>
        )}
      </div>
      <div>
        <span className="font-mono text-xs text-accent font-bold">{label}</span>
        <span className="block font-mono text-[10px] text-text-muted">{sublabel}</span>
      </div>
    </div>
  );
}

function StationRow({
  project,
  config,
  index,
  prevXOffset,
}: {
  project: (typeof projects)[number];
  config: StationConfig;
  index: number;
  prevXOffset: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isRight = config.cardSide === "right";
  const needsTurn = config.xOffset !== prevXOffset;

  return (
    <div ref={ref} style={{ paddingTop: config.spacing }}>
      {/* Vertical line segment + optional 45° turn */}
      <div className="relative flex justify-center" style={{ height: config.spacing, marginTop: -config.spacing }}>
        {needsTurn ? (
          <svg
            className="absolute top-0 h-full"
            style={{ width: 200, left: "50%", transform: "translateX(-50%)" }}
            preserveAspectRatio="none"
          >
            {/* Glow */}
            <line
              x1={100 + prevXOffset}
              y1="0"
              x2={100 + prevXOffset}
              y2={`${Math.max(30, config.spacing * 0.4)}`}
              stroke="#BF5700"
              strokeWidth={LINE_THICKNESS + 6}
              opacity="0.08"
              strokeLinecap="round"
            />
            {/* Vertical down from previous position */}
            <line
              x1={100 + prevXOffset}
              y1="0"
              x2={100 + prevXOffset}
              y2={`${Math.max(30, config.spacing * 0.4)}`}
              stroke="#BF5700"
              strokeWidth={LINE_THICKNESS}
              strokeLinecap="round"
            />
            {/* 45° diagonal turn */}
            <line
              x1={100 + prevXOffset}
              y1={`${Math.max(30, config.spacing * 0.4)}`}
              x2={100 + config.xOffset}
              y2={`${Math.max(30, config.spacing * 0.4) + Math.abs(config.xOffset - prevXOffset)}`}
              stroke="#BF5700"
              strokeWidth={LINE_THICKNESS}
              strokeLinecap="round"
            />
            {/* Vertical down to station */}
            <line
              x1={100 + config.xOffset}
              y1={`${Math.max(30, config.spacing * 0.4) + Math.abs(config.xOffset - prevXOffset)}`}
              x2={100 + config.xOffset}
              y2="100%"
              stroke="#BF5700"
              strokeWidth={LINE_THICKNESS}
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <div
            className="absolute top-0 bottom-0 rounded-full"
            style={{
              width: LINE_THICKNESS,
              backgroundColor: "#BF5700",
              left: `calc(50% + ${config.xOffset}px - ${LINE_THICKNESS / 2}px)`,
              boxShadow: "0 0 10px rgba(191,87,0,0.15)",
            }}
          />
        )}
      </div>

      {/* Station node row */}
      <div
        className="flex items-start gap-6 relative"
        style={{
          justifyContent: isRight ? "flex-start" : "flex-end",
          paddingLeft: isRight ? `calc(50% + ${config.xOffset}px - 15px)` : undefined,
          paddingRight: !isRight ? `calc(50% - ${config.xOffset}px - 15px)` : undefined,
        }}
      >
        {/* Card on left side */}
        {!isRight && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 max-w-xl"
          >
            <ProjectCard project={project} />
          </motion.div>
        )}

        {/* Station dot + label */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 30 }}>
          <StationDot isInView={isInView} />
          {/* Station name label (small, below the dot) */}
          <div className={`mt-1 font-mono text-[9px] text-text-muted whitespace-nowrap ${isRight ? "text-left" : "text-right"}`}>
            {project.dateDisplay}
          </div>
        </div>

        {/* Card on right side */}
        {isRight && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 max-w-xl"
          >
            <ProjectCard project={project} />
          </motion.div>
        )}
      </div>

      {/* Decorative branches after this station */}
      {branches
        .filter((b) => b.afterStation === index)
        .map((b, i) => (
          <div
            key={`branch-${index}-${i}`}
            style={{
              paddingLeft: b.direction === "right" ? `calc(50% + ${config.xOffset}px + 10px)` : undefined,
              paddingRight: b.direction === "left" ? `calc(50% - ${config.xOffset}px + 10px)` : undefined,
              display: "flex",
              justifyContent: b.direction === "right" ? "flex-start" : "flex-end",
            }}
          >
            <BranchDecoration direction={b.direction} stations={b.stations} />
          </div>
        ))}
    </div>
  );
}

export default function MetroMap() {
  return (
    <section id="projects" style={{ backgroundColor: "#0a0a0a" }} className="px-4 md:px-6 py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-mono text-2xl font-bold text-accent tracking-wider">
            The Line
          </h2>
          <p className="font-mono text-sm text-text-muted mt-2">
            Every project is a stop. Every stop is a lesson.
          </p>
        </motion.div>

        {/* Desktop metro map */}
        <div className="hidden md:block">
          {/* Terminal top: "Next Stop: TBD" */}
          <div className="flex justify-center mb-4">
            <div style={{ paddingLeft: `${stationConfigs[0].xOffset}px` }}>
              <TerminalNode label="Next Stop: TBD" sublabel="The journey continues" type="future" />
            </div>
          </div>

          {/* Initial vertical line from terminal to first station */}
          <div className="flex justify-center" style={{ height: 60 }}>
            <div
              className="rounded-full"
              style={{
                width: LINE_THICKNESS,
                height: "100%",
                backgroundColor: "#BF5700",
                marginLeft: `${stationConfigs[0].xOffset}px`,
                boxShadow: "0 0 10px rgba(191,87,0,0.15)",
              }}
            />
          </div>

          {/* Station rows */}
          {projects.map((project, i) => {
            const config = stationConfigs[i];
            const prevOffset = i === 0 ? stationConfigs[0].xOffset : stationConfigs[i - 1].xOffset;
            return (
              <StationRow
                key={project.id}
                project={project}
                config={config}
                index={i}
                prevXOffset={prevOffset}
              />
            );
          })}

          {/* Final vertical segment to Departure */}
          <div className="flex justify-center" style={{ height: 80 }}>
            <div
              className="rounded-full"
              style={{
                width: LINE_THICKNESS,
                height: "100%",
                backgroundColor: "#BF5700",
                marginLeft: `${stationConfigs[stationConfigs.length - 1].xOffset}px`,
                boxShadow: "0 0 10px rgba(191,87,0,0.15)",
              }}
            />
          </div>

          {/* Terminal bottom: "Departure" */}
          <div className="flex justify-center">
            <div style={{ paddingLeft: `${stationConfigs[stationConfigs.length - 1].xOffset}px` }}>
              <TerminalNode label="Departure" sublabel="Where it all started" type="origin" />
            </div>
          </div>
        </div>

        {/* Mobile: simple stacked cards with thin left line */}
        <div className="md:hidden">
          {/* Thin vertical line */}
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-[3px] bg-accent/60 rounded-full" />
            <div className="space-y-10">
              {/* TBD node */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-[3px] border-accent bg-bg-primary" />
                <p className="font-mono text-xs text-accent font-bold">Next Stop: TBD</p>
              </div>

              {projects.map((project) => (
                <div key={project.id} className="relative">
                  <div className="absolute -left-[19px] top-2 w-3 h-3 rounded-full border-[3px] border-accent bg-bg-primary" />
                  <ProjectCard project={project} />
                </div>
              ))}

              {/* Departure node */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-accent" />
                <p className="font-mono text-xs text-accent font-bold">Departure</p>
                <p className="font-mono text-[10px] text-text-muted">Where it all started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
