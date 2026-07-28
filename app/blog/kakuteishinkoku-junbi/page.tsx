import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "職人・現場仕事のための確定申告の準備と経費管理",
  description:
    "現場訪問型サービス業の個人事業主向けに、確定申告に向けた年間の準備・売上記録・経費管理のポイントを解説します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        職人・現場仕事のための確定申告の準備と経費管理
      </h1>

      <p>
        年に一度の確定申告。現場作業に追われて後回しにした結果、直前に慌てて資料をかき集めることになった経験は
        ないでしょうか。この記事では、現場訪問型サービス業の個人事業主が、日頃からできる確定申告の準備を整理します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>確定申告に必要な基本資料</h2>
      <ul>
        <li>売上台帳(いつ・誰から・いくら受け取ったか)</li>
        <li>経費の領収書・レシート</li>
        <li>請求書・見積書の控え</li>
        <li>銀行口座の入出金明細</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>売上記録は「その都度」がコツ</h2>
      <p>
        確定申告直前に1年分の売上をまとめて思い出すのは、ほぼ不可能です。案件が発生した都度、日付・お客様名・
        金額を記録しておくことで、年末の作業が「集計するだけ」の状態になります。紙のノートやExcelでも構いませんが、
        案件管理と売上記録を同じ場所で行える仕組みを使うと、二重入力の手間がなくなります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>経費として計上できるものの例</h2>
      <ul>
        <li>工具・消耗品費</li>
        <li>車両のガソリン代・駐車場代</li>
        <li>作業着・安全装備</li>
        <li>携帯電話代(仕事で使う分)</li>
        <li>事務用品・ソフトウェア利用料</li>
      </ul>
      <p>
        プライベートと仕事で共用しているもの(車・携帯電話など)は、使用割合に応じて按分して計上します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>月次・年次で売上を確認する習慣</h2>
      <p>
        月ごとの売上・案件数を定期的に見返しておくと、繁忙期・閑散期の傾向も把握しやすくなり、確定申告時にも
        「あれ、この月の売上が抜けている」といった見落としを防げます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        確定申告の負担を減らす一番のコツは、日頃から案件情報と売上を記録しておくことです。年に一度の作業で
        済ませようとせず、日々の業務の延長として記録を続けられる仕組みを取り入れることをおすすめします。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、案件ごとの売上を自動で月別・年別に集計し、確定申告や会計ソフトへの取込み用に
          CSVでダウンロードできます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
