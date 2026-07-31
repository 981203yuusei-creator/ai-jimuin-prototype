import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "現場写真の管理でお客様とのトラブルを防ぐ方法",
  description:
    "作業前後の現場写真をきちんと管理することで、言った言わないのトラブルを防ぐ方法と、管理のコツを解説します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        現場写真の管理でお客様とのトラブルを防ぐ方法
      </h1>

      <p>
        「作業前からその状態だった」「聞いていた話と違う」——現場訪問型のサービス業では、こうした
        認識のズレがクレームに発展することがあります。作業前後の写真をきちんと残しておくことは、
        トラブルを未然に防ぐだけでなく、万が一の際にお客様と自社を守る記録にもなります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>写真管理でありがちな失敗</h2>
      <ul>
        <li>スマホのカメラロールに撮りっぱなしで、どの案件の写真か分からなくなる</li>
        <li>作業前の写真は撮ったが、作業後の写真を撮り忘れる</li>
        <li>担当者のスマホの中にしか写真がなく、退職・機種変更で失われる</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>管理を仕組み化するポイント</h2>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>1. 案件情報と写真を必ず紐づける</h3>
      <p>
        カメラロールに保存するだけでは、後から見返した時に「これはどの現場の写真か」が分からなくなります。
        受付の時点で写真を必須項目にし、案件ごとに自動で保存される仕組みであれば、迷うことがありません。
      </p>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>2. 作業前・作業後の両方を残す運用にする</h3>
      <p>
        作業前の写真は受付時に、作業後の写真は完了報告時に、と決めておくことで撮り忘れを防げます。
        完了報告のフォームに写真添付欄を用意しておくと、現場で完結できます。
      </p>
      <h3 style={{ fontSize: 16, marginTop: 20 }}>3. 個人のスマホに依存しない場所に保存する</h3>
      <p>
        担当者のスマホだけに写真がある状態は、機種変更・退職・故障のたびに紛失リスクを抱えることになります。
        クラウド上に自動で保存される仕組みにしておけば、誰が担当しても記録が残ります。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        現場写真は「なんとなく撮る」ものではなく、トラブルを防ぐための記録として仕組み化することが大切です。
        案件情報と紐づけて、作業前後の両方を、個人のスマホに依存しない形で残す運用を心がけましょう。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、受付時の現場写真と、作業完了報告時の写真の両方が、案件ごとに自動でクラウドに
          保存されます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
