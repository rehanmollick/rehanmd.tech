"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects, type Project } from "@/data/projects";

// Decorative branch lines with creative station names
const branches: {
  afterIndex: number; // Insert after this project index
  direction: "left" | "right";
  stations: string[];
}[] = [
  { afterIndex: -1, direction: "right", stations: ["Signal Lost"] },
  {
    afterIndex: 1,
    direction: "left",
    stations: ["Echo Chamber", "Dead Frequency"],
  },
  { afterIndex: 3, direction: "right", stations: ["Phantom Route"] },
  {
    afterIndex: 4,
    direction: "left",
    stations: ["Undervolt", "Rust Belt"],
  },
  { afterIndex: 5, direction: "right", stations: ["Sidetrack"] },
];

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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="flex items-center gap-3">
      {/* Node shape */}
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
            className="w-5 h-5 rounded-full border-2 border-accent bg-transparent shadow-[0_0_12px_rgba(191,87,0,0.3)]"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent mx-auto mt-[3px]" />
          </motion.div>
        )}
      </div>

      {/* Label */}
      <div>
        <span className="font-mono text-sm text-text-primary font-bold">
          {label}
        </span>
        {sublabel && (
          <span className="block font-mono text-xs text-text-muted">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

function BranchLine({
  direction,
  stations,
}: {
  direction: "left" | "right";
  stations: string[];
}) {
  const isRight = direction === "right";
  return (
    <div
      className={`flex items-center gap-2 py-3 ${
        isRight ? "pl-8 ml-[9px]" : "pl-8 ml-[9px]"
      }`}
    >
      {/* Diagonal line stub */}
      <svg width="32" height="24" className="flex-shrink-0 -ml-[9px]">
        <line
          x1="9"
          y1="0"
          x2="32"
          y2="24"
          stroke="#BF5700"
          strokeWidth="2"
          strokeOpacity="0.35"
        />
      </svg>
      {/* Branch stations */}
      <div className="flex items-center gap-3">
        {stations.map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            {i > 0 && (
              <div className="w-6 h-[2px] bg-accent/30" />
            )}
            <div className="w-2.5 h-2.5 rounded-full border border-accent/40 bg-transparent flex-shrink-0" />
            <span className="font-mono text-[10px] text-text-muted/60 whitespace-nowrap">
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
          {/* Main vertical line */}
          <div className="absolute left-[9px] md:left-[9px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent to-accent/40 shadow-[0_0_8px_rgba(191,87,0,0.3)]" />

          {/* Origin node */}
          <div className="mb-10">
            <StationNode label="Departure" sublabel="Where it all started" type="origin" />
          </div>

          {/* Branch after origin */}
          {branches
            .filter((b) => b.afterIndex === -1)
            .map((b, i) => (
              <BranchLine key={`branch-pre-${i}`} direction={b.direction} stations={b.stations} />
            ))}

          {/* Project stations */}
          {projects.map((project, index) => (
            <div key={project.id}>
              {/* Station node + card row */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6">
                {/* Node column */}
                <div className="flex-shrink-0 pt-6">
                  <StationNode
                    label={project.title}
                    sublabel={project.dateDisplay}
                    type="project"
                  />
                </div>

                {/* Connector line (visible on md+) */}
                <div className="hidden md:flex items-center flex-shrink-0 pt-6">
                  <div className="w-12 h-[2px] bg-accent/40" />
                </div>

                {/* Project card */}
                <div className="flex-1 md:max-w-2xl ml-8 md:ml-0">
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

          {/* Terminal node */}
          <div className="mt-10">
            <StationNode
              label="Next Stop: TBD"
              sublabel="The journey continues"
              type="terminal"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
