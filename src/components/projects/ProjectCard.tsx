"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectLightbox from "./ProjectLightbox";

/**
 * Station-plaque card for a single project. Click → fullscreen lightbox.
 */
export default function ProjectCard({
  project,
  stationNumber,
}: {
  project: Project;
  stationNumber: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="group relative text-left"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: 380 }}
      >
        {/* Plaque */}
        <div
          className="relative bg-bg-secondary border border-accent/30 group-hover:border-accent/70 transition-colors p-5"
          style={{
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Bolts in the corners */}
          {[
            "top-1 left-1",
            "top-1 right-1",
            "bottom-1 left-1",
            "bottom-1 right-1",
          ].map((cls) => (
            <span
              key={cls}
              className={`absolute ${cls} w-1.5 h-1.5 rounded-full bg-accent/40`}
            />
          ))}

          {/* Station number tag */}
          <div className="flex items-baseline justify-between mb-2">
            <span
              className="text-accent text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              STATION {String(stationNumber).padStart(2, "0")}
            </span>
            <span
              className="text-text-muted text-[9px] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {project.date?.slice(0, 4) ?? ""}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-text-primary text-2xl font-bold tracking-tight mb-1 group-hover:text-accent transition-colors"
            style={{ fontFamily: "var(--font-space-mono), monospace" }}
          >
            {project.title}
          </h3>

          {/* Subtitle */}
          {project.context && (
            <p className="text-text-secondary text-sm mb-3">
              {project.context}
            </p>
          )}

          {/* Tech chips */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.techStack.slice(0, 4).map((t) => (
                <span
                  key={t.name}
                  className="px-2 py-0.5 text-[9px] tracking-widest uppercase border border-accent/30 text-accent"
                  style={{ fontFamily: "var(--font-pixel), monospace", whiteSpace: "nowrap" }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-text-muted text-[9px] tracking-[0.3em] uppercase">
              View Station ▸
            </span>
            {project.dateDisplay && (
              <span
                className="text-text-muted text-[9px] tracking-widest uppercase"
                style={{ whiteSpace: "nowrap" }}
              >
                {project.dateDisplay}
              </span>
            )}
          </div>
        </div>
      </motion.button>

      {open && <ProjectLightbox project={project} onClose={() => setOpen(false)} />}
    </>
  );
}
