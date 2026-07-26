const FEATURES: { title: string; body: string }[] = [
  {
    title: "LINEで自動受付",
    body: "お客様がLINEで問い合わせるだけで、AIがお名前・電話番号・住所・工事内容を自動で聞き取り整理します。現場の写真も忘れずに促します。",
  },
  {
    title: "電話受付もAIにお任せ",
    body: "電話でのご用件も、聞いた内容を一行メモするだけでAIが項目に振り分け。手入力の手間がほぼゼロになります。",
  },
  {
    title: "ダッシュボードで一元管理",
    body: "受付中・対応待ち・作業完了をひと目で確認。スマホでもパソコンでも見やすい画面です。",
  },
  {
    title: "Googleカレンダー自動連携",
    body: "訪問予定を入力すると、自動でカレンダーに登録・更新されます。",
  },
  {
    title: "作業員への指示共有",
    body: "現場の住所・電話番号・工事内容をまとめた作業指示書を、ボタン一つでLINEなどから作業員に共有できます。",
  },
  {
    title: "作業完了報告もスマホで",
    body: "作業員は指示書のページからそのまま完了報告(担当者・時間・写真・コメント)を送信できます。",
  },
  {
    title: "見積書・請求書を自動作成",
    body: "金額を入力するだけで、インボイス制度に対応した見積書・請求書を印刷用ページとして発行できます。",
  },
  {
    title: "確定申告もサポート",
    body: "月別・年別の売上集計や、案件データのCSV出力に対応。会計ソフトへの取込みや税理士への提出にそのまま使えます。",
  },
];

const STEPS: string[] = [
  "お客様がLINEでお問い合わせ・写真を送信",
  "AIが内容を自動整理し、案件として登録",
  "ダッシュボードで内容を確認・スケジュール調整",
  "作業員に指示書を共有し、現場へ",
  "作業完了報告を受け取り、見積書・請求書を発行",
];

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#1a1a1a" }}>
      <section
        style={{
          padding: "64px 16px 48px",
          textAlign: "center",
          background: "linear-gradient(180deg, #eef4ff 0%, #ffffff 100%)",
        }}
      >
        <p style={{ fontSize: 14, color: "#2563eb", fontWeight: 700, marginBottom: 8 }}>
          電気工事・水道工事の小規模事業者向け
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
          現場に集中。事務はAIに。
        </h1>
        <p style={{ fontSize: 16, color: "#444", maxWidth: 480, margin: "0 auto 32px" }}>
          お客様対応・スケジュール管理・見積書作成まで、AIとLINEでまるごとサポートする事務アシスタント「ジムアシ」。
        </p>
        <a
          href="/signup"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          今すぐ申し込む(月額¥9,800)
        </a>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 16px" }}>
        <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 32 }}>
          こんなお悩みはありませんか?
        </h2>
        <div className="pain-grid">
          <div className="pain-card">現場作業中に電話が鳴っても対応できない</div>
          <div className="pain-card">事務員を雇う余裕がない</div>
          <div className="pain-card">お客様情報のメモが紙やメモアプリでバラバラ</div>
          <div className="pain-card">見積書・請求書を作るのが面倒</div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f9fafb", padding: "48px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 32 }}>できること</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "48px 16px" }}>
        <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 32 }}>ご利用の流れ</h2>
        <ol style={{ fontSize: 14, lineHeight: 2.2, paddingLeft: 20 }}>
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section style={{ backgroundColor: "#111827", color: "#fff", padding: "48px 16px", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>料金プラン</h2>
        <p style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>¥9,800<span style={{ fontSize: 16, fontWeight: 400 }}>/月(税込)</span></p>
        <p style={{ fontSize: 13, color: "#ccc", marginBottom: 24 }}>
          プランは1つだけ。初期費用なし・いつでも解約可能です。
        </p>
        <a
          href="/signup"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            backgroundColor: "#fff",
            color: "#111827",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          申し込む
        </a>
      </section>

      <footer style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "#999" }}>
        <a href="/legal/terms">利用規約</a>
        {" ・ "}
        <a href="/legal/privacy">プライバシーポリシー</a>
        {" ・ "}
        <a href="/legal/tokushoho">特定商取引法に基づく表記</a>
        {" ・ "}
        <a href="/dashboard/login">ログイン</a>
      </footer>

      <style>{`
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .pain-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          background: #fff;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .feature-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background: #fff;
        }
        @media (max-width: 600px) {
          .pain-grid, .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
