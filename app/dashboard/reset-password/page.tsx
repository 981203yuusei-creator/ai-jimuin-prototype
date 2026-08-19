"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PasswordInput from "../PasswordInput";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/dashboard/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "変更に失敗しました");
      return;
    }
    setDone(true);
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  if (!token) {
    return <p>リンクが正しくありません。メール内のリンクからアクセスしてください。</p>;
  }

  if (done) {
    return (
      <>
        <p>パスワードを再設定しました。</p>
        <p style={{ marginTop: 16 }}>
          <a href="/dashboard/login">ログイン画面へ</a>
        </p>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>新しいパスワード(8文字以上)</label>
        <PasswordInput
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          autoFocus
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>新しいパスワード(確認)</label>
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          style={inputStyle}
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <p style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>パスワードが一致しません</p>
        )}
      </div>
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ width: "100%", padding: 8 }}>
        {submitting ? "設定中..." : "パスワードを設定する"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 24 }}>新しいパスワードの設定</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
