"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AboutBulletinModal from "./AboutBulletinModal";

/**
 * Sealed envelope sitting on a desk — replaces the old AboutCard.
 * Click → flap opens, letter slides up, then bulletin modal fills the screen.
 */
export default function AboutEnvelope() {
  const [open, setOpen] = useState(false);
  const [showBulletin, setShowBulletin] = useState(false);

  function handleClick() {
    if (open) return;
    setOpen(true);
    // Open the modal slightly after the letter starts sliding out
    window.setTimeout(() => setShowBulletin(true), 650);
  }

  function handleClose() {
    setShowBulletin(false);
    // Reseal the envelope after the modal closes
    window.setTimeout(() => setOpen(false), 350);
  }

  return (
    <>
      <div className="relative flex flex-col items-center" style={{ pointerEvents: "auto" }}>
        {/* Wax seal label above */}
        <p
          className="text-accent text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          &gt; OPEN_ME
        </p>

        <button
          onClick={handleClick}
          className="group relative cursor-pointer"
          style={{ width: 360, height: 240, perspective: "800px" }}
          aria-label="Open about envelope"
        >
          {/* Drop shadow on the desk */}
          <div
            className="absolute inset-x-6 -bottom-3 h-3 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
              filter: "blur(4px)",
            }}
          />

          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              background: "linear-gradient(180deg, #f1ead8 0%, #e8dfc4 100%)",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(120,80,30,0.15)",
              border: "1px solid rgba(120,80,30,0.25)",
            }}
          >
            {/* Subtle paper texture */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 3px, rgba(120,80,30,0.05) 3px 4px)",
              }}
            />

            {/* Address lines */}
            <div className="absolute inset-x-12 top-14 space-y-2">
              <div className="h-[2px] bg-[#3a2c14]/60 w-1/2" />
              <div className="h-[2px] bg-[#3a2c14]/60 w-2/3" />
              <div className="h-[2px] bg-[#3a2c14]/60 w-1/3" />
            </div>

            {/* Stamp */}
            <div
              className="absolute top-3 right-3 px-2 py-1 border border-[#bf5700]/70"
              style={{
                fontFamily: "var(--font-pixel), monospace",
                fontSize: 8,
                color: "#bf5700",
                letterSpacing: "0.1em",
                background: "rgba(255,235,200,0.6)",
              }}
            >
              R · M
              <br />
              ATX
            </div>

            {/* "AIRMAIL" stripes */}
            <div
              className="absolute inset-x-0 bottom-0 h-3 flex"
              style={{ overflow: "hidden" }}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{
                    background: i % 2 === 0 ? "#bf5700" : "#1a1a1a",
                    transform: "skewX(-30deg)",
                    margin: "0 -1px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Letter peeking out (slides up when open) */}
          <motion.div
            className="absolute left-6 right-6 rounded-sm"
            initial={false}
            animate={{
              top: open ? -90 : 30,
              rotate: open ? -1.5 : 0,
              opacity: open ? 1 : 0.95,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 200,
              background: "linear-gradient(180deg, #fffaf0 0%, #f5edd9 100%)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              border: "1px solid rgba(120,80,30,0.2)",
              zIndex: 1,
            }}
          >
            <div
              className="p-4 text-[#3a2c14]"
              style={{ fontFamily: "var(--font-pixel), monospace", fontSize: 9, lineHeight: 1.7 }}
            >
              <div className="text-[#bf5700] mb-2 tracking-widest">DEAR VISITOR,</div>
              <div className="opacity-80">
                Inside this envelope is everything you might want to know about me.
                Click to open the bulletin —
              </div>
            </div>
          </motion.div>

          {/* Envelope flap (rotates open) */}
          <motion.div
            className="absolute inset-x-0 top-0"
            initial={false}
            animate={{ rotateX: open ? -170 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              height: 120,
              zIndex: 2,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, #d9cea7 0%, #c4b785 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                border: "1px solid rgba(120,80,30,0.3)",
              }}
            />
            {/* Wax seal */}
            <div
              className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                background: "radial-gradient(circle at 35% 35%, #e87a2e, #8b3f00)",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.2)",
                fontFamily: "var(--font-pixel), monospace",
                fontSize: 14,
                color: "#1a1a1a",
                fontWeight: 700,
              }}
            >
              R
            </div>
          </motion.div>

          {/* Hover hint */}
          {!open && (
            <span
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                fontFamily: "var(--font-pixel), monospace",
                fontSize: 8,
                letterSpacing: "0.3em",
                whiteSpace: "nowrap",
              }}
            >
              CLICK TO OPEN
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showBulletin && <AboutBulletinModal onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}
