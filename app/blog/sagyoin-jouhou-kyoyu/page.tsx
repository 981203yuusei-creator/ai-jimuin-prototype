import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "現場作業員との情報共有をスムーズにする方法",
  description:
    "複数人で現場を回す事業者向けに、電話での口頭連絡に頼らず作業員と情報共有する方法を解説します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        現場作業員との情報共有をスムーズにする方法
      </h1>

      <p>
        複数人で現場を回している事業者にとって、「誰が・どの現場に・何をしに行くのか」を正しく伝える
        ことは意外と手間がかかります。電話での口頭連絡だけに頼っていると、聞き間違いや伝達漏れが
        起きやすくなります。この記事では、作業員との情報共有をスムーズにする方法を紹介します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>口頭連絡だけに頼るリスク</h2>
      <ul>
        <li>住所や電話番号の聞き間違いが起きやすい</li>
        <li>作業員が現場で内容を確認したい時、電話でしか確認手段がない</li>
        <li>複数件を同時にお願いする時、伝え漏れが起きやすい</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>スムーズにする工夫</h2>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>1. 現場情報をまとめた形で共有する</h3>
      <p>
        住所・電話番号・作業内容をまとめた「作業指示書」のような形で共有できれば、口頭で一つずつ
        伝える必要がなくなります。LINEなどで一度送るだけで済むようにしておくと、伝達漏れを防げます。
      </p>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>2. 現場からいつでも確認できるようにする</h3>
      <p>
        作業員が移動中や現場で「住所をもう一度確認したい」と思った時、電話をかけ直さずスマホで
        確認できれば、双方の手間が減ります。住所をタップすれば地図アプリが開く、電話番号をタップすれば
        発信できる、といった形にしておくとさらに使いやすくなります。
      </p>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>3. 完了報告もその場で完結させる</h3>
      <p>
        作業が終わった後の報告を、電話での口頭報告ではなく、その場でスマホから送信できる形にしておくと、
        事務所に戻ってからまとめて報告する手間がなくなり、進捗確認のための電話も減らせます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        作業員との情報共有は、口頭連絡を減らし「まとめて共有・その場で確認・その場で報告」ができる
        仕組みに変えることで、聞き間違いや伝達漏れを大きく減らせます。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、現場の住所・電話番号・作業内容をまとめた作業指示書をボタン一つで共有でき、
          作業員はその場から完了報告を送信できます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
