// Server component — reads about content (frontmatter from public/about/about.md)
// at build time and hands it to AboutClient which owns the modal state.

import { DEFAULT_ABOUT } from "@/lib/about";
import AboutClient from "./AboutClient";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="about-trigger-wrap"
      style={{
        padding: "120px 20px 140px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        background:
          "radial-gradient(ellipse at center top, rgba(191,87,0,.05), transparent 60%), var(--page-outer)",
      }}
    >
      <AboutClient data={DEFAULT_ABOUT} />
    </section>
  );
}
