"use client";

import { useEffect, useCallback } from "react";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/rehanmollick",
    icon: "→",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/md-rehan-mollick-674b042b4",
    icon: "→",
  },
  {
    label: "Email",
    href: "mailto:rehanmollick07@utexas.edu",
    icon: "→",
  },
  {
    label: "rehanmd.tech",
    href: "https://rehanmd.tech",
    icon: "→",
  },
];

interface PosterLinksOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function PosterLinksOverlay({ open, onClose }: PosterLinksOverlayProps) {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 border border-accent/30 bg-bg-secondary/95 backdrop-blur-md rounded-lg px-8 py-7 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-text-muted hover:text-text-primary transition-colors font-mono text-lg"
        >
          ×
        </button>

        {/* Header */}
        <h3 className="font-mono text-lg font-bold text-text-primary mb-1">
          Md Rehan Mollick
        </h3>
        <p className="font-mono text-sm text-accent mb-5">Software Engineer</p>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-4 py-3 rounded border border-white/5 bg-bg-primary/60 hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              <span className="font-mono text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {link.label}
              </span>
              <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity font-mono text-sm">
                {link.icon}
              </span>
            </a>
          ))}
        </div>

        <p className="font-mono text-xs text-text-muted mt-5 text-center">
          click anywhere to close
        </p>
      </div>
    </div>
  );
}
