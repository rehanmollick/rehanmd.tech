"use client";

// Bulletin body grid — hero (eyebrow+title+tagline), main column (About/Stack/AFK),
// sidebar widgets, atlas section, photo strip, facts strip, footer.
// Layout from prototype/index.html lines 1415–1644 per .spec/13 §C.3.

import type { AboutConfig } from "@/lib/about";
import BulletinSidebar from "./BulletinSidebar";
import BulletinWorldMap from "./BulletinWorldMap";
import BulletinPhotoStrip from "./BulletinPhotoStrip";
import BulletinFacts from "./BulletinFacts";
import BulletinFooter from "./BulletinFooter";

export default function BulletinBody({ data }: { data: AboutConfig }) {
  return (
    <div
      className="ap-body"
      style={{
        padding: "40px 50px 50px",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 50,
        position: "relative",
      }}
    >
      {/* Hero row spans both columns */}
      <section
        className="ap-hero"
        style={{
          gridColumn: "1 / -1",
          borderBottom: "2px solid rgba(80,50,20,.25)",
          paddingBottom: 32,
        }}
      >
        <div
          className="ap-eyebrow font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#7a3a05",
            textTransform: "uppercase",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            aria-hidden
            style={{ width: 30, height: 1, background: "#7a3a05" }}
          />
          {data.eyebrow}
          <span
            aria-hidden
            style={{
              flex: 1,
              height: 1,
              background:
                "repeating-linear-gradient(to right, rgba(122,58,5,.4) 0 4px, transparent 4px 8px)",
            }}
          />
        </div>
        <h2
          id="ap-title"
          className="ap-title font-pixel"
          style={{
            fontSize: "clamp(40px,6vw,68px)",
            lineHeight: 0.95,
            color: "#1a0f05",
            letterSpacing: "0.01em",
            margin: 0,
            textShadow: "3px 3px 0 rgba(191,87,0,.3)",
          }}
        >
          {data.titleLine1}
          <br />
          {data.titleLine2}
        </h2>
        <p
          className="ap-tagline font-mono"
          style={{
            fontSize: 14,
            color: "#3a2510",
            marginTop: 18,
            lineHeight: 1.6,
            maxWidth: 680,
            fontStyle: "italic",
          }}
        >
          {data.tagline}
        </p>
      </section>

      {/* Main column */}
      <div>
        <Section title="About">
          <p>{data.bio}</p>
        </Section>

        <Section title="The Stack">
          <div
            className="ap-stack"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 8,
            }}
          >
            {data.stack.map((s) => (
              <span
                key={s}
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "#7a3a05",
                  background: "rgba(191,87,0,.08)",
                  border: "1px solid rgba(122,58,5,.3)",
                  padding: "3px 8px",
                  textTransform: "uppercase",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section title="AFK">
          <p>{data.afk}</p>
        </Section>
      </div>

      <BulletinSidebar widgets={data.widgets} />

      <BulletinWorldMap atlas={data.atlas} />

      <BulletinPhotoStrip photos={data.photos} />

      <BulletinFacts label={data.factsLabel} items={data.facts} />

      <BulletinFooter footer={data.footer} />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ap-section" style={{ marginBottom: 28 }}>
      <h3
        className="font-pixel"
        style={{
          fontSize: 22,
          color: "#1a0f05",
          margin: "0 0 12px",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{ width: 8, height: 8, background: "#bf5700" }}
        />
        {title}
      </h3>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 15,
          lineHeight: 1.65,
          color: "#2a1a08",
        }}
      >
        {children}
      </div>
    </section>
  );
}
