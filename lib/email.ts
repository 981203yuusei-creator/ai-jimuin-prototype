export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendPasswordResetEmail skipped: RESEND_API_KEY is not set");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ジムアシ <onboarding@resend.dev>",
      to,
      subject: "【ジムアシ】パスワード再設定のご案内",
      text: [
        "パスワード再設定のリクエストを受け付けました。",
        "以下のリンクから新しいパスワードを設定してください(1時間有効です)。",
        "",
        resetUrl,
        "",
        "心当たりがない場合は、このメールを無視してください。",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("sendPasswordResetEmail failed:", await res.text());
    return false;
  }
  return true;
}
