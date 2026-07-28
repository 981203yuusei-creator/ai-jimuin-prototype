import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お役立ちコラム",
  description:
    "現場訪問型サービス業の小規模事業者向けに、顧客対応・見積書請求書・確定申告・事務効率化に役立つ情報を発信しています。",
};

const ARTICLES = [
  {
    slug: "denwa-taiou-genba",
    title: "現場作業中に電話が鳴っても対応できない問題を解決する方法",
    description: "電話代行・事務員雇用・LINE活用など、現実的な解決策をコストの観点から比較します。",
  },
  {
    slug: "line-koukyaku-kanri",
    title: "LINEで顧客管理をする方法とメリット・デメリット",
    description: "LINEを顧客対応の窓口にする3つの方法と、それぞれのメリット・デメリットを解説します。",
  },
  {
    slug: "hitorioyakata-jimu-kouritsuka",
    title: "事務員を雇わずに一人親方が事務作業を効率化する方法",
    description: "受付・スケジュール管理・請求書発行・確定申告準備を、人を増やさずに効率化する方法。",
  },
  {
    slug: "mitsumorisho-seikyusho-invoice",
    title: "個人事業主のための見積書・請求書の作り方とインボイス制度の対応",
    description: "見積書・請求書の必要項目と、インボイス制度(適格請求書)への対応方法を整理します。",
  },
  {
    slug: "kakuteishinkoku-junbi",
    title: "職人・現場仕事のための確定申告の準備と経費管理",
    description: "確定申告に向けた売上記録・経費管理のポイントを、日頃からできる準備として紹介します。",
  },
];

export default function BlogIndexPage() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <p style={{ fontSize: 13 }}>
        <a href="/" style={{ color: "#2563eb" }}>← トップページ</a>
      </p>
      <h1 style={{ fontSize: 24, marginTop: 12, marginBottom: 8 }}>お役立ちコラム</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 32 }}>
        現場訪問型サービス業の小規模事業者に役立つ、事務作業に関する情報を発信しています。
      </p>

      <div>
        {ARTICLES.map((a) => (
          <a
            key={a.slug}
            href={`/blog/${a.slug}`}
            style={{
              display: "block",
              padding: "16px 0",
              borderBottom: "1px solid #eee",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h2 style={{ fontSize: 17, marginBottom: 6, color: "#1a1a1a" }}>{a.title}</h2>
            <p style={{ fontSize: 13.5, color: "#666" }}>{a.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
