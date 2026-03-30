import Nav from "@/components/layout/Nav";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero Section — 3D subway scene will go here */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center"
      >
        <div className="hero-overlay px-6">
          <div className="glass-card p-8 max-w-lg">
            <h1 className="font-mono text-4xl font-bold tracking-tight md:text-5xl">
              Md Rehan Mollick
            </h1>
            <p className="mt-3 font-mono text-lg text-text-secondary">
              Building Things My Own Way
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/rehanmollick"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-light transition-colors"
                aria-label="GitHub"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/rehanmollick"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-light transition-colors"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="mailto:rehanmollick07@gmail.com"
                className="text-text-secondary hover:text-accent-light transition-colors"
                aria-label="Email"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-[50vh] flex items-center justify-center px-6 py-24"
      >
        <div className="max-w-2xl">
          <h2 className="font-mono text-2xl font-bold text-accent mb-6">
            About
          </h2>
          <p className="text-text-secondary leading-relaxed text-lg">
            {/* Rehan will replace this with his own words */}
            I build things because I have to. Not for the resume, not for the
            LinkedIn post — because there&apos;s a problem that won&apos;t leave
            me alone until I solve it. I work across the full stack, from smart
            contracts to 3D scenes, and I ship fast.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen px-6 py-24">
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
        className="min-h-[40vh] flex items-center justify-center px-6 py-24"
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
