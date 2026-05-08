"use client";

// Plaque media carousel — 16:9 ratio, dots, prev/next on hover, count badge,
// autoplay (5s) gated by IntersectionObserver. Click anywhere on the media
// (except controls) opens the lightbox at the current index.
// Verbatim from prototype/app.js:287–376 per .spec/13 §C.6 + §E.21.

import { useEffect, useRef, useState } from "react";
import type { ProjectSlide } from "@/lib/projects";

interface Props {
  slides: ProjectSlide[];
  onOpenLightbox: (index: number) => void;
}

const AUTOPLAY_MS = 5000;
const TICK_MS = 50;

export default function PlaqueMedia({ slides, onOpenLightbox }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..100
  const [userStopped, setUserStopped] = useState(false);
  const [inView, setInView] = useState(false);

  const total = slides.length;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          setInView(e.isIntersecting);
        }),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || userStopped || total < 2) return;
    let p = 0;
    const id = setInterval(() => {
      p += (TICK_MS / AUTOPLAY_MS) * 100;
      if (p >= 100) {
        p = 0;
        setIndex((i) => (i + 1) % total);
      }
      setProgress(p);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [inView, userStopped, total, index]);

  const go = (next: number) => {
    setIndex((next + total) % total);
    setProgress(0);
  };

  return (
    <div
      ref={wrapRef}
      className="plaque-media"
      style={{
        marginTop: 14,
        position: "relative",
        aspectRatio: "16 / 9",
        background: "#0a0503",
        border: "1px solid #3a2010",
        overflow: "hidden",
        cursor: "zoom-in",
      }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t.closest("[data-nav]") || t.classList.contains("dot")) return;
        onOpenLightbox(index);
      }}
    >
      <div
        className="slides"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform .5s ease",
        }}
      >
        {slides.map((s, i) => (
          <Slide key={i} slide={s} />
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            data-nav="prev"
            onClick={(e) => {
              e.stopPropagation();
              setUserStopped(true);
              go(index - 1);
            }}
            aria-label="Previous slide"
            className="nav-arrow prev"
            style={navArrowStyle("left")}
          >
            ◀
          </button>
          <button
            type="button"
            data-nav="next"
            onClick={(e) => {
              e.stopPropagation();
              setUserStopped(true);
              go(index + 1);
            }}
            aria-label="Next slide"
            className="nav-arrow next"
            style={navArrowStyle("right")}
          >
            ▶
          </button>
          <div
            className="dots"
            style={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 6,
              zIndex: 2,
            }}
          >
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setUserStopped(true);
                  go(i);
                }}
                aria-label={`Slide ${i + 1}`}
                className={`dot${i === index ? " active" : ""}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    i === index
                      ? "var(--accent-light)"
                      : "rgba(255,255,255,.3)",
                  border: "1px solid rgba(0,0,0,.5)",
                  cursor: "pointer",
                  boxShadow: i === index ? "0 0 8px var(--accent)" : undefined,
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}

      <div
        className="count-badge font-mono"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: 10,
          color: "var(--accent-light)",
          background: "rgba(0,0,0,.7)",
          padding: "3px 7px",
          border: "1px solid var(--accent-dim)",
          letterSpacing: "0.15em",
        }}
      >
        {index + 1}/{total}
      </div>

      <div
        className="autoplay-bar"
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: "var(--accent)",
          width: `${progress}%`,
          transition: "width .1s linear",
        }}
      />
    </div>
  );
}

function Slide({ slide }: { slide: ProjectSlide }) {
  if (slide.type === "placeholder") {
    return (
      <div
        className="slide placeholder font-mono"
        style={{
          flex: "0 0 100%",
          height: "100%",
          background:
            "repeating-linear-gradient(45deg, #1a1408 0 14px, #241c0b 14px 28px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6a5a30",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            background: "rgba(0,0,0,.6)",
            padding: "6px 12px",
            border: "1px solid #3a2c10",
          }}
        >
          {slide.label || "media"}
        </span>
      </div>
    );
  }
  if (slide.type === "image") {
    return (
      <div
        className="slide"
        style={{
          flex: "0 0 100%",
          height: "100%",
          backgroundImage: `url(${slide.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label={slide.alt}
      />
    );
  }
  return (
    <video
      className="slide"
      src={slide.src}
      poster={slide.poster}
      muted
      playsInline
      loop
      preload="metadata"
      style={{
        flex: "0 0 100%",
        height: "100%",
        objectFit: "cover",
      }}
      aria-label={slide.alt}
    />
  );
}

function navArrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 32,
    height: 32,
    background: "rgba(0,0,0,.6)",
    border: "1px solid var(--accent-dim)",
    color: "var(--accent-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    opacity: 1,
    transition: "opacity .2s",
    zIndex: 2,
    [side]: 8,
  };
}
