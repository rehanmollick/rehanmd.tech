"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="px-6"
      style={{ backgroundColor: "#0a0a0a", width: "100vw", maxWidth: "100vw", paddingTop: "120px", paddingBottom: "8px" }}
    >
      <div style={{ maxWidth: "48rem", textAlign: "center", marginLeft: "auto", marginRight: "auto", overflow: "visible", fontFamily: "var(--font-pixel), monospace" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className="text-sm font-bold text-accent tracking-widest uppercase"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Let&apos;s do it.
          </motion.h2>
          <motion.p
            className="text-xs text-text-muted tracking-widest uppercase"
            style={{ marginTop: "12px", marginBottom: "32px" }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            What are you waiting on?
          </motion.p>

          {/* Contact links */}
          <div className="flex flex-wrap justify-center gap-8" style={{ marginBottom: "8px" }}>
            <a
              href="https://github.com/rehanmollick"
              target="_blank"
              rel="noopener noreferrer"
              className=" text-xs text-text-secondary hover:text-accent-light transition-colors flex items-center gap-2 tracking-widest uppercase"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/rehanmollick"
              target="_blank"
              rel="noopener noreferrer"
              className=" text-xs text-text-secondary hover:text-accent-light transition-colors flex items-center gap-2 tracking-widest uppercase"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="mailto:rehanmollick07@utexas.edu"
              className=" text-xs text-text-secondary hover:text-accent-light transition-colors flex items-center gap-2 tracking-widest uppercase"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
              UT Email
            </a>
            <a
              href="mailto:rehanmollick07@gmail.com"
              className=" text-xs text-text-secondary hover:text-accent-light transition-colors flex items-center gap-2 tracking-widest uppercase"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
              Gmail
            </a>
          </div>

          {/* Full-width line */}
          <hr style={{ border: "none", borderTop: "1px solid #ffffff", width: "100vw", position: "relative", left: "50%", transform: "translateX(-50%)", margin: 0 }} />

          {/* Copyright */}
          <div className="pt-3" style={{ textAlign: "center" }}>
            <p className=" text-[10px] text-text-muted tracking-widest uppercase">
              &copy; 2026 Md Rehan Mollick
            </p>
            <p className=" text-[9px] text-text-muted/50 mt-1 tracking-widest uppercase">
              Built with Next.js, React Three Fiber, TypeScript, and Framer Motion
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
