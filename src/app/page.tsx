import Nav from "@/components/layout/Nav";
import HeroScene from "@/components/three/HeroScene";
import HeroPanel from "@/components/hero/HeroPanel";
import Marquee from "@/components/hero/Marquee";
import ScrollCue from "@/components/hero/ScrollCue";
import AboutSection from "@/components/about/AboutSection";

// Page composition follows .spec/03-train-scene-rules.md:
// - <div className="train-stage"> is sticky at the top of the viewport.
//   It contains the R3F Canvas + three HTML overlays (marquee, panel, cue).
// - <main className="below-train"> scrolls over the sticky train, with an
//   opaque background so the train is fully covered by section bodies below.
//
// Sections inside <main> get appended in Phase B (about, dispatches, line, footer).

export default function Home() {
  return (
    <>
      <Nav />

      <div
        className="train-stage relative"
        style={{ position: "sticky", top: 0, height: "100vh", zIndex: 0 }}
      >
        <HeroScene />
        <Marquee />
        <HeroPanel />
        <ScrollCue />
      </div>

      <main
        className="below-train relative"
        style={{ zIndex: 10, background: "var(--bg-primary)" }}
      >
        <AboutSection />
        {/* Remaining Phase B sections (dispatches, line, footer) land here */}
      </main>
    </>
  );
}
