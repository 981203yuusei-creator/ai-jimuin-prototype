"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "jimuassi_zoom";
const MIN = 80;
const MAX = 150;
const STEP = 10;

function applyZoom(value: number) {
  (document.body.style as unknown as { zoom: string }).zoom = `${value}%`;
}

export default function FontSizeControl() {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    const initial = saved >= MIN && saved <= MAX ? saved : 100;
    setZoom(initial);
    applyZoom(initial);
  }, []);

  function change(next: number) {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    setZoom(clamped);
    applyZoom(clamped);
    localStorage.setItem(STORAGE_KEY, String(clamped));
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button
        onClick={() => change(zoom - STEP)}
        aria-label="文字を小さく"
        style={{ padding: "4px 10px" }}
      >
        A-
      </button>
      <span style={{ fontSize: 12, color: "#666", minWidth: 36, textAlign: "center" }}>{zoom}%</span>
      <button
        onClick={() => change(zoom + STEP)}
        aria-label="文字を大きく"
        style={{ padding: "4px 10px" }}
      >
        A+
      </button>
    </div>
  );
}
