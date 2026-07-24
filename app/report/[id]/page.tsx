"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReportPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("comment", comment);
    if (photo) formData.set("photo", photo);

    const res = await fetch(`/api/report/${jobId}`, { method: "POST", body: formData });
    setSubmitting(false);

    if (!res.ok) {
      setError("送信に失敗しました。もう一度お試しください。");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif", textAlign: "center" }}>
        <p>報告を受け付けました。お疲れ様でした。</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 18, marginBottom: 24 }}>作業完了報告</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>作業完了後の写真</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>コメント(任意)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
        <button type="submit" disabled={submitting} style={{ width: "100%", padding: 8 }}>
          {submitting ? "送信中..." : "報告を送信"}
        </button>
      </form>
    </div>
  );
}
