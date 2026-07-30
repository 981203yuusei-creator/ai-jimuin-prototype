"use client";

import { useState } from "react";

export default function ReferralSettings({
  referralCode,
  confirmedCount,
}: {
  referralCode: string | null;
  confirmedCount: number;
}) {
  const [copied, setCopied] = useState(false);

  if (!referralCode) return null;

  const referralUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`;
  const discount = Math.min(confirmedCount, 5) * 1000;

  async function handleCopy() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        marginBottom: 16,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        maxWidth: 400,
      }}
    >
      <strong>お友だち紹介プログラム</strong>
      <p style={{ fontSize: 12, color: "#666", marginTop: 4, marginBottom: 8 }}>
        このリンクから知り合いに申し込んでもらうと、相手は最初の3ヶ月間 月¥1,000引きになり、
        あなたは3ヶ月継続していただいた時点で月¥1,000引き(永続・最大¥5,000引きまで)になります。
      </p>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" as const }}>
        <button type="button" onClick={handleCopy} style={{ padding: "6px 12px" }}>
          紹介リンクをコピー
        </button>
        {copied && <span style={{ fontSize: 12, color: "green" }}>コピーしました</span>}
      </div>
      <p style={{ fontSize: 12, color: "#666", marginTop: 8, wordBreak: "break-all" }}>{referralUrl}</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>
        現在の紹介実績: <strong>{confirmedCount}件</strong>(現在の割引額: ¥{discount.toLocaleString()}/月)
      </p>
    </div>
  );
}
