import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "小規模事業者の見積もり・価格設定の基本",
  description:
    "現場訪問型サービス業の個人事業主・小規模事業者向けに、見積もりと価格設定を考える際の基本的な視点を解説します。",
};

export default function Article() {
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px", lineHeight: 1.9, fontSize: 15.5 }}>
      <p style={{ fontSize: 13, color: "#2563eb" }}>
        <a href="/blog">← お役立ちコラム一覧</a>
      </p>
      <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 24 }}>
        小規模事業者の見積もり・価格設定の基本
      </h1>

      <p>
        「安くしすぎて利益が出ない」「相場が分からず見積もりに時間がかかる」——価格設定は、現場訪問型
        サービス業の個人事業主・小規模事業者が共通して悩むポイントです。この記事では、見積もり・価格設定を
        考える際の基本的な視点を整理します。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>価格に含めるべきものを洗い出す</h2>
      <p>作業時間の対価だけでなく、以下も価格に反映されているか確認しましょう。</p>
      <ul>
        <li>移動時間・出張費</li>
        <li>材料費・消耗品費</li>
        <li>工具の維持費・減価償却分</li>
        <li>見積もり作成・事務作業にかかる時間</li>
        <li>保険料などの固定費</li>
      </ul>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>見積もりを出すスピードも価格のうち</h2>
      <p>
        同じ内容の見積もりでも、他社より対応が早ければ、価格で比較される前に選ばれることがあります。
        逆に見積もり作成に時間がかかると、その間に他社に決められてしまうケースも少なくありません。
        受付から見積もり作成までの手間を減らしておくことは、価格競争を避けるための工夫の一つです。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>過去の見積もり・実績を振り返れる状態にしておく</h2>
      <p>
        似たような案件の見積もりを毎回ゼロから考えていると、時間がかかるうえに金額のブレも出やすくなります。
        過去の案件と金額が記録として残っていれば、それを基準にすばやく・一貫性のある見積もりを出せます。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>値下げよりも先に見直すこと</h2>
      <p>
        値下げは一番手軽な対応に見えますが、利益を直接削ります。値下げを検討する前に、事務作業の時間を
        減らして対応件数を増やせないか、見積もりのスピードを上げて成約率を上げられないか、といった
        「価格以外の競争力」を見直す方が、長期的には効果的です。
      </p>

      <h2 style={{ fontSize: 19, marginTop: 32 }}>まとめ</h2>
      <p>
        価格設定は「いくらにするか」だけでなく、「どれだけ早く・一貫性を持って見積もりを出せるか」も
        含めて考えると、無理な値下げに頼らずに競争力を保てます。
      </p>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid #dbeafe", borderRadius: 8, background: "#f0f6ff" }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>
          「ジムアシ」では、案件情報に金額を入力するだけで見積書をすぐに発行でき、過去の案件も一覧で
          振り返ることができます。
        </p>
        <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>
          ジムアシの詳細を見る →
        </a>
      </div>
    </div>
  );
}
