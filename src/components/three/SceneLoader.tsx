"use client";

import { Suspense, useState, useEffect } from "react";

function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          Entering the tunnel{dots}
        </div>
        <div className="mt-4 w-48 h-[2px] bg-bg-tertiary mx-auto overflow-hidden rounded-full">
          <div className="h-full bg-accent animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SceneLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
