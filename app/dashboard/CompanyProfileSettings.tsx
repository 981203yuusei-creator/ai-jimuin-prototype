"use client";

import { useState } from "react";

export default function CompanyProfileSettings({
  initialAddress,
  initialPhone,
}: {
  initialAddress: string | null;
  initialPhone: string | null;
}) {
  const [address, setAddress] = useState(initialAddress ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/dashboard/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactAddress: address, contactPhone: phone }),
    });
    setSaving(false);
    if (res.ok) setSavedAt(Date.now());
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

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
      <strong>自社情報(見積書・請求書に表示)</strong>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>住所</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>電話番号</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
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
