import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Admin</h1>
      <p className="text-text-muted mb-8 text-sm">
        Welcome back. What are we shipping today?
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Tile href="/admin/dispatches/new" label="New Dispatch" desc="Brain-dump → newspaper" />
        <Tile href="/admin/projects" label="Projects" desc="Edit station list" />
        <Tile href="/admin/about" label="About" desc="Now playing, photos, bio" />
        <Tile href="/blog" label="View site" desc="Open public site" external />
      </div>
    </div>
  );
}

function Tile({ href, label, desc, external }: { href: string; label: string; desc: string; external?: boolean }) {
  const inner = (
    <div className="border border-white/10 p-5 hover:border-accent transition-colors">
      <div className="text-accent text-[10px] tracking-widest uppercase mb-2">→</div>
      <div className="text-lg font-bold">{label}</div>
      <div className="text-text-muted text-xs">{desc}</div>
    </div>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href}>{inner}</Link>
  );
}
