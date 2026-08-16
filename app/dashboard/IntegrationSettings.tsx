"use client";

import { useState } from "react";

export default function IntegrationSettings({
  initialApiKey,
}: {
  initialApiKey: string | null;
}) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (apiKey && !confirm("再発行すると、今まで発行していたAPIキーは使えなくなります。よろしいですか？")) {
      return;
    }
    setGenerating(true);
    const res = await fetch("/api/dashboard/integration-key", { method: "POST" });
    setGenerating(false);
    if (res.ok) {
      const data = await res.json();
      setApiKey(data.key);
    }
  }

  async function handleCopy() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
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
      <strong>外部サービス連携(APIキー)</strong>{" "}
      <span style={{ fontSize: 12, color: apiKey ? "green" : "#999" }}>
        {apiKey ? "(発行済み)" : "(未発行)"}
      </span>
      <p style={{ fontSize: 12, color: "#666", marginTop: 4, marginBottom: 8 }}>
        「AI売上監査」などの外部サービスに、ジムアシの案件データ(お客様名・見積金額・請求金額など)を読み取り専用で連携できます。発行したキーは連携先サービスの設定画面に貼り付けてください。
      </p>

      {apiKey && (
        <p
          style={{
            fontSize: 12,
            wordBreak: "break-all",
            background: "#f5f5f5",
            padding: 8,
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          {apiKey}
        </p>
      )}

      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" as const }}>
        {apiKey && (
          <button type="button" onClick={handleCopy} style={{ padding: "6px 12px" }}>
            コピー
          </button>
        )}
        <button type="button" onClick={handleGenerate} disabled={generating} style={{ padding: "6px 12px" }}>
          {generating ? "発行中..." : apiKey ? "再発行" : "APIキーを発行"}
        </button>
        {copied && <span style={{ fontSize: 12, color: "green" }}>コピーしました</span>}
      </div>
    </div>
  );
}
