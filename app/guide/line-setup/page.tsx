const CALENDAR_SHARE_EMAIL = "jimuassi-calendar@gen-lang-client-0003463102.iam.gserviceaccount.com";
const WEBHOOK_URL = "https://ai-jimuin-prototype-shimo1.vercel.app/api/webhook/line";

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 17, marginBottom: 8 }}>
        STEP {number}. {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: "8px 12px",
        fontFamily: "monospace",
        fontSize: 13,
        wordBreak: "break-all",
        marginTop: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

export default function LineSetupGuidePage() {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>LINE公式アカウント連携マニュアル</h1>
      <p style={{ fontSize: 14, color: "#555", marginBottom: 32 }}>
        ジムアシをご利用いただくには、お客様の会社専用のLINE公式アカウントをご用意いただき、
        その情報をジムアシに登録していただく必要があります。少し工程がありますが、
        このページの順番どおりに進めていただければ問題ありません。1つのステップに5〜10分ほどかかります。
      </p>

      <Step number={1} title="LINE公式アカウントを作る">
        <p>
          すでにLINE公式アカウントをお持ちの場合は、このステップは飛ばして構いません。
        </p>
        <ol>
          <li>
            <a href="https://www.linebiz.com/jp/entry/" target="_blank" rel="noreferrer">
              https://www.linebiz.com/jp/entry/
            </a>{" "}
            にアクセスする
          </li>
          <li>「アカウントを開設(無料)」を選び、案内に沿って会社名・業種などを入力する</li>
        </ol>
      </Step>

      <Step number={2} title="Messaging APIを有効にする">
        <ol>
          <li>
            <a href="https://manager.line.biz/" target="_blank" rel="noreferrer">
              https://manager.line.biz/
            </a>{" "}
            (LINE Official Account Manager)に、STEP1で作ったアカウントでログインする
          </li>
          <li>左側メニューの「設定」→「Messaging API」を開く</li>
          <li>「Messaging APIを利用する」ボタンを押す</li>
          <li>「プロバイダー」を聞かれたら、新規で名前(会社名など)を入力して作成する</li>
          <li>これで画面に「チャネルID」などの情報が表示されるようになります</li>
        </ol>
      </Step>

      <Step number={3} title="必要な情報をコピーする(LINE Developersコンソール)">
        <ol>
          <li>
            <a href="https://developers.line.biz/console/" target="_blank" rel="noreferrer">
              https://developers.line.biz/console/
            </a>{" "}
            に、STEP2と同じアカウントでログインする
          </li>
          <li>STEP2で作ったプロバイダー→チャネル(Messaging API)を選ぶ</li>
          <li>
            「チャネル基本設定」タブを開き、以下の2つをコピーしてメモしておく
            <ul>
              <li>チャネルID</li>
              <li>チャネルシークレット</li>
            </ul>
          </li>
          <li>
            「Messaging API設定」タブに切り替え、下の方にある「チャネルアクセストークン(長期)」の
            「発行」ボタンを押し、表示された文字列をコピーしてメモしておく
          </li>
        </ol>
      </Step>

      <Step number={4} title="Webhookを設定する">
        <p>同じ「Messaging API設定」タブの中で、以下を設定します。</p>
        <ol>
          <li>
            「Webhook URL」の欄に、下記のURLを入力して「更新」を押す
            <Code>{WEBHOOK_URL}</Code>
          </li>
          <li>「Webhookの利用」のスイッチをオンにする</li>
          <li>
            「応答メッセージ」をオフにする(オンのままだと、LINEの自動返信とジムアシの返信が
            両方届いてしまいます)
          </li>
          <li>「あいさつメッセージ」は、お好みでオフにしてください</li>
        </ol>
      </Step>

      <Step number={5} title="Googleカレンダーと連携する(任意)">
        <p>予定を自動でカレンダーに登録したい場合のみ設定してください。</p>
        <ol>
          <li>Googleカレンダーで、ジムアシ用のカレンダーを新しく作る(既存のものでも構いません)</li>
          <li>
            そのカレンダーの「設定と共有」を開き、「特定のユーザーとの共有」に以下のメールアドレスを
            「予定の変更権限」で追加する
            <Code>{CALENDAR_SHARE_EMAIL}</Code>
          </li>
          <li>同じ設定画面の下の方「カレンダーの統合」欄にある「カレンダーID」をコピーする</li>
        </ol>
      </Step>

      <Step number={6} title="ジムアシに登録する">
        <ol>
          <li>ジムアシのダッシュボードにログインする</li>
          <li>右上の「設定」を開き、「LINE連携設定」の欄に、STEP3・STEP5でコピーした値をそれぞれ入力する</li>
          <li>「保存」を押す</li>
          <li>
            LINE公式アカウントを「友だち追加」し、実際にメッセージを送って、返信が届くか確認する
          </li>
        </ol>
      </Step>

      <Step number={7} title="お客様に「友だち追加」してもらう">
        <p>
          LINE公式アカウントは、お客様が「友だち追加」をしないとメッセージのやり取りができません。
          以下のいずれかの方法で、普段お使いのお客様にアカウントを見つけてもらいましょう。
        </p>
        <ol>
          <li>
            <a href="https://manager.line.biz/" target="_blank" rel="noreferrer">
              LINE Official Account Manager
            </a>{" "}
            にログインし、左側メニューの「トークルーム管理」→「あいさつメッセージ」や
            「ホーム」画面から、友だち追加用の<strong>QRコード</strong>を確認・ダウンロードできます
          </li>
          <li>同じ画面で、友だち追加用の<strong>URL</strong>(lin.ee から始まるリンク)も発行できます</li>
          <li>
            QRコードを名刺・チラシ・請求書・お店の張り紙などに印刷しておくと、お客様がスマホのカメラで
            読み取るだけで友だち追加できます
          </li>
          <li>
            URLは、ホームページやSNSのプロフィールに貼っておくと、そこからワンタップで友だち追加できます
          </li>
        </ol>
      </Step>

      <div
        style={{
          marginTop: 32,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 6,
          fontSize: 13,
          color: "#555",
        }}
      >
        <strong>うまくいかない場合</strong>
        <p style={{ marginTop: 6 }}>
          「保存」しても連携できない場合は、STEP3でコピーした3つの値(チャネルID・チャネルシークレット・
          チャネルアクセストークン)に余分な空白が入っていないか、コピー漏れがないかをご確認ください。
        </p>
      </div>
    </div>
  );
}
