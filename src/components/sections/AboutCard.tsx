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
      className="about-card relative max-w-[720px] w-full mx-auto"
    >
      {/* Pixel corner decorations */}
      <div className="pixel-corner pixel-corner-tl" />
      <div className="pixel-corner pixel-corner-tr" />
      <div className="pixel-corner pixel-corner-bl" />
      <div className="pixel-corner pixel-corner-br" />

      {/* Scanline CRT overlay */}
      <div className="pointer-events-none absolute inset-0 scanlines" />

      {/* Inner content — massive padding via inline style so it can't be purged */}
      <div style={{ padding: "28px 36px" }}>
        {/* Terminal-style header — pixel font */}
        <div
          className="text-accent text-[10px] md:text-xs mb-3 tracking-wide flex items-center gap-2"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          <span className="inline-block w-2 h-2 bg-accent rounded-sm animate-pulse" />
          <span className="text-text-muted">&gt;</span>{" "}
          <span>ABOUT_ME.txt</span>
        </div>

        {/* Pixel divider */}
        <div className="flex gap-[2px] my-6">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1"
              style={{
                backgroundColor:
                  i % 3 === 0
                    ? "var(--accent)"
                    : i % 3 === 1
                    ? "var(--accent-dim)"
                    : "transparent",
              }}
            />
          ))}
        </div>

        {/* Body text — pixel font, small size for readability */}
        <div
          className="space-y-6 text-text-primary text-[11px] md:text-[12px] leading-[1.9] md:leading-[2.0]"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          <p>
            I&apos;m a computer science student at UT Austin who builds things
            because I can&apos;t sit still. Hackathons, startups, side projects at
            2am - if there&apos;s a problem and a keyboard nearby, I&apos;m
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
        <div className="flex gap-[2px] mt-8">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1"
              style={{
                backgroundColor:
                  i % 3 === 0
                    ? "var(--accent)"
                    : i % 3 === 1
                    ? "var(--accent-dim)"
                    : "transparent",
              }}
            />
          ))}
        </div>

        {/* Bottom status bar — pixel font */}
        <div
          className="flex justify-between items-center mt-5 text-[8px] md:text-[9px] text-text-muted tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          <span>HP: 99/99</span>
          <span>LVL: CS @ UT</span>
          <span className="text-accent animate-pulse">_</span>
        </div>
      </div>
    </motion.div>
  );
}
