"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface SlideshowProps {
  slides: string[];
  alt: string;
}

export default function Slideshow({ slides, alt }: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)),
    [slides.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)),
    [slides.length]
  );

  if (slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-bg-tertiary rounded-lg flex items-center justify-center">
        <span className="text-text-muted font-mono text-xs">No images</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-bg-tertiary rounded-lg overflow-hidden group">
      {/* Current slide */}
      <Image
        src={slides[current]}
        alt={`${alt} slide ${current + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Navigation arrows (only if multiple slides) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-bg-primary/70 text-text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/80"
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-bg-primary/70 text-text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/80"
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-accent" : "bg-text-muted/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
