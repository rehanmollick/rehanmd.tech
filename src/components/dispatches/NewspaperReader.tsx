// Newspaper-style reader for a single dispatch.
// Server component — uses next-mdx-remote/rsc to render MDX content.
// Visual layout extracted verbatim from prototype/index.html lines 894–992
// + app.js:419–443 per .spec/13 §C.8.

import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { BlogPost } from "@/lib/mdx";

interface Props {
  post: BlogPost;
  index: number;
  total: number;
}

export default function NewspaperReader({ post, index, total: _total }: Props) {
  return (
    <div
      className="reader"
      style={{
        minHeight: "100vh",
        background: "var(--news-paper-bg)",
        color: "var(--news-text)",
        padding: "90px 0 80px",
        position: "relative",
        fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(120,80,40,.12), transparent 40%), radial-gradient(ellipse at 80% 90%, rgba(120,80,40,.08), transparent 40%)",
        }}
      />

      <article
        className="page"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "40px 48px",
          background: "var(--news-paper)",
          boxShadow: "0 10px 40px rgba(0,0,0,.5)",
          position: "relative",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #000 1px, transparent 1px), radial-gradient(circle at 45% 75%, #000 1px, transparent 1px), radial-gradient(circle at 75% 35%, #000 1px, transparent 1px), radial-gradient(circle at 85% 85%, #000 1px, transparent 1px)",
            backgroundSize: "50px 50px, 80px 80px, 60px 60px, 90px 90px",
          }}
        />

        <header
          className="masthead"
          style={{
            textAlign: "center",
            paddingBottom: 12,
            borderBottom: "3px double var(--news-text)",
            position: "relative",
          }}
        >
          <h1
            className="nameplate"
            style={{
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 72,
              letterSpacing: "0.01em",
              lineHeight: 1,
              color: "var(--news-text)",
              margin: 0,
            }}
          >
            The Platform Gazette
          </h1>
          <div
            className="sub font-mono"
            style={{
              marginTop: 6,
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#4a3a20",
            }}
          >
            EST. 2026 · A NEWSPAPER OF ONE · PRINTED ON THE ORANGE LINE
          </div>
        </header>

        <div
          className="dateline font-mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            marginTop: 10,
            borderBottom: "1px solid var(--news-rule)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#4a3a20",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>{formatLongDate(post.date)}</span>
          <span>VOL. I · DISPATCH №{String(index + 1).padStart(2, "0")}</span>
          <span>$0.00 · FREE FOR COMMUTERS</span>
        </div>

        {/* MDX body */}
        <div className="article-body" style={{ marginTop: 26 }}>
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <Link
          className="back-link font-mono"
          href="/#dispatches"
          style={{
            display: "inline-block",
            marginTop: 30,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
            borderBottom: "1px solid var(--accent)",
            paddingBottom: 2,
          }}
        >
          ← Back to the dispatches wall
        </Link>

        <footer
          className="folio font-mono"
          style={{
            marginTop: 40,
            paddingTop: 14,
            borderTop: "3px double var(--news-text)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4a3a20",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>rehanmd.tech/blog/{post.slug}</span>
          <span>— END OF DISPATCH —</span>
          <span>PAGE A1</span>
        </footer>
      </article>
    </div>
  );
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

// MDX components — render headings, paragraphs, code, etc. with the prototype's
// reader CSS rules (see prototype/index.html lines 938–992 per .spec/13 §C.8).
const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="headline"
      style={{
        fontFamily: "var(--font-serif), 'Playfair Display', serif",
        fontWeight: 900,
        fontSize: 58,
        lineHeight: 1.05,
        margin: "14px 0 10px",
        textAlign: "center",
        color: "#0a0503",
        letterSpacing: "-0.01em",
      }}
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      style={{
        fontFamily: "var(--font-serif), 'Playfair Display', serif",
        fontWeight: 700,
        fontSize: 24,
        margin: "22px 0 8px",
        color: "#0a0503",
        letterSpacing: "-0.005em",
        breakAfter: "avoid",
      }}
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      style={{
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "#4a3a20",
        margin: "18px 0 6px",
      }}
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p style={{ margin: "0 0 14px", lineHeight: 1.65 }} {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      style={{
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
        background: "#ede2c3",
        color: "#5a3a10",
        fontSize: 13,
        padding: "2px 6px",
        border: "1px solid #cfb98a",
      }}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      style={{
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
        background: "#ede2c3",
        color: "#5a3a10",
        fontSize: 13,
        padding: "10px 14px",
        border: "1px solid #cfb98a",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
      }}
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="pullquote"
      style={{
        breakInside: "avoid",
        margin: "20px 0",
        padding: "18px 24px",
        borderTop: "2px solid var(--news-text)",
        borderBottom: "2px solid var(--news-text)",
        fontFamily: "var(--font-serif), 'Playfair Display', serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 22,
        lineHeight: 1.35,
        textAlign: "center",
      }}
      {...props}
    />
  ),
};
