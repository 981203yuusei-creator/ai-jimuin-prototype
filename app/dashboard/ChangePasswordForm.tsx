"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/dashboard/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "変更に失敗しました");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (!open) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setOpen(true)}>パスワードを変更</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 320 }}
    >
      <strong>パスワードを変更</strong>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          現在のパスワード
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          新しいパスワード(8文字以上)
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
          新しいパスワード(確認)
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      {error && <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>{error}</p>}
      {success && <p style={{ color: "green", fontSize: 12, marginTop: 8 }}>変更しました。</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "変更中..." : "変更する"}
        </button>
        <button type="button" onClick={() => setOpen(false)}>
          閉じる
        </button>
      </div>
    </form>
  );
}
