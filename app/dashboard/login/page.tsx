"use client";

import { useState } from "react";
import PasswordInput from "../PasswordInput";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/dashboard/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "ログインに失敗しました");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 24 }}>ジムアシ 案件一覧ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>ユーザー名</label>
          <p style={{ fontSize: 12, color: "#666", marginTop: 0, marginBottom: 6 }}>
            お申込み時にご自身で設定したユーザー名です(会社名ではありません)
          </p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>パスワード</label>
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8 }}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <a href="/dashboard/forgot-password">パスワードをお忘れですか?</a>
      </p>
    </div>
  );
}
