import Nav from "@/components/layout/Nav";
import HeroScene from "@/components/three/HeroScene";
import HeroPanel from "@/components/hero/HeroPanel";
import Marquee from "@/components/hero/Marquee";
import ScrollCue from "@/components/hero/ScrollCue";
import AboutSection from "@/components/about/AboutSection";
import DispatchesSection from "@/components/dispatches/DispatchesSection";
import LineSection from "@/components/line/LineSection";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/mdx";
import { projects } from "@/data/projects";

// Page composition follows .spec/03-train-scene-rules.md:
// - <div className="train-stage"> is sticky at the top of the viewport.
//   It contains the R3F Canvas + three HTML overlays (marquee, panel, cue).
// - <main className="below-train"> scrolls over the sticky train, with an
//   opaque background so the train is fully covered by section bodies below.
//
// Sections inside <main> get appended in Phase B (about, dispatches, line, footer).

export default function Home() {
  const posts = getAllPosts();
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
        <DispatchesSection posts={posts} />
        <LineSection projects={projects} />
        <Footer />
      </main>
    </>
  );
}
