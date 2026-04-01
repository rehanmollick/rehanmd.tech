"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

// Decorative branch lines with creative station names
const branches: {
  afterIndex: number;
  direction: "left" | "right";
  stations: string[];
}[] = [
  { afterIndex: 0, direction: "right", stations: ["Signal Lost"] },
  { afterIndex: 2, direction: "left", stations: ["Echo Chamber", "Dead Frequency"] },
  { afterIndex: 3, direction: "right", stations: ["Phantom Route"] },
  { afterIndex: 4, direction: "left", stations: ["Undervolt", "Rust Belt"] },
  { afterIndex: 6, direction: "right", stations: ["Sidetrack"] },
];

// Layout constants
const NODE_LEFT = 32; // px from container left edge to the center of the line
const LINE_WIDTH = 3;
const NODE_SIZE = 16;
const CONNECTOR_LENGTH = 48; // horizontal connector from node to card area
const SEGMENT_GAP = 0; // vertical segments connect seamlessly

function StationNode({
  label,
  sublabel,
  type = "project",
}: {
  label: string;
  sublabel?: string;
  type?: "origin" | "project" | "terminal";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="flex items-center gap-3 relative z-10">
      <div className="relative flex-shrink-0 flex items-center justify-center">
        {type === "origin" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4 }}
            className="w-5 h-5 rounded-full bg-accent border-2 border-white shadow-[0_0_12px_rgba(191,87,0,0.5)]"
          />
        )}
        {type === "project" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-4 h-4 rounded-sm bg-accent border-2 border-white shadow-[0_0_10px_rgba(191,87,0,0.4)]"
          />
        )}
        {type === "terminal" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4 }}
            className="w-6 h-6 rounded-full border-[3px] border-accent bg-transparent shadow-[0_0_12px_rgba(191,87,0,0.3)] flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-accent" />
          </motion.div>
        )}
      </div>
      <div>
        <span className="font-mono text-sm text-text-primary font-bold">{label}</span>
        {sublabel && (
          <span className="block font-mono text-xs text-text-muted">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

function BranchLine({
  stations,
}: {
  direction: "left" | "right";
  stations: string[];
}) {
  return (
    <div className="relative py-4" style={{ marginLeft: NODE_LEFT - 1 }}>
      {/* Diagonal SVG connector from main line */}
      <svg
        width="120"
        height="32"
        className="absolute -left-[1px] -top-1"
        style={{ overflow: "visible" }}
      >
        <path
          d={`M 0,0 L 40,28`}
          stroke="#BF5700"
          strokeWidth="2"
          strokeOpacity="0.3"
          fill="none"
        />
      </svg>
      {/* Branch stations */}
      <div className="flex items-center gap-2 ml-10 mt-4">
        {stations.map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-[2px] bg-accent/25" />}
            <div className="w-2.5 h-2.5 rounded-full border border-accent/35 bg-transparent flex-shrink-0" />
            <span className="font-mono text-[10px] text-text-muted/50 whitespace-nowrap italic">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetroMap() {
  return (
    <section id="projects" style={{ backgroundColor: "#0a0a0a" }} className="px-4 md:px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-mono text-2xl font-bold text-accent tracking-wider">
            The Line
          </h2>
          <p className="font-mono text-sm text-text-muted mt-2">
            Every project is a stop. Every stop is a lesson.
          </p>
        </motion.div>

        {/* Metro map layout */}
        <div className="relative">
          {/* Main vertical line — runs the full height, positioned at NODE_LEFT */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: NODE_LEFT,
              width: LINE_WIDTH,
              background: "linear-gradient(to bottom, rgba(191,87,0,0.3), #BF5700 5%, #BF5700 95%, rgba(191,87,0,0.3))",
              boxShadow: "0 0 8px rgba(191,87,0,0.3), 0 0 16px rgba(191,87,0,0.15)",
              borderRadius: 2,
            }}
          />

          {/* Terminal node (top) — future, since projects are newest-first */}
          <div className="relative pb-10" style={{ paddingLeft: NODE_LEFT - 10 }}>
            <StationNode
              label="Next Stop: TBD"
              sublabel="The journey continues"
              type="terminal"
            />
          </div>

          {/* Project stations */}
          {projects.map((project, index) => (
            <div key={project.id} className="relative">
              {/* Station row */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-0 relative">
                {/* Node + label column */}
                <div
                  className="flex-shrink-0 relative z-10"
                  style={{ paddingLeft: NODE_LEFT - 8, width: "auto" }}
                >
                  <StationNode
                    label={project.title}
                    sublabel={project.dateDisplay}
                    type="project"
                  />
                </div>

                {/* Horizontal connector line (desktop) */}
                <div className="hidden md:block flex-shrink-0 relative" style={{ width: CONNECTOR_LENGTH }}>
                  <svg
                    width={CONNECTOR_LENGTH}
                    height="4"
                    className="absolute top-[11px] left-0"
                  >
                    <line
                      x1="0"
                      y1="2"
                      x2={CONNECTOR_LENGTH}
                      y2="2"
                      stroke="#BF5700"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                    />
                    {/* Dot at the end */}
                    <circle cx={CONNECTOR_LENGTH - 2} cy="2" r="2" fill="#BF5700" opacity="0.5" />
                  </svg>
                </div>

                {/* Project card */}
                <div className="flex-1 md:max-w-2xl ml-12 md:ml-0 pb-8">
                  <ProjectCard project={project} />
                </div>
              </div>

              {/* Decorative branches after this project */}
              {branches
                .filter((b) => b.afterIndex === index)
                .map((b, i) => (
                  <BranchLine
                    key={`branch-${index}-${i}`}
                    direction={b.direction}
                    stations={b.stations}
                  />
                ))}
            </div>
          ))}

          {/* Origin node (bottom) — the beginning, oldest projects above this */}
          <div className="relative pt-6" style={{ paddingLeft: NODE_LEFT - 10 }}>
            <StationNode
              label="Departure"
              sublabel="Where it all started"
              type="origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
