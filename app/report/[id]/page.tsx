"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

// datetime-local入力は日本時間の現地時刻としてそのまま扱い、送信時にJST(+09:00)を明示して
// タイムゾーンのズレを防ぐ。
function toJstIso(datetimeLocalValue: string): string | null {
  if (!datetimeLocalValue) return null;
  return `${datetimeLocalValue}:00+09:00`;
}

export default function ReportPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [workerName, setWorkerName] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [completedAt, setCompletedAt] = useState(() => toDatetimeLocalValue(new Date()));
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
    formData.set("workerName", workerName);
    formData.set("startedAt", toJstIso(startedAt) ?? "");
    formData.set("completedAt", toJstIso(completedAt) ?? "");
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

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 18, marginBottom: 24 }}>作業完了報告</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>担当者名</label>
          <input value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>作業開始時間</label>
          <input
            type="datetime-local"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>完了時刻</label>
          <input
            type="datetime-local"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            style={inputStyle}
          />
        </div>
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
            style={inputStyle}
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
