"use client";

import { useState } from "react";

export default function CopyableCode({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない(手動選択でコピーしてもらう)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#f3f4f6",
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: "8px 12px",
        marginTop: 6,
        marginBottom: 6,
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: 13, wordBreak: "break-all", flex: 1 }}>
        {children}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          flexShrink: 0,
          fontSize: 12,
          padding: "4px 10px",
          border: "1px solid #999",
          borderRadius: 4,
          background: "#fff",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {copied ? "コピー完了" : "コピー"}
      </button>
    </div>
  );
}
