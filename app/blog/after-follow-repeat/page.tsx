import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "リピート顧客を増やすアフターフォローの工夫",
  description:
    "新規集客に頼らず経営を安定させるための、現場訪問型サービス業向けアフターフォローの工夫を紹介します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        リピート顧客を増やすアフターフォローの工夫
      </h1>

      <p>
        新規のお客様を集め続けるのは、広告費や手間がかかり大変です。一方で、一度対応したお客様に
        次も選んでもらえれば、集客コストをかけずに安定した受注につながります。この記事では、
        現場訪問型サービス業でできるアフターフォローの工夫を紹介します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>なぜアフターフォローが後回しになりやすいか</h2>
      <p>
        作業が完了した時点で「仕事は終わった」という感覚になりやすく、その後のお客様との接点が
        自然消滅してしまうことがほとんどです。連絡先は残っていても、次にいつ・何のきっかけで
        連絡すればよいか分からず、そのままになってしまいます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>できるアフターフォローの例</h2>
      <ul>
        <li>作業完了後、お礼のメッセージを送る(手間をかけず定型文でも十分です)</li>
        <li>消耗品の交換時期や点検の目安が近づいたタイミングで連絡する</li>
        <li>過去の作業内容をすぐに確認できるようにしておき、再訪時にスムーズに対応する</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>過去の案件情報が残っていることの価値</h2>
      <p>
        「前回いつ、何の作業をしたか」がすぐに分かる状態であれば、再訪の連絡がしやすくなるだけでなく、
        お客様から再度連絡があった際にも「前回の記録」を踏まえた対応ができ、信頼につながります。
        紙の伝票や個人のメモに散らばっていると、この振り返りに時間がかかり、結局後回しになりがちです。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        アフターフォローは特別なことをする必要はなく、「過去の案件をすぐ振り返れる状態にしておく」
        だけでも実行しやすくなります。新規集客に頼りすぎない経営のために、まずは記録を残すところから
        始めてみましょう。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、過去の案件を一覧・検索でき、お客様ごとの対応履歴をいつでも振り返ることが
          できます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
