import { getLatestNoteDraft } from "../../../lib/notePost";
import CopyButton from "./CopyButton";

export const dynamic = "force-dynamic";

export default async function NoteDraftPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!process.env.NOTE_DRAFT_TOKEN || searchParams.token !== process.env.NOTE_DRAFT_TOKEN) {
    return <p style={{ padding: 24 }}>アクセスできません。</p>;
  }

  const draft = await getLatestNoteDraft();

  if (!draft) {
    return <p style={{ padding: 24 }}>まだ下書きがありません。</p>;
  }

  const fullText = draft.paragraphs.join("\n\n");

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <p style={{ fontSize: 12, color: "#888" }}>
        {new Date(draft.createdAt).toLocaleString("ja-JP")} 生成
      </p>
      <h1 style={{ fontSize: 22, marginTop: 8, marginBottom: 20 }}>{draft.title}</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, lineHeight: 1.9, fontSize: 15 }}>
        {draft.paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: 16 }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <CopyButton text={draft.title} label="タイトルをコピー" />
        <CopyButton text={fullText} label="本文をコピー" />
      </div>
      <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
        左: タイトルをコピー / 右: 本文をコピー。noteの新規投稿画面に貼り付けてください。
      </p>
    </div>
  );
}
