"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/dashboard/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setSubmitting(false);
    setDone(true);
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 24 }}>パスワードをお忘れの方</h1>
      {done ? (
        <p>
          登録されているメールアドレス宛に、パスワード再設定用のリンクを送信しました
          (該当するアカウントが存在する場合)。メールをご確認ください。
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>ユーザー名</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={submitting} style={{ width: "100%", padding: 8 }}>
            {submitting ? "送信中..." : "再設定メールを送信"}
          </button>
        </form>
      )}
      <p style={{ marginTop: 16 }}>
        <a href="/dashboard/login">ログイン画面に戻る</a>
      </p>
    </div>
  );
}
