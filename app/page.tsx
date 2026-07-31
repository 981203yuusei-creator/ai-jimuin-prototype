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
  "30日間の無料トライアル",
  "案件数・作業員数の上限なし",
  "LINE自動応答・AI電話受付",
  "Googleカレンダー連携",
  "見積書・請求書発行",
  "月次・年次集計、CSV出力",
  "いつでも解約可能",
  "紹介1人につき永続¥1,000引き(最大5人まで)",
];

const FAQS = [
  {
    q: "無料トライアル中に料金は発生しますか?",
    a: "お申込み時にクレジットカードのご登録は必要ですが、30日間は料金が発生しません。トライアル期間中に解約すれば、一切課金されません。",
  },
  {
    q: "導入にどれくらい時間がかかりますか?",
    a: "お申込み・お支払い手続き自体は数分で完了します。LINE公式アカウントとの連携は、マニュアルに沿って進めていただくと30分程度が目安です。",
  },
  {
    q: "LINEの設定は難しくないですか?",
    a: "専用の設定マニュアルをご用意しており、パソコンが苦手な方でも順番に進めれば設定できる内容になっています。",
  },
  {
    q: "電気・水道工事以外の業種でも使えますか?",
    a: "はい。工事・修理・点検・清掃・駆除など、現場に訪問して作業を行うサービス業であれば幅広くご利用いただけます。",
  },
  {
    q: "途中で解約できますか?",
    a: "はい、いつでも解約可能です。ダッシュボードから自己完結で手続きでき、違約金は発生しません。",
  },
  {
    q: "お客様の情報や写真は安全に管理されますか?",
    a: "写真は非公開のストレージに保存され、通信は全て暗号化されています。詳しくはプライバシーポリシーをご確認ください。",
  },
  {
    q: "お友だち紹介プログラムとは何ですか?",
    a: "ご契約中の方に発行される紹介リンクから知り合いが申し込むと、紹介された方は最初の3ヶ月間 月¥1,000引きになります。紹介した方は、その方が3ヶ月継続すると月¥1,000引き(永続)になり、最大5人まで紹介で月¥5,000引きになります。",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1e3a8a" }}>ジムアシ</span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/blog" style={{ fontSize: 14, color: "#334155", textDecoration: "none" }}>
            コラム
          </a>
          <a href="/dashboard/login" style={{ fontSize: 14, color: "#334155", textDecoration: "none" }}>
            ログイン
          </a>
        </div>
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
            <p style={{ fontSize: 16, color: "#444", maxWidth: 440, marginBottom: 16, lineHeight: 1.8 }}>
              お客様対応・スケジュール管理・見積書作成まで、AIとLINEでまるごとサポートする事務アシスタント「ジムアシ」。
            </p>
            <p style={{ fontSize: 14, color: "#2563eb", fontWeight: 700, marginBottom: 20 }}>
              まずは30日間無料でお試しいただけます
            </p>
            <a href="/signup" className="cta-button">
              30日間無料で試してみる
            </a>
            <p style={{ fontSize: 13, color: "#666", marginTop: 16 }}>
              お友だち紹介で、紹介1人につき永続¥1,000引き(最大5人・¥5,000引きまで)
            </p>
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

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "56px 20px" }}>
        <h2 className="section-title">よくあるご質問</h2>
        <div>
          {FAQS.map((f) => (
            <div key={f.q} style={{ borderBottom: "1px solid #e5e7eb", padding: "16px 0" }}>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Q. {f.q}</p>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>A. {f.a}</p>
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
          <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 20 }}>初期費用なし・プランは1つだけ・30日間は無料</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", textAlign: "left" }}>
            {PRICING_INCLUDES.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginBottom: 10 }}>
                <CheckCircleIcon size={18} />
                {item}
              </li>
            ))}
          </ul>
          <a href="/signup" className="cta-button" style={{ backgroundColor: "#fff", color: "#111827", width: "100%", boxSizing: "border-box" }}>
            30日間無料で試してみる
          </a>
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "56px 20px", textAlign: "center" }}>
        <h2 className="section-title">お友だち紹介プログラム</h2>
        <div className="referral-card">
          <p style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 0 }}>
            ご契約中の方は、専用の紹介リンクをお友だちに共有できます。
          </p>
          <div className="referral-grid">
            <div className="referral-box">
              <p style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>紹介された方</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>3ヶ月間 ¥1,000引き</p>
            </div>
            <div className="referral-box">
              <p style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>紹介した方</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>
                1人につき永続 ¥1,000引き<br />
                <span style={{ fontSize: 13, fontWeight: 400, color: "#666" }}>(最大5人まで・合計¥5,000引き)</span>
              </p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#999", marginTop: 16 }}>
            ※紹介された方が3ヶ月以上ご継続いただいた場合に、紹介した方の割引が適用されます。紹介リンクはお申込み後、ダッシュボードの設定画面からご確認いただけます。
          </p>
        </div>
      </section>

      <footer style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "#999" }}>
        <a href="/blog">お役立ちコラム</a>
        {" ・ "}
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
        .referral-card {
          border: 1px solid #dbeafe;
          background: #f0f6ff;
          border-radius: 16px;
          padding: 32px;
        }
        .referral-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 20px;
        }
        .referral-box {
          background: #fff;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          padding: 16px;
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
          .referral-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
