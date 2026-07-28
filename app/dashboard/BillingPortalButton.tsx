"use client";

import { useState } from "react";

export default function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/dashboard/billing-portal", { method: "POST" });
    if (!res.ok) {
      setLoading(false);
      setError("契約管理画面を開けませんでした。しばらくしてから再度お試しください。");
      return;
    }
    const body = await res.json();
    window.location.href = body.url;
  }

  return (
    <div
      style={{
        marginBottom: 16,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        maxWidth: 320,
      }}
    >
      <strong>お支払い・ご契約について</strong>
      <p style={{ fontSize: 12, color: "#666", marginTop: 4, marginBottom: 8 }}>
        お支払い方法の変更、ご利用明細の確認、解約はこちらから行えます。
      </p>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "読み込み中..." : "お支払い方法の変更・解約はこちら"}
      </button>
      {error && <p style={{ color: "red", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
