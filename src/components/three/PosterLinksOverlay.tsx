"use client";

import { useEffect, useCallback } from "react";

/**
 * Wall-poster popup. Per Rehan: "literally just a text box with contact info."
 * No more link grid — it's a friendly welcome + the contact info.
 */
export default function PosterLinksOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 border border-accent/30 bg-bg-secondary/95 backdrop-blur-md rounded-lg max-w-md w-full mx-4 shadow-2xl"
        style={{ padding: "32px 36px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-text-muted hover:text-text-primary transition-colors font-mono text-lg"
        >
          &times;
        </button>

        <h3
          className="text-accent text-sm tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          Welcome
        </h3>

        <p className="text-text-primary text-sm leading-relaxed mb-4">
          This is my personal portfolio — feel free to look around and have fun.
          If you have any questions, reach out.
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-5">
          Check out my{" "}
          <span className="text-accent">About Me in the envelope below.</span>
        </p>

        <div className="border-t border-white/5 pt-4 space-y-2 font-mono text-xs">
          <ContactRow label="Email" value="rehanmollick07@utexas.edu" href="mailto:rehanmollick07@utexas.edu" />
          <ContactRow label="GitHub" value="github.com/rehanmollick" href="https://github.com/rehanmollick" />
          <ContactRow label="LinkedIn" value="linkedin.com/in/rehanmollick" href="https://www.linkedin.com/in/rehanmollick/" />
        </div>

        <p className="font-mono text-xs text-text-muted mt-5 text-center">
          click anywhere to close
        </p>
      </div>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="flex items-baseline gap-3 hover:text-accent-light transition-colors"
    >
      <span className="text-accent shrink-0">{label}</span>
      <span className="text-text-muted break-all">{value}</span>
    </a>
  );
}
