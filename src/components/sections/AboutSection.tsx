"use client";

import AboutEnvelope from "./AboutEnvelope";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <AboutEnvelope />
      </div>

      <div style={{ marginTop: "180px" }}>
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase animate-pulse">
          Scroll
        </div>
      </div>
    </section>
  );
}
