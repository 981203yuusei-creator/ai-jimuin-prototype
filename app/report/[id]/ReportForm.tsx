"use client";

import { useState, useEffect } from "react";

const WORKER_NAME_STORAGE_KEY = "jimuassi_report_worker_name";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 日付・時刻は日本時間の現地入力としてそのまま扱い、送信時にJST(+09:00)を明示して
// タイムゾーンのズレを防ぐ。
function toJstIso(dateValue: string, timeValue: string): string | null {
  if (!dateValue || !timeValue) return null;
  return `${dateValue}T${timeValue}:00+09:00`;
}

export default function ReportForm({ jobId }: { jobId: string }) {
  const now = new Date();
  const [workerName, setWorkerName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(WORKER_NAME_STORAGE_KEY);
    if (saved) setWorkerName(saved);
  }, []);
  const [workDate, setWorkDate] = useState(() => toDateValue(now));
  const [startedTime, setStartedTime] = useState("");
  const [completedTime, setCompletedTime] = useState(() => toTimeValue(now));
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    localStorage.setItem(WORKER_NAME_STORAGE_KEY, workerName);

    const formData = new FormData();
    formData.set("workerName", workerName);
    formData.set("startedAt", toJstIso(workDate, startedTime) ?? "");
    formData.set("completedAt", toJstIso(workDate, completedTime) ?? "");
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
      <div style={{ textAlign: "center" }}>
        <p>報告を受け付けました。お疲れ様でした。</p>
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: 8, boxSizing: "border-box" as const, fontSize: 16 };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>担当者名</label>
        <input
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>作業日</label>
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 4 }}>開始時刻</label>
          <input
            type="time"
            value={startedTime}
            onChange={(e) => setStartedTime(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 4 }}>完了時刻</label>
          <input
            type="time"
            value={completedTime}
            onChange={(e) => setCompletedTime(e.target.value)}
            style={inputStyle}
          />
        </div>
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
  );
}
