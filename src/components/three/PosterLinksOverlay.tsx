"use client";

import { useEffect, useCallback, useState } from "react";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/rehanmollick",
    display: "https://github.com/rehanmollick",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rehanmollick/",
    display: "https://www.linkedin.com/in/rehanmollick/",
  },
  {
    label: "UT Email",
    href: "mailto:rehanmollick07@utexas.edu",
    display: "rehanmollick07[at]utexas[dot]edu",
    copyValue: "rehanmollick07@utexas.edu",
  },
  {
    label: "Gmail",
    href: "mailto:rehanmollick07@gmail.com",
    display: "rehanmollick07[at]gmail[dot]com",
    copyValue: "rehanmollick07@gmail.com",
  },
];

interface PosterLinksOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function PosterLinksOverlay({ open, onClose }: PosterLinksOverlayProps) {
  const [copyNotice, setCopyNotice] = useState(false);

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

  useEffect(() => {
    if (!copyNotice) return;
    const timeout = window.setTimeout(() => setCopyNotice(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [copyNotice]);

  const handleLinkClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof links)[number]) => {
    if (!link.copyValue) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(link.copyValue);
      setCopyNotice(true);
    } catch {
      setCopyNotice(false);
    }
  }, []);

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
        className="relative z-10 border border-accent/30 bg-bg-secondary/95 backdrop-blur-md rounded-lg px-8 py-7 max-w-md w-full mx-4 shadow-2xl"
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
        <div className="font-mono mb-7 pr-8">
          <h3 className="text-lg font-bold text-text-primary">
            Md Rehan Mollick <span className="text-accent font-normal text-sm">- Software Developer</span>
          </h3>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group px-4 py-3 rounded border border-white/5 bg-bg-primary/60 hover:border-accent/40 hover:bg-accent/5 transition-all"
              onClick={(e) => void handleLinkClick(e, link)}
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-sm text-text-secondary group-hover:text-text-primary transition-colors shrink-0">
                  {link.label}
                </span>
                <span className="font-mono text-xs text-text-muted group-hover:text-text-secondary transition-colors break-all">
                  {link.display}
                </span>
              </div>
            </a>
          ))}
        </div>

        {copyNotice ? (
          <p className="font-mono text-xs text-accent mt-4 text-center">
            Email Copied
          </p>
        ) : null}

        <p className="font-mono text-xs text-text-muted mt-5 text-center">
          click anywhere to close
        </p>
      </div>
    </div>
  );
}
