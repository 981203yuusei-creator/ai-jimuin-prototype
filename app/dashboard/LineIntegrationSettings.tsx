"use client";

import { useState } from "react";

export default function LineIntegrationSettings({
  initialLineChannelId,
  initialLineChannelSecret,
  initialLineChannelAccessToken,
  initialCalendarId,
}: {
  initialLineChannelId: string | null;
  initialLineChannelSecret: string | null;
  initialLineChannelAccessToken: string | null;
  initialCalendarId: string | null;
}) {
  const [lineChannelId, setLineChannelId] = useState(initialLineChannelId ?? "");
  const [lineChannelSecret, setLineChannelSecret] = useState(initialLineChannelSecret ?? "");
  const [lineChannelAccessToken, setLineChannelAccessToken] = useState(
    initialLineChannelAccessToken ?? ""
  );
  const [calendarId, setCalendarId] = useState(initialCalendarId ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/dashboard/line-integration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineChannelId, lineChannelSecret, lineChannelAccessToken, calendarId }),
    });
    setSaving(false);
    if (res.ok) setSavedAt(Date.now());
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };
  const connected = Boolean(initialLineChannelId && initialLineChannelSecret && initialLineChannelAccessToken);

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
      <strong>LINE連携設定</strong>{" "}
      <span style={{ fontSize: 12, color: connected ? "green" : "#999" }}>
        {connected ? "(連携済み)" : "(未設定)"}
      </span>
      <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        LINE Developersコンソールで作成したチャネルの情報を入力してください。設定方法は
        <a href="/guide/line-setup" target="_blank" rel="noreferrer">
          こちらのマニュアル
        </a>
        をご覧ください。
      </p>

      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          チャネルID(Bot Basic ID / destination)
        </label>
        <input value={lineChannelId} onChange={(e) => setLineChannelId(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          チャネルシークレット
        </label>
        <input
          value={lineChannelSecret}
          onChange={(e) => setLineChannelSecret(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          チャネルアクセストークン
        </label>
        <input
          value={lineChannelAccessToken}
          onChange={(e) => setLineChannelAccessToken(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          GoogleカレンダーID(任意)
        </label>
        <input value={calendarId} onChange={(e) => setCalendarId(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        {savedAt && <span style={{ marginLeft: 8, color: "green" }}>✓</span>}
      </div>
    </div>
  );
}
