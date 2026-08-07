"use client";

import { useState } from "react";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: 700,
        background: copied ? "#16a34a" : "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {copied ? "コピーしました" : label}
    </button>
  );
}
