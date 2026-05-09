// Subtle persistent burnt-orange glow at the bottom of the viewport.
// Mounted only on the home route (/). Below the modal layer (z-index 200)
// so the bulletin / lightbox overlays cover it cleanly when open.

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
        zIndex: 5,
        background:
          "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(191,87,0,.18), rgba(191,87,0,.06) 45%, transparent 75%)",
      }}
    />
  );
}
