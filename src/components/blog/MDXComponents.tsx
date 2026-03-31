import type { MDXComponents as MDXComponentsType } from "mdx/types";

const components: MDXComponentsType = {
  h1: (props) => (
    <h1
      className="font-mono text-2xl font-bold text-text-primary mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-mono text-xl font-bold text-accent mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-mono text-lg font-bold text-text-primary mt-6 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent-light hover:text-accent underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside text-text-secondary mb-4 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-1" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-accent/40 pl-4 italic text-text-muted my-4"
      {...props}
    />
  ),
  hr: () => <hr className="border-bg-tertiary my-8" />,
  strong: (props) => (
    <strong className="font-bold text-text-primary" {...props} />
  ),
};

export default components;
