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

      {/* Scroll content — scrolls OVER the fixed train scene */}
      <div className="relative z-10">
        {/* Transparent spacer — user sees full train scene through this */}
        {/* pointer-events-none so clicks pass through to the 3D canvas below */}
        <div className="h-screen pointer-events-none relative" aria-hidden="true">
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

        {/* Blog Section — 3D metro station wall with poster for each post */}
        <BlogWallSection posts={posts} />

        {/* Projects Section — metro line map */}
        <MetroMap />

        {/* Contact Footer */}
        <Footer />
      </div>
    </>
  );
}
