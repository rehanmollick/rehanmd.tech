// Persistent burnt-orange glow at the bottom of the viewport — same accent
// color as the metro line. Always visible on the home page regardless of
// scroll position. Sits above <main> (z-index 10) but below modals
// (z-index 200) so the bulletin / lightbox can still cover it cleanly.

export default function BottomGlow() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "32vh",
        pointerEvents: "none",
        zIndex: 50,
        background:
          "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(191,87,0,.32), rgba(191,87,0,.12) 45%, transparent 78%)",
      }}
    />
  );
}
