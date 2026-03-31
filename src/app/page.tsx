import Nav from "@/components/layout/Nav";
import HeroScene from "@/components/three/HeroScene";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero Section — immersive 3D subway scene, no HTML overlay */}
      <section id="hero" className="relative min-h-screen">
        <HeroScene />

        {/* Scroll hint only — name/links are now in-scene (LED ticker + poster) */}
        <div className="hero-overlay pointer-events-none">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="font-mono text-xs text-text-muted tracking-widest uppercase animate-pulse">
              Scroll
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 bg-bg-primary min-h-[50vh] flex items-center justify-center px-6 py-24"
      >
        <div className="max-w-2xl">
          <h2 className="font-mono text-2xl font-bold text-accent mb-6">
            About
          </h2>
          <p className="text-text-secondary leading-relaxed text-lg">
            I build things because I have to. Not for the resume, not for the
            LinkedIn post — because there&apos;s a problem that won&apos;t leave
            me alone until I solve it. I work across the full stack, from smart
            contracts to 3D scenes, and I ship fast.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="relative z-10 bg-bg-primary min-h-screen px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-mono text-2xl font-bold text-accent mb-12">
            Projects
          </h2>
          <p className="text-text-muted font-mono text-sm">
            Timeline coming soon.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative z-10 bg-bg-primary min-h-[40vh] flex items-center justify-center px-6 py-24"
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
    </>
  );
}
