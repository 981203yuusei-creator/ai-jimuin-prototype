"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PasswordInput from "../dashboard/PasswordInput";

function SignupForm() {
  const searchParams = useSearchParams();
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("利用規約・プライバシーポリシーへの同意が必要です。");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, username, password, email, referralCode }),
    });
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(body.error ?? "登録に失敗しました");
      return;
    }

    window.location.href = body.url;
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>ジムアシに申し込む</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        30日間無料・以降は月額¥9,800(税込)・クレジットカード決済・いつでも解約できます。
        クレジットカードのご登録は必要ですが、トライアル期間中は課金されません。
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>会社名</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            autoComplete="organization"
            autoFocus
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
            ダッシュボードのログインユーザー名
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
            パスワード(8文字以上)
          </label>
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={8}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
            連絡先メールアドレス(パスワード再設定用)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 2 }}>
            紹介コード(お持ちの場合・任意)
          </label>
          <input
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="例: A1B2C3D4"
            style={inputStyle}
          />
          {referralCode && (
            <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>
              入力いただくと、最初の3ヶ月は月¥1,000引きになります。
            </p>
          )}
        </div>

        <div style={{ marginBottom: 16, fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              <a href="/legal/terms" target="_blank" rel="noreferrer">
                利用規約
              </a>
              と
              <a href="/legal/privacy" target="_blank" rel="noreferrer">
                プライバシーポリシー
              </a>
              に同意します
            </span>
          </label>
        </div>

        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ width: "100%", padding: 10 }}>
          {submitting ? "手続き中..." : "30日間無料で試してみる"}
        </button>
      </form>

      <p style={{ fontSize: 12, color: "#999", marginTop: 16 }}>
        <a href="/legal/tokushoho">特定商取引法に基づく表記</a>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
