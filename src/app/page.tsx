import Nav from "@/components/layout/Nav";
import HeroScene from "@/components/three/HeroScene";
import AboutSection from "@/components/sections/AboutSection";
import BlogWallSection from "@/components/blog/BlogWallSection";
import MetroMap from "@/components/projects/MetroMap";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/mdx";

export default function Home() {
  const posts = getAllPosts().map((p) => ({
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    slug: p.slug,
  }));

  return (
    <>
      <Nav />

      {/* Fixed 3D train scene — always behind everything */}
      <HeroScene />

      {/* Scroll content — scrolls OVER the fixed train scene.
           pointer-events-none on the wrapper so the train canvas
           receives clicks; individual sections re-enable as needed. */}
      <div className="relative z-10 pointer-events-none">
        {/* Transparent spacer — user sees full train scene through this */}
        <div className="h-screen relative">
          {/* Scroll hint */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
            <div className="font-mono text-sm text-text-muted tracking-widest uppercase animate-pulse">
              Scroll
            </div>
          </div>
        </div>

        {/* About Me — transparent bg, train still visible behind the card */}
        <AboutSection />

        {/* Fade-to-black gradient — train scene vanishes here */}
        <div
          className="h-[40vh]"
          style={{
            background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          }}
          aria-hidden="true"
        />

        {/* Blog Section — re-enables pointer events */}
        <div className="pointer-events-auto">
          <BlogWallSection posts={posts} />
        </div>

        {/* Projects Section — re-enables pointer events */}
        <div className="pointer-events-auto">
          <MetroMap />
        </div>

        {/* Contact Footer — re-enables pointer events */}
        <div className="pointer-events-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}
