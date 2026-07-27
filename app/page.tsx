import HeroIllustration from "./HeroIllustration";
import {
  ChatIcon,
  PhoneIcon,
  ListIcon,
  CalendarIcon,
  ShareIcon,
  ClipboardCheckIcon,
  DocumentIcon,
  ChartIcon,
  CheckCircleIcon,
  SparkleIcon,
} from "./icons";

const FEATURES: { icon: (props: { size?: number; color?: string }) => JSX.Element; title: string; body: string }[] = [
  {
    icon: ChatIcon,
    title: "LINEで自動受付",
    body: "お客様がLINEで問い合わせるだけで、AIがお名前・電話番号・住所・作業内容を自動で聞き取り整理します。現場の写真も忘れずに促します。",
  },
  {
    icon: PhoneIcon,
    title: "電話受付もAIにお任せ",
    body: "電話でのご用件も、聞いた内容を一行メモするだけでAIが項目に振り分け。手入力の手間がほぼゼロになります。",
  },
  {
    icon: ListIcon,
    title: "ダッシュボードで一元管理",
    body: "受付中・対応待ち・作業完了をひと目で確認。スマホでもパソコンでも見やすい画面です。",
  },
  {
    icon: CalendarIcon,
    title: "Googleカレンダー自動連携",
    body: "訪問予定を入力すると、自動でカレンダーに登録・更新されます。",
  },
  {
    icon: ShareIcon,
    title: "作業員への指示共有",
    body: "現場の住所・電話番号・作業内容をまとめた作業指示書を、ボタン一つでLINEなどから作業員に共有できます。",
  },
  {
    icon: ClipboardCheckIcon,
    title: "作業完了報告もスマホで",
    body: "作業員は指示書のページからそのまま完了報告(担当者・時間・写真・コメント)を送信できます。",
  },
  {
    icon: DocumentIcon,
    title: "見積書・請求書を自動作成",
    body: "金額を入力するだけで、インボイス制度に対応した見積書・請求書を印刷用ページとして発行できます。",
  },
  {
    icon: ChartIcon,
    title: "確定申告もサポート",
    body: "月別・年別の売上集計や、案件データのCSV出力に対応。会計ソフトへの取込みや税理士への提出にそのまま使えます。",
  },
];

const STEPS: { icon: (props: { size?: number; color?: string }) => JSX.Element; text: string }[] = [
  { icon: ChatIcon, text: "お客様がLINEでお問い合わせ・写真を送信" },
  { icon: SparkleIcon, text: "AIが内容を自動整理し、案件として登録" },
  { icon: ListIcon, text: "ダッシュボードで内容を確認・スケジュール調整" },
  { icon: ShareIcon, text: "作業員に指示書を共有し、現場へ" },
  { icon: DocumentIcon, text: "完了報告を受け取り、見積書・請求書を発行" },
];

const PRICING_INCLUDES = [
  "案件数・作業員数の上限なし",
  "LINE自動応答・AI電話受付",
  "Googleカレンダー連携",
  "見積書・請求書発行",
  "月次・年次集計、CSV出力",
  "いつでも解約可能",
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ジムアシ",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "現場に集中。事務はAIに。LINEでのお客様対応・AIによる自動入力・スケジュール管理・見積書/請求書作成・確定申告対応まで、工事・修理・点検・清掃などの小規模事業者向け事務アシスタントSaaS。",
  offers: {
    "@type": "Offer",
    price: "9800",
    priceCurrency: "JPY",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "9800",
      priceCurrency: "JPY",
      billingDuration: "P1M",
    },
  },
};

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#1a1a1a", overflowX: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1e3a8a" }}>ジムアシ</span>
        <a href="/dashboard/login" style={{ fontSize: 14, color: "#334155", textDecoration: "none" }}>
          ログイン
        </a>
      </header>

      <section
        style={{
          background: "linear-gradient(180deg, #eef4ff 0%, #ffffff 100%)",
        }}
      >
        <div className="hero-grid">
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 13, color: "#2563eb", fontWeight: 700, marginBottom: 12, letterSpacing: 0.5 }}>
              工事・修理・点検・清掃など、現場訪問サービス業の小規模事業者向け
            </p>
            <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>
              現場に集中。
              <br />
              事務はAIに。
            </h1>
            <p style={{ fontSize: 16, color: "#444", maxWidth: 440, marginBottom: 32, lineHeight: 1.8 }}>
              お客様対応・スケジュール管理・見積書作成まで、AIとLINEでまるごとサポートする事務アシスタント「ジムアシ」。
            </p>
            <a href="/signup" className="cta-button">
              今すぐ申し込む(月額¥9,800)
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px" }}>
        <h2 className="section-title">こんなお悩みはありませんか?</h2>
        <div className="pain-grid">
          <div className="pain-card">現場作業中に電話が鳴っても対応できない</div>
          <div className="pain-card">事務員を雇う余裕がない</div>
          <div className="pain-card">お客様情報のメモが紙やメモアプリでバラバラ</div>
          <div className="pain-card">見積書・請求書を作るのが面倒</div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f8fafc", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 className="section-title">できること</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon({})}</div>
                <h3 style={{ fontSize: 15.5, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px" }}>
        <h2 className="section-title">ご利用の流れ</h2>
        <div className="steps-row">
          {STEPS.map((s, i) => (
            <div key={s.text} className="step-item">
              <div className="step-icon-wrap">{s.icon({ size: 26 })}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 10 }}>{s.text}</p>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: "#111827", color: "#fff", padding: "56px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, marginBottom: 24 }}>料金プラン</h2>
        <div className="pricing-card">
          <p style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>
            ¥9,800<span style={{ fontSize: 15, fontWeight: 400 }}>/月(税込)</span>
          </p>
          <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 20 }}>初期費用なし・プランは1つだけ</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", textAlign: "left" }}>
            {PRICING_INCLUDES.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginBottom: 10 }}>
                <CheckCircleIcon size={18} />
                {item}
              </li>
            ))}
          </ul>
          <a href="/signup" className="cta-button" style={{ backgroundColor: "#fff", color: "#111827", width: "100%", boxSizing: "border-box" }}>
            申し込む
          </a>
        </div>
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
        .section-title {
          font-size: 22px;
          text-align: center;
          margin-bottom: 32px;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #2563eb;
          color: #fff;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          font-size: 16px;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }
        .hero-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 64px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 24px;
        }
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pain-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 18px;
          font-size: 14px;
          background: #fff;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .feature-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: #fff;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .feature-card:hover {
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          transform: translateY(-2px);
        }
        .feature-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #eef4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .steps-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .step-item {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .step-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #eef4ff;
          border: 2px solid #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .step-connector {
          position: absolute;
          top: 26px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #cbd5e1;
          z-index: 0;
        }
        .pricing-card {
          max-width: 340px;
          margin: 0 auto;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 16px;
          padding: 32px;
        }
        @media (max-width: 800px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 24px;
          }
          .hero-grid > div:first-child {
            text-align: center;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-row {
            flex-direction: column;
            gap: 28px;
          }
          .step-connector {
            display: none;
          }
        }
        @media (max-width: 500px) {
          .pain-grid {
            grid-template-columns: 1fr;
          }
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
