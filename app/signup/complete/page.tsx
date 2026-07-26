export default function SignupCompletePage() {
  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif", padding: "0 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>お申込みありがとうございます</h1>
      <p style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
        お支払いの確認が完了次第、登録いただいたユーザー名・パスワードでダッシュボードにログインできるようになります。
      </p>
      <p style={{ fontSize: 14, color: "#333", marginBottom: 24 }}>
        LINE公式アカウントやGoogleカレンダーとの連携設定については、追ってご連絡いたします。
      </p>
      <a href="/dashboard/login">ログイン画面へ</a>
    </div>
  );
}
