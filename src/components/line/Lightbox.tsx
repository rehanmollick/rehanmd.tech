"use client";

// Fullscreen project media carousel. Backdrop + bolted-orange frame.
// ←/→/Esc/backdrop close per .spec/13 §C.6 + §E.4.

import { useEffect } from "react";
import type { ProjectSlide } from "@/data/projects";

interface Props {
  open: boolean;
  title: string;
  slides: ProjectSlide[];
  index: number;
  onChangeIndex: (next: number) => void;
  onClose: () => void;
}

export default function Lightbox({
  open,
  title,
  slides,
  index,
  onChangeIndex,
  onClose,
}: Props) {
  const total = slides.length || 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft")
        onChangeIndex((index - 1 + total) % total);
      else if (e.key === "ArrowRight") onChangeIndex((index + 1) % total);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, total, onClose, onChangeIndex]);

  if (!open) return null;

  return (
    <div
      className="lightbox open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.94)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        className="lightbox-frame"
        style={{
          position: "relative",
          maxWidth: "min(1400px, 90vw)",
          width: "100%",
          background: "#0a0503",
          border: "3px solid var(--accent)",
          padding: 4,
          boxShadow: "0 0 60px rgba(191,87,0,.3)",
        }}
      >
        <Bolt pos="tl" />
        <Bolt pos="tr" />
        <Bolt pos="bl" />
        <Bolt pos="br" />
        <div
          className="lightbox-inner"
          style={{
            background: "#000",
            padding: 50,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            className="lightbox-title font-pixel"
            style={{
              fontSize: 24,
              color: "var(--accent-light)",
              letterSpacing: "0.1em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{title.toUpperCase()}</span>
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 36,
                height: 36,
                border: "1px solid var(--accent-dim)",
                color: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                background: "transparent",
              }}
            >
              ✕
            </button>
          </div>

          <div
            className="lightbox-media"
            style={{
              aspectRatio: "16 / 9",
              background: "#111",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--accent-dim)",
            }}
          >
            <div
              className="lb-slides"
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                transform: `translateX(-${index * 100}%)`,
                transition: "transform .4s ease",
              }}
            >
              {slides.map((s, i) => (
                <Slide key={i} slide={s} />
              ))}
            </div>
          </div>

          <div
            className="lightbox-nav font-mono"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
            }}
          >
            <Arrow
              dir="prev"
              onClick={() => onChangeIndex((index - 1 + total) % total)}
            />
            <span
              className="lightbox-counter font-pixel"
              aria-live="polite"
              style={{
                fontSize: 18,
                color: "var(--accent-light)",
                letterSpacing: "0.1em",
              }}
            >
              {index + 1} / {total}
            </span>
            <Arrow
              dir="next"
              onClick={() => onChangeIndex((index + 1) % total)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide({ slide }: { slide: ProjectSlide }) {
  if (slide.type === "placeholder") {
    return (
      <div
        className="lb-slide placeholder font-mono"
        style={{
          flex: "0 0 100%",
          height: "100%",
          background:
            "repeating-linear-gradient(45deg, #1a1408 0 20px, #241c0b 20px 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6a5a30",
          fontSize: 14,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {slide.label || "media"}
      </div>
    );
  }
  if (slide.type === "image") {
    return (
      <div
        className="lb-slide"
        style={{
          flex: "0 0 100%",
          height: "100%",
          backgroundImage: `url(${slide.src})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0a0503",
        }}
        aria-label={slide.alt}
      />
    );
  }
  return (
    <video
      className="lb-slide"
      src={slide.src}
      poster={slide.poster}
      controls
      style={{
        flex: "0 0 100%",
        height: "100%",
        objectFit: "contain",
        background: "#0a0503",
      }}
      aria-label={slide.alt}
    />
  );
}

function Bolt({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const variants: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 10, left: 10 },
    tr: { top: 10, right: 10 },
    bl: { bottom: 10, left: 10 },
    br: { bottom: 10, right: 10 },
  };
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 30%, #d4a05a, #6a4420 60%, #2a1808)",
        zIndex: 3,
        ...variants[pos],
      }}
    />
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      className="arrow"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      style={{
        width: 44,
        height: 44,
        border: "1px solid var(--accent-dim)",
        color: "var(--accent-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {dir === "prev" ? "◀" : "▶"}
    </button>
  );
}
