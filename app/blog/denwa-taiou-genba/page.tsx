import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "現場作業中に電話が鳴っても対応できない問題を解決する方法",
  description:
    "現場作業中の電話対応の悩みを解決する具体的な方法を、コストや導入しやすさの観点から比較して紹介します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        現場作業中に電話が鳴っても対応できない問題を解決する方法
      </h1>

      <p>
        一人、あるいは少人数で現場を回している事業者にとって、「作業中に電話が鳴っても出られない」「折り返したら
        既に他社に決まっていた」という機会損失は、地味に効いてくる悩みです。この記事では、現実的な解決策を
        コストや手間の観点から整理します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法1: 電話代行サービスを使う</h2>
      <p>
        月額数千円〜数万円で、オペレーターが電話を一次受付してくれるサービスです。確実に対応してもらえる
        反面、コストがかかり、聞き取った内容を結局自分で転記・整理する手間は残ります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法2: 事務員を雇う</h2>
      <p>
        もっとも確実ですが、小規模事業者にとって人件費の負担は小さくありません。案件数が安定して多い場合を
        除き、割に合わないケースが多いでしょう。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法3: 留守番電話・SMSで折り返し案内する</h2>
      <p>
        コストはかかりませんが、お客様側の手間が増えるため、そのまま他社に流れてしまうリスクがあります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>方法4: LINEを窓口にして、AIに一次対応させる</h2>
      <p>
        電話ではなくLINEを問い合わせ窓口にすることで、お客様は自分の都合の良いタイミングで連絡でき、こちらは
        現場作業中でも後で内容を確認できます。さらにAIが自動で氏名・連絡先・依頼内容を聞き取って整理してくれれば、
        「電話に出られない」こと自体が問題にならなくなります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>比較まとめ</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 16 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
            <th style={{ padding: 8 }}>方法</th>
            <th style={{ padding: 8 }}>コスト</th>
            <th style={{ padding: 8 }}>対応の手間</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 8 }}>電話代行</td>
            <td style={{ padding: 8 }}>中〜高</td>
            <td style={{ padding: 8 }}>転記の手間あり</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 8 }}>事務員雇用</td>
            <td style={{ padding: 8 }}>高</td>
            <td style={{ padding: 8 }}>ほぼなし</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 8 }}>留守電・SMS</td>
            <td style={{ padding: 8 }}>低</td>
            <td style={{ padding: 8 }}>機会損失リスク大</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 8 }}>LINE + AI自動対応</td>
            <td style={{ padding: 8 }}>低〜中</td>
            <td style={{ padding: 8 }}>ほぼなし</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」は、LINEでの問い合わせをAIが自動で受け付け、必要な情報を聞き取って案件として整理する
          事務アシスタントです。電話に出られない時間帯も、対応漏れを防げます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
