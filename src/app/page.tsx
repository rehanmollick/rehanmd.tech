import Nav from "@/components/layout/Nav";
import HeroScene from "@/components/three/HeroScene";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Fixed 3D train scene — always behind everything */}
      <HeroScene />

      {/* Scroll content — scrolls OVER the fixed train scene */}
      <div className="relative z-10">
        {/* Transparent spacer — user sees full train scene through this */}
        <div className="h-screen" aria-hidden="true" />

        {/* About Me — transparent background, train still visible behind */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-2xl text-center">
            <h2 className="font-mono text-2xl font-bold text-accent mb-6">
              About
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Placeholder — About Me card coming soon.
            </p>
          </div>
        </section>

        {/* Fade-to-black gradient — train scene vanishes here */}
        <div
          className="h-[40vh]"
          style={{
            background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          }}
          aria-hidden="true"
        />

        {/* Blog Section — fully opaque, train hidden */}
        <section
          id="blog"
          className="min-h-screen px-6 py-24"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-mono text-2xl font-bold text-accent mb-12">
              Blog
            </h2>
            <p className="text-text-muted font-mono text-sm">
              Metro station wall scene coming soon.
            </p>
          </div>
        </section>

        {/* Projects Section — fully opaque */}
        <section
          id="projects"
          className="min-h-screen px-6 py-24"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-mono text-2xl font-bold text-accent mb-12">
              Projects
            </h2>
            <p className="text-text-muted font-mono text-sm">
              Metro line map timeline coming soon.
            </p>
          </div>
        </section>

        {/* Contact Footer — fully opaque */}
        <section
          id="contact"
          className="min-h-[40vh] flex items-center justify-center px-6 py-24"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="text-center">
            <h2 className="font-mono text-2xl font-bold text-accent mb-6">
              Let&apos;s Build Something
            </h2>
            <div className="flex justify-center gap-6 text-text-secondary font-mono text-sm">
              <a
                href="mailto:rehanmollick07@gmail.com"
                className="hover:text-accent-light transition-colors"
              >
                Email
              </a>
              <a
                href="https://github.com/rehanmollick"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-light transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/rehanmollick"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-light transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
