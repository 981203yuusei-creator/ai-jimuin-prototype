const ROWS: [string, string][] = [
  ["販売事業者", "下池 佑征"],
  ["運営統括責任者", "下池 佑征"],
  ["所在地", "ご請求をいただいた場合、遅滞なく開示いたします(下記メールアドレスまでご連絡ください)"],
  ["電話番号", "ご請求をいただいた場合、遅滞なく開示いたします(下記メールアドレスまでご連絡ください)"],
  ["メールアドレス", "yu1210230@outlook.jp"],
  ["サービス名", "ジムアシ"],
  ["販売価格", "月額9,800円(税込)"],
  ["販売価格以外に必要な料金", "なし(インターネット接続料金・通信費はお客様のご負担となります)"],
  ["お支払い方法", "クレジットカード決済(Stripe)"],
  ["お支払い時期", "お申込み時に初回決済、以降は毎月自動更新にて決済されます"],
  ["サービス提供時期", "決済確認後、順次アカウントを発行いたします"],
  [
    "返品・キャンセルについて",
    "サービスの性質上、お支払い済み料金の返金は行っておりません。解約はダッシュボードまたはメールにてお申し出いただければ、次回更新分から停止いたします(日割り返金はございません)。",
  ],
  ["動作環境", "インターネットに接続されたスマートフォン・パソコンのWebブラウザ、およびLINEアプリ"],
];

export default function TokushohoPage() {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 20, marginBottom: 24 }}>特定商取引法に基づく表記</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {ROWS.map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 16px 10px 0",
                  width: 180,
                  verticalAlign: "top",
                  color: "#555",
                  fontWeight: 600,
                }}
              >
                {label}
              </th>
              <td style={{ padding: "10px 0", verticalAlign: "top" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
