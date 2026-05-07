"use client";

// Bottom-right toast stack. Auto-dismiss 4s, hover pauses dismiss timer.
// Per .spec/10-admin.md §Toasts.

import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

let toastIdCounter = 0;
const listeners: Array<(item: ToastItem) => void> = [];

export function showToast(message: string, variant: ToastVariant = "success") {
  const item: ToastItem = { id: ++toastIdCounter, variant, message };
  listeners.forEach((l) => l(item));
}

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onAdd = (item: ToastItem) => {
      setItems((prev) => [...prev, item].slice(-3));
      setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== item.id));
      }, 4000);
    };
    listeners.push(onAdd);
    return () => {
      const i = listeners.indexOf(onAdd);
      if (i >= 0) listeners.splice(i, 1);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="font-mono"
          style={{
            background: "var(--bg-secondary)",
            borderLeft: `3px solid ${
              t.variant === "error"
                ? "#ff6b6b"
                : t.variant === "info"
                  ? "var(--text-secondary)"
                  : "var(--accent)"
            }`,
            border: "1px solid #1d1d1d",
            padding: "12px 16px 12px 18px",
            fontSize: 12,
            color: "var(--text-primary)",
            maxWidth: 360,
            pointerEvents: "auto",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
