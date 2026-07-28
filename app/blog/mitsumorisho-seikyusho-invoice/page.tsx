import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "個人事業主のための見積書・請求書の作り方とインボイス制度の対応",
  description:
    "個人事業主・小規模事業者向けに、見積書・請求書の基本項目とインボイス制度(適格請求書)への対応方法をわかりやすく解説します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        個人事業主のための見積書・請求書の作り方とインボイス制度の対応
      </h1>

      <p>
        現場作業をしながら、見積書や請求書の作成に頭を悩ませている個人事業主・小規模事業者は多いのではないでしょうか。
        この記事では、見積書・請求書に必要な基本項目と、2023年に始まったインボイス制度(適格請求書等保存方式)への
        対応方法を整理します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>見積書に必要な項目</h2>
      <ul>
        <li>発行日</li>
        <li>お客様の氏名・宛名</li>
        <li>工事・作業内容</li>
        <li>金額(税抜・消費税・税込)</li>
        <li>発行者(自社)の名称・住所・連絡先</li>
        <li>有効期限(見積り金額がいつまで有効か)</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>請求書に必要な項目</h2>
      <p>見積書の項目に加えて、以下が必要です。</p>
      <ul>
        <li>支払期限</li>
        <li>振込先口座</li>
        <li>インボイス制度に対応する場合は「登録番号」</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>インボイス制度(適格請求書)への対応</h2>
      <p>
        インボイス制度に登録した「適格請求書発行事業者」は、請求書に以下の情報を明記する必要があります。
      </p>
      <ul>
        <li>登録番号(T + 13桁の数字)</li>
        <li>税率ごとに区分した合計金額と適用税率</li>
        <li>税率ごとの消費税額</li>
      </ul>
      <p>
        免税事業者(インボイス未登録)の場合は、これらの記載は不要ですが、お客様が仕入税額控除を受けられない点に
        注意が必要です。取引先が法人の場合は、インボイス登録を求められるケースもあります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>手作業で作る場合の課題</h2>
      <p>
        Excelやテンプレートで都度作成する方法は、案件数が増えるほど手間がかかり、金額の計算ミスや税率の記載漏れも
        起きやすくなります。案件情報と紐づけて、金額を入力するだけで見積書・請求書が自動生成できる仕組みを使うと、
        この手間を大きく減らせます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        見積書・請求書は、記載すべき項目とインボイス制度への対応を押さえておけば、それほど難しいものではありません。
        案件管理と請求書発行を一体化できる仕組みを使えば、事務作業の負担をさらに減らせます。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、金額を入力するだけでインボイス制度に対応した見積書・請求書(登録番号・消費税内訳つき)を
          印刷用ページとして発行できます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
