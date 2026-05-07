"use client";

// Modal shell for the about bulletin. Backdrop + container + close handlers.
// Animations + class names verbatim from prototype/index.html lines 681–845
// per .spec/13 §C.3 + §D.14 + §E.2.

import { useEffect } from "react";
import type { AboutConfig } from "@/lib/about";
import BulletinHeader from "./BulletinHeader";
import BulletinBody from "./BulletinBody";

interface Props {
  open: boolean;
  onClose: () => void;
  data: AboutConfig;
}

export default function BulletinModal({ open, onClose, data }: Props) {
  // Esc to close + body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="about-modal on"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ap-title"
      onClick={(e) => {
        // Backdrop only — click on the poster does not close.
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background:
          "radial-gradient(ellipse at center, rgba(15,10,5,.85), rgba(0,0,0,.97))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        overflowY: "auto",
        padding: "40px 20px",
        animation: "amfade .3s ease-out forwards",
      }}
    >
      <article
        className="about-poster"
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "20px auto",
          background: "linear-gradient(180deg, #f0e2c2 0%, #e6d4a8 100%)",
          color: "#1a0f05",
          boxShadow:
            "0 60px 100px -20px rgba(0,0,0,.9), 0 0 0 1px rgba(80,50,20,.3)",
          transform: "rotate(-.4deg)",
          animation: "amslide .45s cubic-bezier(.2,.8,.3,1.1)",
          overflow: "hidden",
        }}
      >
        {/* Decorative cross-hatch overlay */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(45deg, transparent 0 60px, rgba(120,70,20,.025) 60px 61px)",
          }}
        />
        <BulletinHeader data={data} onClose={onClose} />
        <BulletinBody data={data} />
      </article>
    </div>
  );
}
