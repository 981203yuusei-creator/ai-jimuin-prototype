"use client";

import { useState } from "react";

export default function NotifySettings({ connected }: { connected: boolean }) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/dashboard/notify-code", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      const body = await res.json();
      setCode(body.code);
    }
  }

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
      }}
    >
      <strong>LINE通知設定</strong>
      {connected ? (
        <p style={{ margin: "8px 0 0" }}>連携済みです。新規案件・作業完了報告が入るとLINEに通知します。</p>
      ) : code ? (
        <p style={{ margin: "8px 0 0" }}>
          このコードを、通知を受け取りたいLINEアカウントからこの会社のLINE公式アカウントに
          そのまま送信してください:
          <br />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>{code}</span>
        </p>
      ) : (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: "0 0 8px" }}>
            まだ通知先のLINEアカウントが登録されていません。コードを発行してLINEで送信すると連携できます。
          </p>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "発行中..." : "登録コードを発行"}
          </button>
        </div>
      )}
    </div>
  );
}
