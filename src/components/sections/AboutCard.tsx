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
      className="about-card relative max-w-[700px] w-full mx-auto p-8 md:p-12"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
        }}
      />

      {/* Terminal-style header */}
      <div className="font-mono text-accent text-sm md:text-base mb-6 tracking-wider">
        <span className="text-text-muted">rehan@metro:~$</span> cat about.txt
      </div>

      {/* Blinking cursor decoration */}
      <div className="absolute top-4 right-4 font-mono text-accent text-lg animate-pulse">
        _
      </div>

      {/* Body text */}
      <div className="space-y-4 font-sans text-text-primary text-base md:text-lg leading-relaxed">
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

      {/* Bottom border accent */}
      <div className="mt-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
    </motion.div>
  );
}
