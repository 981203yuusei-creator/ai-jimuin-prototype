export default function SignupCompletePage() {
  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif", padding: "0 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>お申込みありがとうございます</h1>
      <p style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
        お支払いの確認が完了次第、登録いただいたユーザー名・パスワードでダッシュボードにログインできるようになります。
      </p>
      <p style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
        LINE公式アカウントとの連携は、下記マニュアルの手順に沿ってお客様ご自身で設定していただきます。
      </p>
      <p style={{ marginBottom: 24 }}>
        <a href="/guide/line-setup">LINE連携設定マニュアルを見る</a>
      </p>
      <a href="/dashboard/login">ログイン画面へ</a>
    </div>
  );
}
