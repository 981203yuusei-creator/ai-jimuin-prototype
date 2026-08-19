"use client";

import { useState } from "react";

export default function EmailSettings({ currentEmail }: { currentEmail: string | null }) {
  const [email, setEmail] = useState(currentEmail ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/dashboard/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "保存に失敗しました");
      return;
    }
    setSavedAt(Date.now());
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
      <strong>パスワード再設定用メールアドレス</strong>
      <p style={{ fontSize: 12, color: "#666", margin: "6px 0" }}>
        パスワードを忘れた際の再設定リンクの送り先です。
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@example.com"
        autoComplete="email"
        style={{ width: "100%", padding: 8, boxSizing: "border-box", fontSize: 16 }}
      />
      {error && <p style={{ color: "red", fontSize: 12, marginTop: 6 }}>{error}</p>}
      <div style={{ marginTop: 8 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        {savedAt && <span style={{ marginLeft: 8, color: "green" }}>✓</span>}
      </div>
    </div>
  );
}
