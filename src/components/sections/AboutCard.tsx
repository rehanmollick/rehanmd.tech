"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, scale }}
      className="about-card relative max-w-[700px] w-full mx-auto"
    >
      {/* Pixel corner decorations */}
      <div className="pixel-corner pixel-corner-tl" />
      <div className="pixel-corner pixel-corner-tr" />
      <div className="pixel-corner pixel-corner-bl" />
      <div className="pixel-corner pixel-corner-br" />

      {/* Scanline CRT overlay */}
      <div className="pointer-events-none absolute inset-0 scanlines" />

      {/* Inner content with generous padding */}
      <div className="p-10 md:p-14 lg:p-16">
        {/* Terminal-style header */}
        <div className="font-mono text-accent text-sm md:text-base mb-2 tracking-wider flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-text-muted">rehan@metro:~$</span>{" "}
          <span className="text-accent">cat about.txt</span>
        </div>

        {/* Pixel divider */}
        <div className="flex gap-[3px] my-5">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1"
              style={{
                backgroundColor:
                  i % 4 === 0
                    ? "var(--accent)"
                    : i % 4 === 2
                    ? "var(--accent-dim)"
                    : "transparent",
              }}
            />
          ))}
        </div>

        {/* Body text */}
        <div className="space-y-5 font-sans text-text-primary text-base md:text-lg leading-relaxed">
          <p>
            I&apos;m a computer science student at UT Austin who builds things
            because I can&apos;t sit still. Hackathons, startups, side projects at
            2am &mdash; if there&apos;s a problem and a keyboard nearby, I&apos;m
            probably already working on it.
          </p>
          <p>
            I think the best way to learn is to ship. Every project I build teaches
            me something the classroom can&apos;t. Right now I&apos;m deep into
            full-stack web dev, blockchain, and AI tooling.
          </p>
          <p>
            When I&apos;m not coding, I&apos;m probably climbing, swimming, or
            figuring out how to optimize something that doesn&apos;t need
            optimizing.
          </p>
        </div>

        {/* Pixel divider bottom */}
        <div className="flex gap-[3px] mt-8">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1"
              style={{
                backgroundColor:
                  i % 4 === 0
                    ? "var(--accent)"
                    : i % 4 === 2
                    ? "var(--accent-dim)"
                    : "transparent",
              }}
            />
          ))}
        </div>

        {/* Bottom status bar */}
        <div className="flex justify-between items-center mt-4 font-mono text-[10px] text-text-muted tracking-widest uppercase">
          <span>HP: 99/99</span>
          <span>LVL: CS @ UT</span>
          <span className="text-accent animate-pulse">_</span>
        </div>
      </div>
    </motion.div>
  );
}
