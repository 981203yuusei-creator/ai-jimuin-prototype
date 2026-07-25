"use client";

import { useState } from "react";

export type JobRow = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  workType: string | null;
  urgency: string;
  status: string;
  calendarEventId: string | null;
  createdAt: string;
  photoUrl: string | null;
  reportComment: string | null;
  reportPhotoUrl: string | null;
  reportWorkerName: string | null;
  reportStartedAt: string | null;
  reportCompletedAt: string | null;
};

function formatJstDate(value: string | null): string | null {
  return value
    ? new Date(value).toLocaleDateString("ja-JP", {
        timeZone: "Asia/Tokyo",
        month: "numeric",
        day: "numeric",
      })
    : null;
}

function formatJstTime(value: string | null): string | null {
  return value
    ? new Date(value).toLocaleTimeString("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
}

const URGENCY_OPTIONS = [
  { value: "high", label: "急ぎ" },
  { value: "normal", label: "通常" },
  { value: "low", label: "低" },
];

const STATUS_OPTIONS = [
  { value: "collecting", label: "受付中" },
  { value: "completed", label: "受付完了(対応待ち)" },
  { value: "done", label: "作業完了" },
];

function OpenReportButton({ jobId }: { jobId: string }) {
  return (
    <a
      href={`/report/${jobId}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-block",
        padding: "4px 10px",
        border: "1px solid #999",
        borderRadius: 4,
        whiteSpace: "nowrap",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      報告書を開く
    </a>
  );
}

function EditableRow({ job }: { job: JobRow }) {
  const [values, setValues] = useState({
    name: job.name ?? "",
    phone: job.phone ?? "",
    address: job.address ?? "",
    workType: job.workType ?? "",
    urgency: job.urgency,
    status: job.status,
  });
  const [calendarEventId, setCalendarEventId] = useState(job.calendarEventId);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/dashboard/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      const body = await res.json();
      setCalendarEventId(body.job.calendarEventId);
      setSavedAt(Date.now());
    }
  }

  const inputStyle = { width: "100%", padding: 4, boxSizing: "border-box" as const };
  const selectStyle = { ...inputStyle, minWidth: 90 };

  const workDate = formatJstDate(job.reportCompletedAt ?? job.reportStartedAt);
  const startTime = formatJstTime(job.reportStartedAt);
  const endTime = formatJstTime(job.reportCompletedAt);

  return (
    <tr style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        {new Date(job.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </td>
      <td style={{ padding: 8, minWidth: 140 }}>
        <select
          value={values.status}
          onChange={(e) => set("status", e.target.value)}
          style={selectStyle}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.address} onChange={(e) => set("address", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={values.workType} onChange={(e) => set("workType", e.target.value)} style={inputStyle} />
      </td>
      <td style={{ padding: 8, minWidth: 80 }}>
        <select
          value={values.urgency}
          onChange={(e) => set("urgency", e.target.value)}
          style={selectStyle}
        >
          {URGENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: 8 }}>
        {job.photoUrl ? (
          <a href={job.photoUrl} target="_blank" rel="noreferrer">
            <img src={job.photoUrl} alt="現場写真" style={{ height: 48 }} />
          </a>
        ) : (
          "-"
        )}
      </td>
      <td style={{ padding: 8 }}>{calendarEventId ? "登録済み" : "-"}</td>
      <td style={{ padding: 8, maxWidth: 220 }}>
        {job.reportPhotoUrl && (
          <a href={job.reportPhotoUrl} target="_blank" rel="noreferrer">
            <img src={job.reportPhotoUrl} alt="作業完了写真" style={{ height: 48, display: "block" }} />
          </a>
        )}
        {job.reportWorkerName && (
          <div style={{ fontSize: 12, marginTop: 4 }}>担当: {job.reportWorkerName}</div>
        )}
        {workDate && (
          <div style={{ fontSize: 12, color: "#555" }}>
            {workDate} {startTime ?? "?"} 〜 {endTime ?? "?"}
          </div>
        )}
        {job.reportComment && (
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{job.reportComment}</div>
        )}
        {!job.reportPhotoUrl && !job.reportWorkerName && !workDate && !job.reportComment && "-"}
      </td>
      <td style={{ padding: 8 }}>
        <OpenReportButton jobId={job.id} />
      </td>
      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        {savedAt && <span style={{ marginLeft: 6, color: "green" }}>✓</span>}
      </td>
    </tr>
  );
}

export default function JobsTable({ jobs }: { jobs: JobRow[] }) {
  if (jobs.length === 0) {
    return <p>まだ案件がありません。</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: 8 }}>受付日時</th>
            <th style={{ padding: 8 }}>状態</th>
            <th style={{ padding: 8 }}>お名前</th>
            <th style={{ padding: 8 }}>電話番号</th>
            <th style={{ padding: 8 }}>住所</th>
            <th style={{ padding: 8 }}>工事内容</th>
            <th style={{ padding: 8 }}>緊急度</th>
            <th style={{ padding: 8 }}>写真</th>
            <th style={{ padding: 8 }}>カレンダー</th>
            <th style={{ padding: 8 }}>作業報告</th>
            <th style={{ padding: 8 }}></th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <EditableRow key={job.id} job={job} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
