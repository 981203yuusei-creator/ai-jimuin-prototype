import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "水道工事店が事務作業を効率化する方法",
  description:
    "水道工事店・水道修理業が抱える緊急対応の電話取りこぼしや、見積・請求・確定申告の負担を減らす具体的な方法を紹介します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        水道工事店が事務作業を効率化する方法
      </h1>

      <p>
        水道修理は「スマホで検索してから30分以内に問い合わせに至る」割合が6割を超えるとも言われる、
        緊急対応が求められる業種です。作業中に電話に出られず取りこぼすことがそのまま売上の機会損失に
        直結する一方、事務員を雇う余裕がない小規模事業者も多いのが実情です。この記事では、人を増やさずに
        事務作業を効率化する方法を整理します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>水道工事店の事務でよくある悩み</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>作業中や移動中に電話が鳴っても出られず、緊急のお客様を逃してしまう</li>
        <li>現場の住所・症状・写真をお客様からうまく聞き取れないまま出動してしまう</li>
        <li>見積書・請求書の作成が後回しになり、入金管理があいまいになる</li>
        <li>確定申告の時期に売上・経費の整理でまとめて苦労する</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法1: LINEで一次受付をAIに任せる</h2>
      <p>
        電話が取れない時間帯でも、LINEならお客様が都合の良いタイミングで連絡できます。AIが名前・電話番号・
        住所・症状を自動で聞き取り、現場の写真も必須項目として促してくれれば、出動前に状況を把握でき、
        現地での二度手間を減らせます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法2: 案件を一覧・地図で管理する</h2>
      <p>
        受付中・対応待ち・作業完了を一覧で管理し、住所をタップすれば地図が開く形にしておくと、
        複数件を掛け持ちする日でも移動や優先順位の判断がしやすくなります。Googleカレンダーとの連携も
        あわせておくと、スケジュール管理がひとつにまとまります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法3: 見積書・請求書をその場で発行する</h2>
      <p>
        インボイス制度(適格請求書)に対応した見積書・請求書を、案件情報からボタン1つで発行できるようにして
        おけば、現場対応後の書類作成にかかる時間を大きく減らせます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法4: 月次・年次の集計を自動化する</h2>
      <p>
        日々の案件記録がそのまま売上集計・確定申告用のCSV出力につながる仕組みにしておけば、
        年度末にまとめて集計する手間がなくなります。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」は、LINEでの緊急問い合わせ受付から案件管理・見積書/請求書発行・売上集計まで、
          水道工事店の事務作業をAIとまとめてサポートする事務アシスタントです。月額9,800円、30日間無料で
          お試しいただけます。
        </p>
        <a href="/signup" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシを無料で試してみる →
        </a>
      </div>
    </div>
  );
}
