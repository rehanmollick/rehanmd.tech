"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slideshow from "@/components/ui/Slideshow";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5 md:p-6"
    >
      <div className="flex flex-col md:flex-row gap-5 overflow-hidden">
        {/* Slideshow */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <Slideshow slides={project.slides} alt={project.title} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-mono text-lg font-bold text-text-primary break-words">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-text-muted mt-1">
            <span>{project.dateDisplay}</span>
            {project.context && (
              <span className="ml-2 text-accent-light">{project.context}</span>
            )}
          </p>
          <p className="text-text-secondary text-sm mt-3 leading-relaxed break-words">
            {project.description}
          </p>

          {/* Links */}
          <div className="flex gap-3 mt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-accent text-accent font-mono text-xs hover:bg-accent hover:text-bg-primary transition-colors"
              >
                Live Demo
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-bg-tertiary text-text-secondary font-mono text-xs hover:border-text-muted hover:text-text-primary transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Repo
            </a>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-5">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech.name}
              className="px-2.5 py-1 rounded-full bg-bg-primary text-accent font-mono text-xs border border-bg-tertiary"
            >
              {tech.name}
            </span>
          ))}
        </div>

        {/* Why this stack? */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 font-mono text-xs text-text-muted hover:text-accent-light transition-colors flex items-center gap-1"
        >
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            &#9654;
          </motion.span>
          Why this stack?
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="mt-3 pl-3 border-l-2 border-accent/40 space-y-3">
                {project.techStack.map((tech) => (
                  <div key={tech.name}>
                    <span className="font-mono text-xs font-bold text-text-primary">
                      {tech.name}:
                    </span>{" "}
                    <span className="text-text-secondary text-xs">
                      {tech.reason}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
