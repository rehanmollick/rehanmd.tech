"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Bobble-animated "LET'S DO IT" footer — each letter rocks in sequence.
 * Orange strip removed; cleaner spacing.
 */
export default function Footer() {
  const letters = "LET'S DO IT".split("");

  return (
    <footer className="relative border-t border-white/5 bg-bg-primary py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-center text-6xl md:text-8xl font-black tracking-tight mb-12 select-none"
          style={{ fontFamily: "var(--font-space-mono), monospace" }}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block text-text-primary"
              animate={{
                y: [0, -8, 0, 0],
                rotate: [0, -3, 3, 0],
                color: ["#f5f5f5", "#bf5700", "#f5f5f5", "#f5f5f5"],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              style={{ whiteSpace: ch === " " ? "pre" : undefined }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-sm">
          <FooterLink href="mailto:rehanmollick07@utexas.edu" label="Email" />
          <FooterLink href="https://github.com/rehanmollick" label="GitHub" external />
          <FooterLink href="https://www.linkedin.com/in/rehanmollick/" label="LinkedIn" external />
          <FooterLink href="/blog" label="Dispatches" />
        </div>

        <p className="text-center text-text-muted text-xs font-mono mt-12 tracking-widest uppercase">
          © {new Date().getFullYear()} Rehan Mollick · Built in Austin
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls = "text-text-secondary hover:text-accent transition-colors tracking-wide";
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label} ↗
      </a>
    );
  return <Link href={href} className={cls}>{label}</Link>;
}
