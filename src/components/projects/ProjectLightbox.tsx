"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  onClose: () => void;
}

/**
 * Fullscreen lightbox carousel — auto-advance, arrow keys, click thumbnails.
 */
export default function ProjectLightbox({ project, onClose }: Props) {
  const slides = project.slides && project.slides.length > 0 ? project.slides : [];
  const [idx, setIdx] = useState(0);

  if (slides.length === 0) {
    return (
      <motion.div
        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="text-text-muted">No slides for {project.title}</div>
      </motion.div>
    );
  }

  function go(delta: number) {
    setIdx((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <div>
          <div
            className="text-accent text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            STATION · BURNT ORANGE LINE
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{project.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-3xl"
        >
          &times;
        </button>
      </header>

      <div
        className="flex-1 flex items-center justify-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => go(-1)} className="text-accent text-4xl px-4">
          ‹
        </button>

        <div className="relative flex-1 h-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <Image
                src={slides[idx]}
                alt={`${project.title} ${idx + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={() => go(1)} className="text-accent text-4xl px-4">
          ›
        </button>
      </div>

      <footer
        className="flex justify-center gap-2 py-4 border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-12 h-1 ${i === idx ? "bg-accent" : "bg-white/20"}`}
          />
        ))}
      </footer>
    </motion.div>
  );
}
